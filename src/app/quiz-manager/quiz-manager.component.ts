import {Component, OnInit} from '@angular/core';
import {Quiz} from '../models/quiz';

@Component({
    selector: 'app-game-creator',
    templateUrl: './quiz-manager.component.html'
})
export class QuizManagerComponent implements OnInit {

    public token: string;
    public tempQuiz: Quiz;
    public showQuizCreatedHint:boolean;

    constructor() {
    }

    ngOnInit(): void {
    }

    public createNewQuiz() {
        this.tempQuiz = new Quiz();
        this.tempQuiz.isNew = true;
    }

    public quizWasCreated() {
        this.showQuizCreatedHint = true;
        this.tempQuiz = undefined;
    }

}
