import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Question} from '../models/question';
import {AnswerOption} from '../models/answer-option';
import {QuestionType} from '../models/question-type';

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.sass']
})
export class QuestionComponent implements OnInit {

    @Input()
    public question: Question;

    @Output()
    public questionCorrect = new EventEmitter<void>();

    public errorPenalty: boolean;
    public seconds: number;
    private submitted: boolean;

    constructor() {
    }

    ngOnInit() {
        this.submitted = false;
    }

    public checkRadioOption(option: AnswerOption) {
        if (this.errorPenalty) {
            return;
        }
        if (option.correct) {
            this.questionAnsweredCorrectly();
        } else {
            this.startErrorTimer();
        }
    }

    public checkCheckboxOptions() {
        for (const answer of this.question.options) {
            if ((answer.correct && !answer.checked) || (!answer.correct && answer.checked)) {
                this.startErrorTimer();
            }
        }

        this.questionAnsweredCorrectly();
    }

    public isCheckboxType() {
        return this.question.type === QuestionType.CHECKBOX;
    }

    public isRadioType() {
        return this.question.type === QuestionType.RADIO;
    }

    private startErrorTimer() {
        if (this.errorPenalty) {
            return;
        }
        this.errorPenalty = true;
        this.countErrorTime(5);
        setTimeout(() => {
            this.errorPenalty = false;
        }, 5000);
    }

    private countErrorTime(timeInSeconds: number) {
        if (timeInSeconds <= 0) {
            return;
        }
        this.seconds = timeInSeconds;
        setTimeout(() => {
            this.countErrorTime(timeInSeconds - 1);
        }, 1000);
    }

    private questionAnsweredCorrectly() {
        if (!this.submitted) {
            console.log('submitting');
            this.submitted = true;
            this.questionCorrect.emit();
        }
    }
}
