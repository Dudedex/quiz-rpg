import {Component, OnInit} from '@angular/core';
import {Quiz} from '../models/quiz';
import {TestQuiz} from '../quizzes/test-quiz';
import {ApiClientService} from '../api-client.service';
import {QuizStep} from '../models/quiz-step';
import {interval, Subscription} from 'rxjs';
import {GameStats} from '../models/game-stats';

@Component({
    selector: 'app-quiz',
    templateUrl: './quiz.component.html'
})
export class QuizComponent implements OnInit {

    public username: string;
    public lobby: string = 'show';
    public showLobbyError: boolean;
    public showUsernameError: boolean;
    public showWarning: boolean;
    public startTime: number;
    public startSubscription: Subscription;
    public statSubscription: Subscription;
    public waitTime: number;
    public players: string[];
    public stats: GameStats[] = [];

    private currentStep: QuizStep;
    private quizSteps: QuizStep[] = [
        QuizStep.USERNAME,
        QuizStep.LOBBY_SELECTION,
        QuizStep.WAIT_FOR_START,
        QuizStep.QUIZ,
        QuizStep.END_LOBBY
    ];
    private activeQuestion: number;
    private quiz: Quiz;
    private blockCall: boolean;

    constructor(private apiClient: ApiClientService) {
        this.currentStep = 0;
    }

    ngOnInit() {
        this.quiz = TestQuiz.getQuizObject();
        this.activeQuestion = 0;
    }

    public isUsernameStep() {
        return this.quizSteps[this.currentStep] === QuizStep.USERNAME;
    }

    public isLobbySelectionStep() {
        return this.quizSteps[this.currentStep] === QuizStep.LOBBY_SELECTION;
    }

    public isWaitForStart() {
        return this.quizSteps[this.currentStep] === QuizStep.WAIT_FOR_START;
    }

    public isQuizStep() {
        return this.quizSteps[this.currentStep] === QuizStep.QUIZ;
    }

    public isEndLobbyStep() {
        return this.quizSteps[this.currentStep] === QuizStep.END_LOBBY;
    }

    public progressQuiz() {
        if (!this.validateStep()) {
            this.showWarning = true;
            return;
        }
        this.showWarning = false;

        switch (this.quizSteps[this.currentStep]) {
            case QuizStep.LOBBY_SELECTION:
                this.apiClient.registerPlayer(this.lobby, this.username).subscribe(
                        () => {
                            this.showLobbyError = false;
                            this.showUsernameError = false;
                            this.progressToNextStep();
                        },
                        (error) => {
                            if (error.status === 404) {
                                this.showLobbyError = true;
                            } else {
                                this.showUsernameError = true;
                                this.currentStep = 0;
                            }
                        }
                );
                break;
            case QuizStep.END_LOBBY:
                this.quiz = TestQuiz.getQuizObject();
                this.currentStep = QuizStep.LOBBY_SELECTION;
                this.blockCall = false;
                this.startTime = 0;
                this.activeQuestion = 0;
                this.stats = [];
                if (this.statSubscription) {
                    this.statSubscription.unsubscribe();
                }
                break;
            default:
                this.progressToNextStep();
                break;
        }
    }

    public quitLobby() {
        if (this.quizSteps[this.currentStep] !== QuizStep.WAIT_FOR_START) {
            return;
        }

        this.startSubscription.unsubscribe();
        this.currentStep -= 1;
    }

    public startWaitTimer(waitTime) {
        this.waitTime = waitTime;
        if (this.waitTime <= 1) {
            return;
        }

        setTimeout(() => {
            this.startWaitTimer(this.waitTime - 1);
        }, 1000);
    }

    public getCurrentQuestion() {
        if (!this.quiz) {
            return undefined;
        }
        return this.quiz.questions[this.activeQuestion];
    }

    public validateQuiz() {
        if (this.activeQuestion < this.quiz.questions.length - 1) {
            this.activeQuestion += 1;
            return;
        }
        this.apiClient.quizFinished(this.lobby, {
            username: this.username
        }).subscribe(() => {
            this.currentStep += 1;
            this.statSubscription = this.apiClient.loadStats(this.lobby).subscribe((res: any) => {
                this.stats = res;
            });
        });
    }

    private validateStep() {
        switch (this.quizSteps[this.currentStep]) {
        case QuizStep.USERNAME:
            return this.username && this.username.trim() !== '' && this.username.trim().length > 2;
        case QuizStep.LOBBY_SELECTION:
            return this.lobby && this.lobby.trim() !== '';
        }
        return true;
    }

    private progressToNextStep() {
        if (this.currentStep < this.quizSteps.length - 1) {
            this.currentStep += 1;
        }

        if (this.quizSteps[this.currentStep] === QuizStep.WAIT_FOR_START) {
            this.startSubscription = interval(500).subscribe(() => {
                if (!this.blockCall) {
                    this.apiClient.checkStartTime(this.lobby).subscribe((res: any) => {
                        this.startTime = res.startTime as number;
                        this.players = res.players;
                        const now = new Date().getTime();
                        if (this.startTime > now) {
                            this.startSubscription.unsubscribe();
                            this.blockCall = true;
                            this.startWaitTimer(Math.ceil((this.startTime - now) / 1000));
                            setTimeout(() => {
                                this.progressQuiz();
                            }, this.startTime - new Date().getTime());
                        }
                    });
                }
            });
        } else {
            if (this.startSubscription) {
                this.startSubscription.unsubscribe();
            }
        }
    }

}