import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Question} from '../../../models/question';
import {QuestionType} from '../../../models/question-type';
import {QuestionTypeOption} from '../../../models/question-type-option';
import {QuestionError} from '../../../models/question-error';

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
    public selectedQuestionTypeOption: QuestionTypeOption;
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
        this.questionTypeOptions.push({
            key: QuestionType.DRAG_AND_DROP,
            displayValue: 'Reihenfolge bestimmen'
        });
        this.questionTypeOptions.push({
            key: QuestionType.AL_PACO_RACE,
            displayValue: 'Al-Paco Rennen'
        });
        if (this.question) {
            this.selectQuestionType(this.questionTypeOptions.find(to => to.key === this.question.type));
        }
    }

    public selectQuestionType(questionTypeOption: QuestionTypeOption) {
        this.selectedQuestionTypeOption = questionTypeOption;
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

    public isDragAndDrop() {
        return this.question.type === QuestionType.DRAG_AND_DROP;
    }

    public isAlPacoRace() {
        return this.question.type === QuestionType.AL_PACO_RACE;
    }

    public validateQuestionAndSubmit() {
        this.errorsWithQuestion = [];
        if (!this.questionIsValid()) {
            console.log('ERROR');
            if (!(this.question.title
                && this.question.title.trim() !== '')) {
                this.errorsWithQuestion.push(QuestionError.TITLE_INVALID);
            }
            if (this.question.rightAnswerScreenTime < 0) {
                this.errorsWithQuestion.push(QuestionError.RIGHT_ANSWER_SCREEN_TIME_INVALID);
            }
            if (this.question.wrongAnswerPenalty < 3) {
                this.errorsWithQuestion.push(QuestionError.WRONG_ANSWER_SCREEN_TIME_INVALID);
            }
            switch (this.question.type) {
                case QuestionType.DRAG_AND_DROP:
                    if (this.question.options.length <= 1) {
                        this.errorsWithQuestion.push(QuestionError.NOT_ENOUGH_ANSWER_OPTIONS);
                    }
                    if (this.question.options.findIndex(o => o.text.trim() === '') !== -1) {
                        this.errorsWithQuestion.push(QuestionError.ANSWER_OPTION_INVALID);
                    }
                    break;
                case QuestionType.CHECKBOX:
                case QuestionType.RADIO:
                    if (this.question.options.length <= 1) {
                        this.errorsWithQuestion.push(QuestionError.NOT_ENOUGH_ANSWER_OPTIONS);
                    }
                    if (this.question.options.findIndex(o => o.correct) === -1) {
                        this.errorsWithQuestion.push(QuestionError.NO_CORRECT_ANSWER);
                    }
                    if (this.question.options.findIndex(o => o.text.trim() === '') !== -1) {
                        this.errorsWithQuestion.push(QuestionError.ANSWER_OPTION_INVALID);
                    }
                    break;
                case QuestionType.IMAGE_SEARCH:
                    if (this.question.imageSearch?.areaData?.length === 0) {
                        this.errorsWithQuestion.push(QuestionError.IMAGE_SEARCH_AREAS_MISSING);
                    }
                    break;

            }
            return;
        }
        this.questionAdded.emit(this.question);
    }

    public getDisplayValueForError(error: QuestionError) {
        switch (error) {
            case QuestionError.TITLE_INVALID:
                return 'die Frage einen Text besitzt';
            case QuestionError.NOT_ENOUGH_ANSWER_OPTIONS:
                return 'nicht genügend Antwortmöglichkeiten definiert (min 2)';
            case QuestionError.ANSWER_OPTION_INVALID:
                return 'jede Antwortmöglichkeit hat einen Text';
            case QuestionError.RIGHT_ANSWER_SCREEN_TIME_INVALID:
                return 'die Anzeigezeit für eine richtige Antwort nicht negativ ist';
            case QuestionError.WRONG_ANSWER_SCREEN_TIME_INVALID:
                return 'eine Strafzeit von mindestens 3 Sekunden angegeben ist';
            case QuestionError.NO_CORRECT_ANSWER:
                return 'mindestens eine Antwort die richtige ist';
            case QuestionError.IMAGE_SEARCH_AREAS_MISSING:
                return 'mindestens ein Zielbereich muss definiert sein';
        }
    }

    private questionIsValid() {
        const isCoreDataValid = this.question.title
                        && this.question.title.trim() !== ''
                        && this.question.rightAnswerScreenTime >= 0
                        && this.question.wrongAnswerPenalty >= 3;
        switch (this.question.type) {
            case QuestionType.IMAGE_SEARCH:
                return this.question.imageSearch
                        && this.question.imageSearch.areaData
                        && this.question.imageSearch.areaData.length > 0;
            case QuestionType.RADIO:
            case QuestionType.CHECKBOX:
                return isCoreDataValid
                        && this.question.options.findIndex(o => o.text.trim() === '') === -1
                        && this.question.options.findIndex(o => o.correct) > -1;
        }
        return isCoreDataValid;
    }
}
