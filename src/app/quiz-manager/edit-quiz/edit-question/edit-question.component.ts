import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Question} from '../../../models/question';
import {QuestionType} from '../../../models/question-type';
import {QuestionTypeOption} from '../../../models/question-type-option';
import {QuizManagerHelper} from '../../utility/quiz-manager-helper';
import {QuestionError} from '../../../models/question-error';
import {ImageSearch} from '../../../models/image-search';
import {AreaData} from '../../../models/area-data';

@Component({
    selector: 'app-edit-question',
    templateUrl: './edit-question.component.html'
})
export class EditQuestionComponent implements OnInit {
    @Input()
    public question: Question;

    @Input()
    public isNewQuestion: boolean;

    @Output()
    public questionAdded = new EventEmitter<Question>();

    public questionTypeOptions: QuestionTypeOption[];
    public selectedOption: QuestionTypeOption;
    public errorsWithQuestion: QuestionError[] = [];

    constructor() {
    }

    ngOnInit(): void {
        this.questionTypeOptions = [];
        this.questionTypeOptions.push({
            key: QuestionType.RADIO,
            displayValue: 'Multiple Choice'
        });
        this.questionTypeOptions.push({
            key: QuestionType.CHECKBOX,
            displayValue: 'Checkbox'
        });
        this.questionTypeOptions.push({
            key: QuestionType.IMAGE_SEARCH,
            displayValue: 'Wimmelbild'
        });
        if (this.question) {
            this.selectQuestionType(this.questionTypeOptions.find(to => to.key === this.question.type));
        }
    }

    public selectQuestionType(questionTypeOption: QuestionTypeOption) {
        this.selectedOption = questionTypeOption;
        this.question.type = questionTypeOption.key;
    }

    public isCheckbox() {
        return this.question.type === QuestionType.CHECKBOX;
    }

    public isRadio() {
        return this.question.type === QuestionType.RADIO;
    }

    public isImageSearch() {
        return this.question.type === QuestionType.IMAGE_SEARCH;
    }

    public addQuestionAnswerOption() {
        this.question.options.push(QuizManagerHelper.getDummyAnswer());
    }

    public deleteAnswerOption(index: number) {
        this.question.options.splice(index, 1);
    }

    public validateQuestionAndSubmit() {
        this.errorsWithQuestion = [];
        if (!this.questionIsValid()) {
            if (!(this.question.title
                && this.question.title.trim() !== '')) {
                this.errorsWithQuestion.push(QuestionError.TITLE_INVALID);
            }
            if (this.question.options.findIndex(o => o.text.trim() === '') !== -1) {
                this.errorsWithQuestion.push(QuestionError.ANSWER_OPTION_INVALID);
            }
            if (this.question.rightAnswerScreenTime < 0) {
                this.errorsWithQuestion.push(QuestionError.RIGHT_ANSWER_SCREEN_TIME_INVALID);
            }
            if (this.question.wrongAnswerPenalty < 3) {
                this.errorsWithQuestion.push(QuestionError.WRONG_ANSWER_SCREEN_TIME_INVALID);
            }
            if ((this.isCheckbox() || this.isRadio()) && this.question.options.findIndex(o => o.correct) === -1) {
                this.errorsWithQuestion.push(QuestionError.NO_CORRECT_ANSWER);
            }
            return;
        }
        this.questionAdded.emit(this.question);
    }

    public getDisplayValueForError(error: QuestionError) {
        switch (error) {
            case QuestionError.TITLE_INVALID:
                return 'die Frage einen Text besitzt';
            case QuestionError.ANSWER_OPTION_INVALID:
                return 'jede Antwortmöglichkeit hat einen Text';
            case QuestionError.RIGHT_ANSWER_SCREEN_TIME_INVALID:
                return 'die Anzeigezeit für eine richtige Antwort nicht negativ ist';
            case QuestionError.WRONG_ANSWER_SCREEN_TIME_INVALID:
                return 'eine Strafzeit von mindestens 3 Sekunden angegeben ist';
            case QuestionError.NO_CORRECT_ANSWER:
                return 'mindestens eine Antwort die richtige ist';
        }
    }

    public imageChangeListener($event): void {
        const file: File = $event.target.files[0];
        const myReader: FileReader = new FileReader();

        myReader.onloadend = (e) => {
            this.question.imageSearch.imageData = myReader.result as string;
        }
        myReader.readAsDataURL(file);
    }

    public clickedCoords(event: any) {
        console.log(event);
        const areaData = new AreaData();
        areaData.description = '';
        areaData.shape = 'rect';
        areaData.x1 = event.offsetX - 20;
        areaData.y1 = event.offsetY - 20;
        areaData.x2 = event.offsetX + 20;
        areaData.y2 = event.offsetY + 20;
        this.question.imageSearch.areaData.push(areaData);
    }

    public getCordsForArea(area: AreaData) {
        // 420 container max-width
        switch (area.shape) {
        case 'circle':
            return area.x1 + ',' + area.y1 + ',' + area.radius;
        case 'rect':
            return area.x1 + ',' + area.y1 + ',' + area.x2 + ',' + area.y2;
        }
        console.error('Shape ' +  area.shape + ' has no handler yet');
        return '';
    }

    private questionIsValid() {
        return this.question.title
                && this.question.title.trim() !== ''
                && this.question.options.findIndex(o => o.text.trim() === '') === -1
                && this.question.rightAnswerScreenTime >= 0
                && this.question.wrongAnswerPenalty >= 3
                && !((this.isCheckbox() || this.isRadio()) && this.question.options.findIndex(o => o.correct) === -1);
    }
}
