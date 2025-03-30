import { Injectable } from '@angular/core';

export interface GameField {
    width: number,
    height: number,
    energy: number,
    gameField: number[]
}
export interface Task {
    name: string,
    text: string,
    energy: number,
    id_field: number
}

@Injectable({
    providedIn: 'root'
})

export class GameStateService {
    gf: GameField;

    constructor(){
        this.gf = {width: 10, height: 10, gameField: Array(100).fill(0), energy: 10};
    }

    setGameField(gameField: GameField) {
        this.gf = gameField;
    }
    
    getGameField(): GameField {
        return this.gf;
    }

    saveTask(task: Task){
        console.log(task);
    }
}