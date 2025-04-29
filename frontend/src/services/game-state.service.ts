import { HttpParams, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, shareReplay } from 'rxjs';

export interface GameField {
    fieldID?: number;
    width: number,
    height: number,
    energy: number,
    gameField: number[],
    collectCoins: boolean;
}

export interface GameElement {
    name: string;
    image: string;
    count: number;
    max: number;
    index: number;
}

@Injectable({
    providedIn: 'root'
})

export class GameStateService {
    private gfSubject: BehaviorSubject<GameField>; // Храним состояние поля через BehaviorSubject
    width = 10;
    height = 10;
    ge: GameElement[] = [
        { name: 'Empty', image: 'assets/empty.png', count: 0, max: this.width * this.height, index: 0},
        { name: 'Rock', image: 'assets/rock.png', count: 0, max: 30, index: 1 },
        { name: 'Coin', image: 'assets/coin.png', count: 0, max: 10, index: 2 },
        { name: 'Hole', image: 'assets/hole.png', count: 0, max: 20, index: 3 },
        { name: 'Ant', image: 'assets/ant.png', count: 0, max: 1, index: 4 }
      ];

    constructor(private http: HttpClient){
        const initialField: GameField = {
            width: this.width,
            height: this.height,
            gameField: Array(this.width * this.height).fill(0),
            energy: 10,
            collectCoins: false
        };
      
        this.gfSubject = new BehaviorSubject<GameField>(initialField);
    }

    // Установить новое игровое поле
    setGameField(gameField: GameField) {
        this.gfSubject.next(gameField); // обновляем через next
    }

    // Получить Observable поля
    getGameField(gameFieldID?: number): Observable<GameField> {
        if (this.gfSubject.value) {
          return this.gfSubject.asObservable();
        }
      
        let params = new HttpParams();
        if (gameFieldID !== undefined) {
          params = params.set('gameFieldID', gameFieldID.toString());
        }
      
        this.http.get<GameField>('/api/evaluation', { params }).subscribe(field => {
          this.gfSubject.next(field);
        });
      
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

    // Получить элементы
    getGameElements(): GameElement[] {
        return this.ge;
    }
}