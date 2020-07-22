import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Question} from '../models/question';
import {AnswerOption} from '../models/answer-option';
import {QuestionType} from '../models/question-type';

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html'
})
export class QuestionComponent implements OnInit, OnChanges {

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

    ngOnChanges(changes: SimpleChanges): void {
        this.errorPenalty = false;
        this.seconds = undefined;
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

    public isImageSearch() {
        return this.question.type === QuestionType.IMAGE_SEARCH;
    }

    public checkImage(event: any) {
        console.log(event);
        console.log(this.question.imageSearch);
        console.log(this.question.imageSearch.left);
        console.log(this.question.imageSearch.right);
        console.log(this.question.imageSearch.top);
        console.log(this.question.imageSearch.bottom);
        console.log(this.question.imageSearch.left > event.screenX);
        console.log(this.question.imageSearch.top < event.screenY);
        console.log(this.question.imageSearch.right < event.screenX);
        console.log(this.question.imageSearch.bottom > event.screenY);
        if (this.question.imageSearch.left < event.screenX
                || this.question.imageSearch.top < event.screenY
                || this.question.imageSearch.right > event.screenX
                || this.question.imageSearch.bottom > event.screenY) {
            console.log('error');
            this.startErrorTimer();
        } else {
            console.log('correct');
            //this.questionAnsweredCorrectly();
        }
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
            this.submitted = true;
            this.questionCorrect.emit();
        }
    }


}
