import { Injectable } from "@angular/core";
import { GameField, GameStateService } from "./game-state.service";
import { Observable, Subject, timer } from "rxjs";

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
  private field: GameField = {fieldID: 1, width: 10, height: 10, energy: 10, gameField: []};
  private delay = 200; // Задержка между шагами (в мс)
  private commands: string[] = [];
  private pointer = 0;

  constructor(private gameStateService: GameStateService) {
    this.gameStateService.getGameField().subscribe(f => this.field = { ...f });
  }

  simulateFromString(commandStr: string, delay: number = 500, fieldID: number): { done$: Observable<void>, log$: Observable<string> } {
    this.commands = this.parseCommands(commandStr);
    this.delay = delay;
    this.pointer = 0;
  
    const done$ = new Subject<void>();
    const log$ = new Subject<string>();
    this.gameStateService.getGameField(fieldID).subscribe(f => this.field = { ...f }); // На всякий случай обновляем поле симуляции
  
    this.runNextCommand(done$, log$);
    return { done$: done$.asObservable(), log$: log$.asObservable() };
  }

  private runNextCommand(done: Subject<void>, log: Subject<string>) {
    if (this.pointer >= this.commands.length) {
      done.complete();
      return;
    }

    const cmd = this.commands[this.pointer];
    this.pointer++;

    try {
      this.executeCommand(cmd);
    } catch (e) {
      done.error(e);
      return;
    }

    // Визуальная задержка
    timer(this.delay).subscribe(() => {
      this.runNextCommand(done, log);
    });
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
    
      if (
        newX < 0 || newX >= this.field.width ||
        newY < 0 || newY >= this.field.height
      ) {
        throw 'Нельзя покинуть игровое поле';
      }
    
      const target = newY * this.field.width + newX;
      const field = [...this.field.gameField];
      const targetValue = field[target];
    
      if (targetValue === 3) {
        throw 'Исполнитель упал в лунку';
      }
    
      if (targetValue === 2) {
        field[target] = 4;
        field[pos] = 0;
      } else if (targetValue === 1) {
        const nextX = newX + dx;
        const nextY = newY + dy;
        if (
          nextX < 0 || nextX >= this.field.width ||
          nextY < 0 || nextY >= this.field.height
        ) {
          throw 'За камнем препятствие';
        }
        const nextTarget = nextY * this.field.width + nextX;
        if (field[nextTarget] === 0) {
          field[nextTarget] = 1;
          field[target] = 4;
          field[pos] = 0;
        } else if (field[nextTarget] === 3) {
          field[nextTarget] = 0;
          field[target] = 4;
          field[pos] = 0;
        } else {
          throw 'За камнем препятствие';
        }
      } else {
        field[target] = 4;
        field[pos] = 0;
      }
    
      this.field.gameField = field;
    }

  private getAntPosition(): number {
    return this.field.gameField.findIndex(cell => cell === 4);
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
  
          const bodyStartIndex = i;
          const body: string[] = [];
  
          while (i < tokens.length && tokens[i] !== 5) {
            body.push(...expand());
          }
  
          if (tokens[i] !== 5) throw 'Ожидался конец цикла (5)';
          i++; // пропускаем 5
  
          for (let r = 0; r < repeat; r++) {
            result.push(...body);
          }
        } else if (token === 5) {
          // конец текущего цикла — сигнал к возврату
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
