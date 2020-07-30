import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Question} from '../models/question';
import {AnswerOption} from '../models/answer-option';
import {QuestionType} from '../models/question-type';
import {AreaData} from '../models/area-data';
import {ApiClientService} from '../api-client.service';

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html'
})
export class QuestionComponent implements OnInit, OnChanges {

    static IMAGE_SEARCH_SKIP_TIME = 30;
    static QUESTION_ERROR_PENALTY = 8;

    @ViewChild('image') public image: ElementRef;

    @Input()
    public userToken: string;

    @Input()
    public lobby: string;

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
    public wrongAnswerSpecial: string;

    constructor(private apiClient: ApiClientService) {
    }

    ngOnInit() {
        this.submitted = false;
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.errorPenalty = false;
        this.seconds = undefined;
        this.submitted = false;
        this.wrongAnswerSpecial = undefined;
        this.timeRemainingForSkip = undefined;
        this.questionedOpened = Date.now();
        if (this.question.type === QuestionType.IMAGE_SEARCH) {
            this.skippingImageSearchPossible = false;
            this.calcTimeRemainingForSkip(QuestionComponent.IMAGE_SEARCH_SKIP_TIME);
            setTimeout(() => {
                this.skippingImageSearchPossible = true;
            }, QuestionComponent.IMAGE_SEARCH_SKIP_TIME * 1000);
        }
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
        this.apiClient.checkAnswer(this.lobby, this.userToken, this.question.uuid, answerIds).subscribe((res: any) => {
            if (res.correct) {
                this.questionAnsweredCorrectly();
            } else {
                if (answerIds.length === 1) {
                    this.wrongAnswerSpecial = this.question.options.find(a => a.uuid === answerIds[0]).wrongAnswerHint;
                } else {
                    this.wrongAnswerSpecial = undefined;
                }
                this.startErrorTimer();
            }
        });
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
            this.apiClient.checkAnswer(this.lobby, this.userToken, this.question.uuid, []).subscribe((res: any) => {
                // no chance to fail
                this.questionAnsweredCorrectly();
            });
        }
    }

    public getCordsForArea(area: AreaData) {
        // 420 container max-width
        let ratio = 1;
        if (this.image && this.image.nativeElement && this.image.nativeElement.width !== 0) {
            ratio = this.image.nativeElement.width / this.IMAGE_CONTAINER_MAX_WIDTH;
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
        if (this.timeRemainingForSkip > 0) {
            setTimeout(() => {
                this.calcTimeRemainingForSkip(time - 1);
            }, 1000);
        }
    }

    private startErrorTimer() {
        if (this.errorPenalty) {
            return;
        }
        this.errorPenalty = true;
        this.countErrorTime(QuestionComponent.QUESTION_ERROR_PENALTY);
        setTimeout(() => {
            this.errorPenalty = false;
        }, QuestionComponent.QUESTION_ERROR_PENALTY * 1000);
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
            if (this.question.rigthAnswerSequel) {
              this.showRightAnswersHint = true;
              setTimeout(() => {
                this.showRightAnswersHint = false;
                this.questionCorrect.emit();
              }, this.question.rightAnswerScreenTime * 1000);
            } else {
              this.questionCorrect.emit();
            }
        }
    }


}
