import {Component, Input, OnInit} from '@angular/core';
import {Question} from '../../../models/question';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {QuizManagerHelper} from '../../utility/quiz-manager-helper';

@Component({
    selector: 'app-drag-and-drop-editor',
    templateUrl: './drag-and-drop-editor.component.html'
})
export class DragAndDropEditorComponent implements OnInit {

    @Input()
    public question: Question;

    constructor() {
    }

    ngOnInit(): void {
    }

    public drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.question.options, event.previousIndex, event.currentIndex);
    }

    public addQuestionAnswerOption() {
        this.question.options.push(QuizManagerHelper.getDummyAnswer());
    }

    public deleteAnswerOption(i) {
        this.question.options.splice(i, 1);
    }
}
