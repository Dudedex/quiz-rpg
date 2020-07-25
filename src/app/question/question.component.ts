import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Question} from '../models/question';
import {AnswerOption} from '../models/answer-option';
import {QuestionType} from '../models/question-type';
import {AreaData} from '../models/area-data';

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html'
})
export class QuestionComponent implements OnInit, OnChanges {

    @ViewChild('image') public image: ElementRef;

    @Input()
    public question: Question;

    @Output()
    public questionCorrect = new EventEmitter<void>();

    public IMAGE_CONTAINER_MAX_WIDTH = 420;
    public errorPenalty: boolean;
    public seconds: number;
    public questionedOpened: number;
    public skippingImageSearchPossible: boolean;
    public timeRemainingForSkip: number;
    private submitted: boolean;
    public showRightAnswersHint: boolean;

    constructor() {
    }

    ngOnInit() {
        this.submitted = false;
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.errorPenalty = false;
        this.seconds = undefined;
        this.submitted = false;
        this.questionedOpened = Date.now();
        if (this.question.type === QuestionType.IMAGE_SEARCH) {
            this.skippingImageSearchPossible = false;
            this.calcTimeRemainingForSkip(30);
            setTimeout(() => {
                this.skippingImageSearchPossible = true;
            }, 30000);
        }
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
                return;
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

    public areaClicked(area: AreaData) {
        area.checked = true;
        if (this.question.imageSearch.areaData.findIndex(ad => !ad.checked) === -1) {
            this.questionAnsweredCorrectly();
        }
    }

    public getCordsForArea(area: AreaData) {
        // 420 container max-width
        let ratio = 1;
        if (this.image && this.image.nativeElement && this.image.nativeElement.width !== 0) {
            ratio = this.image.nativeElement.width / 420;
        }
        switch (area.shape) {
            case 'circle':
                return area.x1 * ratio + ',' + area.y1 * ratio + ',' + area.radius * ratio;
            case 'rect':
                return area.x1 * ratio + ',' + area.y1 * ratio + ',' + area.x2 * ratio + ',' + area.y2 * ratio;
        }
        console.error('Shape ' +  area.shape + ' has no handler yet');
        return '';
    }

    public skipImageSerch() {
        if (!this.skippingImageSearchPossible) {
            return;
        }
        this.questionAnsweredCorrectly();
    }

    private calcTimeRemainingForSkip(time: number) {
        this.timeRemainingForSkip = time;
        setTimeout(() => {
            this.calcTimeRemainingForSkip(time - 1);
        }, 1000);
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
            if (this.question.rigthAnswerHint){
              this.showRightAnswersHint = true;
              setTimeout(() => {
                this.showRightAnswersHint = false;
                this.questionCorrect.emit();
              }, 2000);
            } else {
              this.questionCorrect.emit();
            }
        }
    }


}