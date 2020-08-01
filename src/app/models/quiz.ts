import {Question} from './question';

export class Quiz {
    public isNew = false;
    public name: string;
    public questions: Question[] = [];
}
