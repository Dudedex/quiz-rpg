import {Component, Input, OnInit} from '@angular/core';
import {Question} from '../../../models/question';
import {QuestionType} from '../../../models/question-type';
import {QuizManagerHelper} from '../../utility/quiz-manager-helper';

@Component({
    selector: 'app-radio-and-checkbox-editor',
    templateUrl: './radio-and-checkbox-editor.component.html'
})
export class RadioAndCheckboxEditorComponent implements OnInit {
    @Input()
    public question: Question;

    constructor() {
    }

    ngOnInit(): void {
    }

    public isCheckbox() {
        return this.question.type === QuestionType.CHECKBOX;
    }

    public isRadio() {
        return this.question.type === QuestionType.RADIO;
    }

    public isCheckInAndOut() {
        return this.question.type === QuestionType.CHECK_IN_AND_OUT;
    }

    public addQuestionAnswerOption() {
        this.question.options.push(QuizManagerHelper.getDummyAnswer());
    }

    public deleteAnswerOption(index: number) {
        this.question.options.splice(index, 1);
    }
}
