import { HttpParams, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, shareReplay } from 'rxjs';

export interface GameField {
  fieldID: number;
  width: number,
  height: number,
  energy: number,
  gameField: number[]
}

export interface GameElement {
  count: number;
  max: number;
  index: number;
}

@Injectable({
  providedIn: 'root'
})

export class GameStateService {
  private gfSubject: BehaviorSubject<GameField>; // Храним состояние поля через BehaviorSubject
  private elementImages: Record<number, string> = {
    0: 'assets/empty.png',
    1: 'assets/rock.png',
    2: 'assets/coin.png',
    3: 'assets/hole.png',
    4: 'assets/ant.png'
  };

  private ge: GameElement[] = [];

  constructor(private http: HttpClient){
      const initialField: GameField = {
        fieldID: 1,
        width: 10,
        height: 10,
        gameField: Array(100).fill(0),
        energy: 10
      };
    
      this.gfSubject = new BehaviorSubject<GameField>(initialField);
      this.updateGameElements(10, 10, 0, 0, 0);
  }

  private updateGameElements(width: number, heigth: number, rocks: number, holes: number, coins?: number): void {
    const totalCells = width * heigth;
    this.ge = [
      {index: 0, count: totalCells, max: totalCells},
      {index: 1, count: rocks, max: Math.floor(0.3 * totalCells)},
      {index: 2, count: coins ? coins : 0, max: coins ? Math.floor(0.1 * totalCells) : 0},
      {index: 3, count: holes, max: Math.floor(0.2 * totalCells)},
      {index: 4, count: 1, max: 1}
    ];
  }

  // Получить Observable поля
  getGameField(gameFieldID?: number): Observable<GameField> {
    if (gameFieldID !== undefined) {
      const params = new HttpParams().set('gameFieldID', gameFieldID.toString());
  
      return this.http.get<GameField>('/api/evaluation', { params }).pipe(
        map((field) => {
          this.gfSubject.next(field);
          return field;
        }),
        shareReplay(1) // кэшируем результат для подписчиков
      );
    }
  
    // Если id не передан — возвращаем локальное поле (например, сгенерированное)
    return this.gfSubject.asObservable();
  }

  sendGameField(gf: GameField): Observable<GameField>{
      return this.http.post<GameField>('/api/rating', gf);
  }

  newGameFieldId(gameField: Partial<GameField>, isNewTask: boolean): Observable<GameField> {
    if (!isNewTask) {
      // Оставляем существующий id
      return of(gameField as GameField);
    }
  
    // Новый id — запрашиваем с сервера
    return this.http.get<number>('/api/gamefield/new-id').pipe(
        map((newId: number) => ({
          ...gameField,
          fieldID: newId
        } as GameField))
    );
  }

  // Автоматическое создание поля
  generateGameField(width: number, height: number, rocks: number, holes: number, coins?: number): void {
    const cells = width * height;
    const gameField = Array(cells).fill(0);

    // Метод случайной расстановки
    const placeRandomly = (index: number, count: number) => {
      let placed = 0;
      while (placed < count) {
        // Генерируем случайный индекс
        const pos = Math.floor(Math.random() * cells);
        // Проверяем клетку на пустоту
        if (gameField[pos] === 0){
          gameField[pos] = index;
          placed++;
        }
      }
    };

    placeRandomly(1, rocks); // Расставляем камни
    placeRandomly(3, holes); // Расставляем лунки
    if (coins) placeRandomly(2, coins); // Расставляем монеты
    placeRandomly(4, 1); // Ставим муравья

    this.updateGameElements(width, height, rocks, holes, coins);

    const newField: GameField = {
      fieldID: this.gfSubject.value.fieldID,
      width,
      height,
      energy: 10,
      gameField,
    };

    this.gfSubject.next(newField);
  }

  // Ручное создание поля
  createEmptyField(width: number, height: number): void {
    const cells = width * height;
    const gameField = Array(cells).fill(0);

    this.updateGameElements(width, height, 0, 0, 0);

    const newField: GameField = {
      fieldID: this.gfSubject.value.fieldID,
      width,
      height,
      energy: 10,
      gameField
    };

    this.gfSubject.next(newField);
  }

  getGameElements(){
    return this.ge;
  }

  // Получить фото элемента
  getElementImage(index: number): string {
      return this.elementImages[index];
  }
}