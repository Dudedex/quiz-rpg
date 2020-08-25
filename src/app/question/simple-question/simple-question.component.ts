import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {QuestionType} from '../../models/question-type';
import {Question} from '../../models/question';
import {ApiClientService} from '../../api-client.service';
import {AnswerOption} from '../../models/answer-option';

@Component({
    selector: 'app-simple-question',
    templateUrl: './simple-question.component.html'
})
export class SimpleQuestionComponent {

    @Input()
    public question: Question;
    @Input()
    public lobby: string;
    @Input()
    public userToken: string;
    @Input()
    public errorPenalty: boolean;

    @Output()
    public questionAnsweredCorrectly = new EventEmitter();

    @Output()
    public questionAnsweredFalse = new EventEmitter<string>();

    constructor(private apiClientService: ApiClientService) {
    }

    public isCheckboxType() {
        return this.question.type === QuestionType.CHECKBOX;
    }

    public isRadioType() {
        return this.question.type === QuestionType.RADIO;
    }

    public checkRadioOption(selectedAnswer: AnswerOption) {
        if (this.errorPenalty) {
            return;
        }
        for (const option of this.question.options) {
            option.checked = false;
        }
        selectedAnswer.checked = true;
        this.checkAnswer();
    }

    public checkAnswer() {
        if (this.errorPenalty) {
            return;
        }
        const answerIds = this.question.options.filter(o => o.checked).map(o => o.uuid);
        this.apiClientService.checkAnswer(this.lobby, this.userToken, this.question.uuid, answerIds).subscribe((res: any) => {
            if (res.correct) {
                this.questionAnsweredCorrectly.emit();
            } else {
                if (answerIds.length === 1) {
                    this.questionAnsweredFalse.emit(this.question.options.find(a => a.uuid === answerIds[0]).wrongAnswerHint);
                } else {
                    this.questionAnsweredFalse.emit();
                }
            }
        });
    }

}
