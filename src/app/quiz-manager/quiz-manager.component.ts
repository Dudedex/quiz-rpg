import {Component, OnInit} from '@angular/core';
import {Quiz} from '../models/quiz';
import {ApiClientService} from '../api-client.service';

@Component({
    selector: 'app-game-creator',
    templateUrl: './quiz-manager.component.html'
})
export class QuizManagerComponent implements OnInit {

    public token: string;
    public logInFailed: boolean;
    public loggedIn: boolean;
    public tempQuiz: Quiz;
    public editedQuiz: Quiz;
    public showQuizCreatedHint: boolean;
    public quizzes: Quiz[];
    public selectedQuiz: Quiz;

    constructor(private apiClientService: ApiClientService) {
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
        this.editedQuiz = undefined;
        this.loadQuizzes();
    }

    public logIn() {
        this.apiClientService.verifyAdmin(this.token).subscribe((res) => {
            this.loggedIn = true;
            this.logInFailed = false;
            this.loadQuizzes();
        }, (error => {
            this.logInFailed = true;
        }));
    }

    public cancelQuiz() {
        this.tempQuiz = undefined;
        this.editedQuiz = undefined;
    }

    public startQuizEdit() {
        this.editedQuiz = this.selectedQuiz;
    }

    private loadQuizzes() {
        this.apiClientService.loadExistingQuizzes(this.token).subscribe((res: any) => {
            this.quizzes = res;
            this.selectedQuiz = undefined;
        });
    }
}
