import { Injectable, NgZone } from "@angular/core";
import { GameField, GameStateService } from "./game-state.service";
import { Observable, Subject, takeUntil, timer } from "rxjs";

const dxdy = {
    'влево': [-1, 0],
    'вправо': [1, 0],
    'вверх': [0, -1],
    'вниз': [0, 1]
} as const;
  
type Direction = keyof typeof dxdy;

@Injectable({
    providedIn: 'root'
})

export class SimulationService {
  private field: GameField = { id_game_field: 1, width: 10, height: 10, energy: 10, layout_array: [] };
  private delay = 1000;
  private commands: string[] = [];
  private pointer = 0;
  private isRunning = false;
  private stop$ = new Subject<void>();

  constructor(
    private gameStateService: GameStateService,
    private ngZone: NgZone
  ) {}

  simulateFromString(commandStr: string, delay: number = 500, fieldID: number): { done$: Observable<void>, log$: Observable<string> } {
    if (this.isRunning) throw new Error('Симуляция уже запущена');

    this.stop$ = new Subject<void>();
    this.isRunning = true;
    this.commands = this.parseCommands(commandStr);
    this.delay = delay;
    this.pointer = 0;

    const done$ = new Subject<void>();
    const log$ = new Subject<string>();

    this.gameStateService.getGameField().subscribe(f => {
      this.field = { ...f };
      this.runNextCommand(done$, log$);
    });

    done$.subscribe({
      complete: () => this.isRunning = false,
      error: () => this.isRunning = false
    });

    return { done$: done$.asObservable(), log$: log$.asObservable() };
  }

  stopSimulation(): void {
    this.stop$.next();
    this.stop$.complete();
    this.isRunning = false;
  }

  private async runNextCommand(done: Subject<void>, log: Subject<string>) {
    try {
      while (this.pointer < this.commands.length) {
        const cmd = this.commands[this.pointer++];
        this.executeCommand(cmd);
  
        // Обновляем поле внутри зоны Angular
        this.ngZone.run(() => {
          this.gameStateService.setGameField({ ...this.field });
        });
  
        // Даем Angular дорендерить DOM
        await new Promise(resolve => setTimeout(resolve, 0));
  
        // Основная задержка между шагами (например, 1000 мс)
        await new Promise(resolve => setTimeout(resolve, this.delay));
      }
  
      done.complete();
    } catch (error) {
      done.error(error);
    }
  }

  private executeCommand(command: string) {
    const pos = this.getAntPosition();
    if (pos === -1) throw 'Муравей не найден';

    if (!(command in dxdy)) throw `Неизвестная команда: ${command}`;

    const [dx, dy] = dxdy[command as Direction];

    const x = pos % this.field.width;
    const y = Math.floor(pos / this.field.width);
    const newX = x + dx;
    const newY = y + dy;
    
    // Расчёт поля остановки
    if (newX < 0 || newX >= this.field.width || newY < 0 || newY >= this.field.height) {
      throw 'Нельзя покинуть игровое поле';
    }

    const target = newY * this.field.width + newX;
    const field = this.field.layout_array.slice(); // Создаем новый массив
    const targetValue = field[target];

    // Проверка поля остановки
    if (targetValue === 3) throw 'Исполнитель упал в лунку';

    if (targetValue === 2) { // Сбор монеты
      field[target] = 4;
      field[pos] = 0;
    }
    else if (targetValue === 1) { // Толкаем камень
      const nextX = newX + dx;
      const nextY = newY + dy;
      if (nextX < 0 || nextX >= this.field.width || nextY < 0 || nextY >= this.field.height) { // Толкаем за поле
        throw 'За камнем препятствие';
      }
      const nextTarget = nextY * this.field.width + nextX;
      if (field[nextTarget] === 0) { // За камнем пусто
        field[nextTarget] = 1;
        field[target] = 4;
        field[pos] = 0;
      }
      else if (field[nextTarget] === 3) { // За камнем лунка
        field[nextTarget] = 0;
        field[target] = 4;
        field[pos] = 0;
      }
      else {
        throw 'За камнем препятствие';
      }
    }
    else { // Простое перемещение
      field[target] = 4;
      field[pos] = 0;
    }

    this.field = {
      ...this.field,
      layout_array: [...field]
    };
  }

  private getAntPosition(): number {
    return this.field.layout_array.findIndex(cell => cell === 4);
  }

  private parseCommands(commandStr: string): string[] {
    const commandMap = ['вверх', 'вниз', 'вправо', 'влево'];
    const tokens = commandStr.split(',').map(t => parseInt(t.trim(), 10));
    let i = 0;

    const expand = (): string[] => {
      const result: string[] = [];

      while (i < tokens.length) {
        const token = tokens[i];

        if (token >= 0 && token <= 3) {
          result.push(commandMap[token]);
          i++;
        } else if (token === 4) {
          const repeat = tokens[i + 1];
          i += 2;
          const body: string[] = [];

          while (i < tokens.length && tokens[i] !== 5) {
            body.push(...expand());
          }

          if (tokens[i] !== 5) throw 'Ожидался конец цикла (5)';
          i++;

          for (let r = 0; r < repeat; r++) {
            result.push(...body);
          }
        } else if (token === 5) {
          break;
        } else {
          throw `Неизвестная команда: ${token}`;
        }
      }

      return result;
    };

    return expand();
  }
}
