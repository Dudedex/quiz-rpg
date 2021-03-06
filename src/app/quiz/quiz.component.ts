import {Component, OnInit} from '@angular/core';
import {Quiz} from '../models/quiz';
import {TestQuiz} from '../quizzes/test-quiz';
import {ApiClientService} from '../api-client.service';
import {QuizStep} from '../models/quiz-step';
import {interval, Subscription} from 'rxjs';
import {EndgameStats} from '../models/endgame-stats';
import {ActivatedRoute} from '@angular/router';
import {Question} from '../models/question';

@Component({
    selector: 'app-quiz',
    templateUrl: './quiz.component.html'
})
export class QuizComponent {

    readonly USER_TOKEN_LOCAL_STORAGE_VALUE = 'userToken';
    readonly LOBBY_LOCAL_STORAGE_VALUE = 'lobby';

    public username: string;
    public lobby: string;
    public lobbySetByPath: boolean;
    public showLobbyError: boolean;
    public showUsernameError: boolean;
    public showWarning: boolean;
    public timeUntilStartInMs: number;
    public startSubscription: Subscription;
    public statSubscription: Subscription;
    public waitTime: number;
    public players: string[];
    public endGameStats: EndgameStats;
    public userToken: string;
    public pingInMs: number;

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

    public dummyQuestion: Question;

    constructor(private apiClient: ApiClientService,
                private route: ActivatedRoute) {
        this.currentStep = 0;
        this.activeQuestion = 0;
        this.lobbySetByPath = false;
        if (window.localStorage.getItem(this.USER_TOKEN_LOCAL_STORAGE_VALUE)
            && window.localStorage.getItem(this.LOBBY_LOCAL_STORAGE_VALUE)) {
            this.userToken = window.localStorage.getItem(this.USER_TOKEN_LOCAL_STORAGE_VALUE);
            this.lobby = window.localStorage.getItem(this.LOBBY_LOCAL_STORAGE_VALUE);
            this.apiClient.restorePlayer(this.lobby, this.userToken).subscribe((res: any) => {
                this.activeQuestion = res.progressIndex;
                if (this.activeQuestion >= res.quiz.questions.length) {
                    this.activeQuestion = 0;
                    window.localStorage.removeItem(this.LOBBY_LOCAL_STORAGE_VALUE);
                    window.localStorage.removeItem(this.USER_TOKEN_LOCAL_STORAGE_VALUE);
                    return;
                }
                this.quiz = res.quiz;
                this.username = res.username;
                this.currentStep = QuizStep.QUIZ;
            });
        }

        this.route.params.subscribe(params => {
            if (params.lobby) {
                this.lobby = params.lobby;
                this.lobbySetByPath = true;
            }
        });

        this.dummyQuestion = new Question();
        this.dummyQuestion.checkInFlows.push({
            in: 3,
            out: 0,
        });
        this.dummyQuestion.checkInFlows.push({
            in: 0,
            out: 2,
        });
        this.dummyQuestion.checkInFlows.push({
            in: 5,
            out: 0,
        });
        this.dummyQuestion.checkInFlows.push({
            in: 2,
            out: 3,
        });
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
                    (res: any) => {
                        this.showLobbyError = false;
                        this.showUsernameError = false;
                        this.userToken = res.userToken;
                        this.progressToNextStep();
                        this.quiz = res.quiz;
                        this.randomizeAnswers();
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
                this.timeUntilStartInMs = 0;
                this.activeQuestion = 0;
                this.endGameStats = new EndgameStats();
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
        if (waitTime <= 1) {
            return;
        }

        setTimeout(() => {
            this.startWaitTimer(waitTime - 1);
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
            username: this.username,
            userToken: this.userToken
        }).subscribe(() => {
            this.currentStep += 1;
            this.statSubscription = interval(1000).subscribe(() => {
                this.apiClient.loadStats(this.lobby).subscribe((res: any) => {
                    this.endGameStats = res;
                });
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
                    const ping = Date.now();
                    this.apiClient.checkStartTime(this.lobby, this.username).subscribe((res: any) => {
                        this.timeUntilStartInMs = res.timeUntilStartInMs as number;
                        this.pingInMs = Date.now() - ping;
                        this.players = res.players;
                        if (this.timeUntilStartInMs > 0 && !this.blockCall) {
                            window.localStorage.setItem(this.USER_TOKEN_LOCAL_STORAGE_VALUE, this.userToken);
                            window.localStorage.setItem(this.LOBBY_LOCAL_STORAGE_VALUE, this.lobby);
                            this.blockCall = true;
                            this.startWaitTimer(Math.round((this.timeUntilStartInMs) / 1000));
                            setTimeout(() => {
                                this.progressQuiz();
                            }, this.timeUntilStartInMs);
                            this.startSubscription.unsubscribe();
                        }
                    }, error => {
                        this.pingInMs = -1;
                    });
                }
            });
        } else {
            if (this.startSubscription) {
                this.startSubscription.unsubscribe();
            }
        }
    }

    private randomizeAnswers() {
        this.quiz.questions.forEach((q) => {
            for (let i = q.options.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * i);
                const temp = q.options[i];
                q.options[i] = q.options[j];
                q.options[j] = temp;
            }
        });
    }
}
