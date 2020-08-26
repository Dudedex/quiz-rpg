import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Question} from '../../models/question';
import {QuestionType} from '../../models/question-type';
import {ApiClientService} from '../../api-client.service';

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html'
})
export class QuestionComponent implements OnInit, OnChanges {

    @ViewChild('image') public image: ElementRef;

    @Input()
    public userToken: string;

    @Input()
    public lobby: string;

    @Input()
    public question: Question;

    @Output()
    public questionCorrect = new EventEmitter<void>();

    public errorPenalty: boolean;
    public wrongAnswerPenaltySeconds: number;
    public rightAnswerSequelSeconds: number;
    public questionedOpened: number;
    public skippingQuestionPossible: boolean;
    public timeRemainingForSkip: number;
    public showRightAnswersHint: boolean;
    public wrongAnswerSpecial: string;

    private submitted: boolean;

    constructor(private apiClient: ApiClientService) {
    }

    ngOnInit() {
        this.submitted = false;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes.question) {
            return;
        }
        this.errorPenalty = false;
        this.wrongAnswerPenaltySeconds = undefined;
        this.submitted = false;
        this.wrongAnswerSpecial = undefined;
        this.questionedOpened = Date.now();
        this.timeRemainingForSkip = undefined;
        this.skippingQuestionPossible = false;
        if (!this.question.skipTimer) {
            if (this.question.type === QuestionType.CHECK_IN_AND_OUT) {
                this.question.skipTimer = 75;
            } else {
                this.question.skipTimer = 30;
            }
        }
        this.calcTimeRemainingForSkip(this.question.skipTimer);
        setTimeout(() => {
            this.skippingQuestionPossible = true;
        }, this.question.skipTimer * 1000);
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

    public isDragAndDrop() {
        return this.question.type === QuestionType.DRAG_AND_DROP;
    }

    public isAlPacoRace() {
        return this.question.type === QuestionType.AL_PACO_RACE;
    }

    public isCheckInAndOut() {
        return this.question.type === QuestionType.CHECK_IN_AND_OUT;
    }

    public questionAnsweredCorrectly() {
        if (!this.submitted) {
            this.submitted = true;
            if (this.question.rigthAnswerSequel) {
                this.showRightAnswersHint = true;
                this.countSuccessSequelTime(this.question.rightAnswerScreenTime);
                setTimeout(() => {
                    this.showRightAnswersHint = false;
                    this.questionCorrect.emit();
                }, this.question.rightAnswerScreenTime * 1000);
            } else {
                this.questionCorrect.emit();
            }
        }
    }

    public startErrorTimer(wrongAnswerSpecial?: string) {
        if (this.errorPenalty) {
            return;
        }
        if (wrongAnswerSpecial) {
            this.wrongAnswerSpecial = wrongAnswerSpecial;
        }
        this.errorPenalty = true;
        this.countErrorTime(this.question.wrongAnswerPenalty);
        setTimeout(() => {
            this.errorPenalty = false;
        }, this.question.wrongAnswerPenalty * 1000);
    }

    public skipQuestion() {
        if (!this.skippingQuestionPossible) {
            return;
        }
        this.apiClient.skipAnswer(this.lobby, this.userToken, this.question.uuid).subscribe((res: any) => {
            this.questionAnsweredCorrectly();
        });
    }

    private calcTimeRemainingForSkip(time: number) {
        this.timeRemainingForSkip = time;
        if (this.timeRemainingForSkip > 0) {
            setTimeout(() => {
                this.calcTimeRemainingForSkip(time - 1);
            }, 1000);
        }
    }

    private countErrorTime(timeInSeconds: number) {
        if (timeInSeconds <= 0) {
            return;
        }
        this.wrongAnswerPenaltySeconds = timeInSeconds;
        setTimeout(() => {
            this.countErrorTime(timeInSeconds - 1);
        }, 1000);
    }

    private countSuccessSequelTime(timeInSeconds: number) {
        if (timeInSeconds <= 0) {
            return;
        }
        this.rightAnswerSequelSeconds = timeInSeconds;
        setTimeout(() => {
            this.countSuccessSequelTime(timeInSeconds - 1);
        }, 1000);
    }
}
