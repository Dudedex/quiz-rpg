import {GameStats} from './game-stats';

export class Game {
    public name: string;
    public startTime: number;
    public players: string[];
    public numOfQuestions: number;
    public questionProgress: any;
    public gameStats: GameStats[];
}

