import {Component, Input, OnInit} from '@angular/core';
import {Question} from '../../../models/question';

@Component({
    selector: 'app-check-in-editor',
    templateUrl: './check-in-editor.component.html'
})
export class CheckInEditorComponent implements OnInit {
    @Input()
    public question: Question;

    constructor() {
    }

    ngOnInit(): void {
    }

    public deleteAnswerOption(i: number) {
        this.question.checkInFlows.splice(i, 1);
    }

    public addFlowEntry() {
        this.question.checkInFlows.push({
            in: 0,
            out: 0,
        });
    }

    public getCorrectAnswer() {
        if (!this.question.checkInFlows || this.question.checkInFlows.length === 0) {
            return 0;
        }
        let correctAnswer = 0;
        for (const flow of this.question.checkInFlows) {
            correctAnswer += flow.in;
            correctAnswer -= flow.out;
        }
        return correctAnswer;
    }
}
