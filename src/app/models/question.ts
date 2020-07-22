import {AnswerOption} from './answer-option';
import {QuestionType} from './question-type';
import {ImageSearch} from './image-search';

export class Question {
    public type: QuestionType;
    public title: string;
    public searchedImage: ImageSearch;
    public options: AnswerOption[] = [];
    public imageSearch: ImageSearch;
    public wrongAnswerHint: string;
}
