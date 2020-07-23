import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Question} from '../models/question';
import {AnswerOption} from '../models/answer-option';
import {QuestionType} from '../models/question-type';
import {AreaData} from '../models/area-data';

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html'
})
export class QuestionComponent implements OnInit, OnChanges, AfterViewInit {

    @Input()
    public question: Question;

    @Output()
    public questionCorrect = new EventEmitter<void>();

    public errorPenalty: boolean;
    public seconds: number;
    private submitted: boolean;

    constructor() {
    }

    private getImageMap(map): any {
        const areas = map.getElementsByTagName('area');
        const len = areas.length;
        const coords = [];
        let previousWidth = this.question.imageSearch.width;
        for (let n = 0; n < len; n++) {
            coords[n] = areas[n].coords.split(',');
        }
        window.onresize = () => {
            const x = document.body.clientWidth / previousWidth;
            for (let n = 0; n < len; n++) {
                const clen = coords[n].length;
                for (let m = 0; m < clen; m++) {
                    coords[n][m] *= x;
                }
                areas[n].coords = coords[n].join(',');
            }
            previousWidth = document.body.clientWidth;
            return true;
        };
    }

    ngAfterViewInit(): void {
        if (this.question.type === QuestionType.IMAGE_SEARCH) {
            //this.getImageMap('map_id').resize();
        }

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

    public areaClicked(area: AreaData) {
        console.log(area);
    }

    public coords(event) {
        console.log(event);
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
