import {AnswerOption} from './answer-option';
import {QuestionType} from './question-type';
import {ImageSearch} from './image-search';

export class Question {
    public uuid: string;
    public type: QuestionType;
    public title: string;
    public options: AnswerOption[] = [];
    public imageSearch: ImageSearch;
    public wrongAnswerHint: string;
    public wrongAnswerPenalty = 8;
    public rigthAnswerSequel: string;
    public rightAnswerScreenTime = 3;
}
