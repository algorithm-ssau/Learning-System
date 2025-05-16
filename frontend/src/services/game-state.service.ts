import { HttpParams, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, shareReplay, switchMap } from 'rxjs';
import { Task } from './evaluation.service';
import { environment } from 'src/environments/environment.prod';

export interface GameField {
  id_game_field?: number;
  width: number,
  height: number,
  energy: number,
  layout_array: number[]
}

export interface GameElement {
  count: number;
  max: number;
  index: number;
}

export interface TaskData {
  width: number,
  length: number,
  type: string,
  createMethod: string,
  rocks: number,
  holes: number,
  coins?: number
}

@Injectable({
  providedIn: 'root'
})

export class GameStateService {
  private gfSubject: BehaviorSubject<GameField>; // Храним состояние поля через BehaviorSubject
  public gameField$: Observable<GameField>;
  private elementImages: Record<number, string> = {
    0: 'assets/empty.png',
    1: 'assets/rock.png',
    2: 'assets/coin.png',
    3: 'assets/hole.png',
    4: 'assets/ant.png'
  };

  private taskType: number = 0;

  private ge: GameElement[] = [];

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient){
      const initialField: GameField = {
        width: 10,
        height: 10,
        layout_array: [
          4, 2, 1, 0, 1, 0, 0, 0, 0, 0,
          0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
        energy: 10
      };
    
      this.gfSubject = new BehaviorSubject<GameField>(initialField);
      this.gameField$ = this.gfSubject.asObservable();
      this.updateGameElements(10, 10, 3, 1, 1);
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

  getGameField(gameFieldID?: number): Observable<GameField> {
    if (gameFieldID !== undefined) {
      return this.http.get<GameField>(`${this.apiUrl}/gamefields/${gameFieldID}`).pipe(
        map((field) => {
          const parsedField: GameField = {
            ...field,
            layout_array: JSON.parse(field.layout_array as unknown as string),
          };
          this.setGameField(parsedField);
          return parsedField;
        }),
        shareReplay(1)
      );
    }

    return this.gameField$;
  }

  setGameField(field: GameField): void {
    // Гарантированное создание нового объекта
    console.log('Обновление поля:', field.layout_array);
    this.gfSubject.next(field);
  }

  setTaskType(type: string) {
    if (type == "collect-coins") this.taskType = 1;
    else if (type == "place-stones") this.taskType = 2;
    else this.taskType = 3;
  }
  getTaskType(): number {
    return this.taskType;
  }

  // Принятие данных с форма
  handleTaskCreation(taskData: TaskData): void {
    this.setTaskType(taskData.type);
    // Корректировка данных по типу задания
    if (taskData.type === 'place-stones') {
      taskData.coins = 0;
    }
  
    if (taskData.createMethod === 'automatic') {
      this.generateGameField(taskData);
    } else {
      this.createEmptyField(taskData);
    }
  }

  // Автоматическое создание поля
  generateGameField(taskData: TaskData): void {
    const cells = taskData.width * taskData.length;
    const layout_array = Array(cells).fill(0);

    // Метод случайной расстановки
    const placeRandomly = (index: number, count: number) => {
      let placed = 0;
      while (placed < count) {
        // Генерируем случайный индекс
        const pos = Math.floor(Math.random() * cells);
        // Проверяем клетку на пустоту
        if (layout_array[pos] === 0){
          layout_array[pos] = index;
          placed++;
        }
      }
    };

    placeRandomly(1, taskData.rocks); // Расставляем камни
    placeRandomly(3, taskData.holes); // Расставляем лунки
    if (taskData.coins) placeRandomly(2, taskData.coins); // Расставляем монеты
    placeRandomly(4, 1); // Ставим муравья

    this.updateGameElements(taskData.width, taskData.length, taskData.rocks, taskData.holes, taskData.coins);

    const newField: GameField = {
      id_game_field: this.gfSubject.value.id_game_field,
      width: taskData.width,
      height: taskData.length,
      energy: 10,
      layout_array,
    };

    this.gfSubject.next(newField);
  }

  // Ручное создание поля
  createEmptyField(taskData: TaskData): void {
    const cells = taskData.width * taskData.length;
    const layout_array = Array(cells).fill(0);

    this.updateGameElements(taskData.width, taskData.length, 0, 0, 0);

    const newField: GameField = {
      id_game_field: this.gfSubject.value.id_game_field,
      width: taskData.width,
      height: taskData.length,
      energy: 10,
      layout_array
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

  // Сохранение нового игрового поля (POST), получение fieldID от бэка
  newGameFieldId(gameField: GameField): Observable<GameField> {
    const payload = {
      width: gameField.width, 
      height: gameField.height,
      energy: gameField.energy,
      layout_array: JSON.stringify(gameField.layout_array)
    };
    console.log('Отправка игрового поля:', payload);
    return this.http.post<GameField>(`${this.apiUrl}/gamefields`, payload).pipe(
      map(field => ({
        ...field,
        gameField: JSON.parse(field.layout_array as unknown as string) // десериализация на выходе
      }))
    );
  }

  // Обновление существующего игрового поля
  sendGameField(gameField: GameField): Observable<GameField> {
    const payload = {
      width: gameField.width, 
      height: gameField.height,
      energy: gameField.energy,
      layout_array: JSON.stringify(gameField.layout_array)
    };
    console.log('Отправка игрового поля:', payload);
    return this.http.put<GameField>(`${this.apiUrl}/gamefields/${gameField.id_game_field}`, payload).pipe(
      map(field => ({
        ...field,
        gameField: JSON.parse(field.layout_array as unknown as string)
      }))
    );
  }

  // Сохранение задания
  sendTask(task: Task): Observable<Task> {
    const newTask = {
      name: task.name,
      id_game_field: task.id_game_field!,
      id_goal: task.id_goal
    };
    console.log('Отправка задания:', newTask);
    return this.http.post<Task>(`${this.apiUrl}/tasks`, newTask);
  }

  deleteTask(fieldID: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${fieldID}`).pipe(
      switchMap(() => this.http.delete<void>(`${this.apiUrl}/gamefields/${fieldID}`))
    );
  }
}