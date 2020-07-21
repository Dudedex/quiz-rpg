import {AnswerOption} from './answer-option';
import {QuestionType} from './question-type';

export class Question {
    public type: QuestionType;
    public title: string;
    public options: AnswerOption[] = [];
}
