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

    public areaClicked(area: AreaData, event: any) {
        console.log(event);
        console.log('Area clicked ' + area.description)
        area.checked = true;
        if (this.question.imageSearch.areaData.findIndex(ad => !ad.checked) === -1) {
            this.questionAnsweredCorrectly();
        }
    }

    public coords(event) {
        console.log(event);
        console.log('x:' + (event.offsetX / this.image.nativeElement.width));
        console.log('y:' + (event.offsetY / this.image.nativeElement.height));
    }

    public getCordsForArea(area: AreaData) {
        switch (area.shape) {
            case 'circle':
                return area.x1 + ',' + area.y1 + ',' + area.radius;
            case 'rect':
                return area.x1 + ',' + area.y1 + ',' + area.x2 + ',' + area.y2;
        }
        console.error('Shape ' +  area.shape + ' has no handler yet');
        return '';
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

    public questionAnsweredCorrectly() {
        if (!this.submitted) {
            this.submitted = true;
            this.questionCorrect.emit();
        }
    }


}
