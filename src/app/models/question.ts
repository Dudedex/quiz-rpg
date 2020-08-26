import {AnswerOption} from './answer-option';
import {QuestionType} from './question-type';
import {ImageSearch} from './image-search';
import {CheckInFlows} from './check-in-flows';

export class Question {
    public uuid: string;
    public type: QuestionType;
    public title: string;
    public options: AnswerOption[] = [];
    public checkInFlows: CheckInFlows[] = [];
    public imageSearch: ImageSearch;
    public wrongAnswerHint: string;
    public wrongAnswerPenalty: number;
    public rigthAnswerSequel: string;
    public rightAnswerScreenTime: number;
    public requiredSteps: number;
    public skipTimer: number;
    public introTimer: number;
    public intro: string;
}
