import {Component, OnInit} from '@angular/core';
import {Quiz} from '../models/quiz';
import {TestQuiz} from '../quizzes/test-quiz';
import {ApiClientService} from '../api-client.service';
import {QuizStep} from '../models/quiz-step';
import {interval, Subscription} from 'rxjs';
import {GameStats} from '../models/game-stats';
import {EndgameStats} from '../models/endgame-stats';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-quiz',
    templateUrl: './quiz.component.html'
})
export class QuizComponent implements OnInit {

    public username: string;
    public lobby: string = 'show';
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

    constructor(private apiClient: ApiClientService,
                private route: ActivatedRoute) {
        this.currentStep = 0;
        this.lobbySetByPath = false;
        this.route.params.subscribe( params => {
            if (params.lobby) {
                this.lobby = params.lobby;
                this.lobbySetByPath = true;
            }
        });
    }

    ngOnInit() {
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
                    this.apiClient.checkStartTime(this.lobby).subscribe((res: any) => {
                        this.timeUntilStartInMs = res.timeUntilStartInMs as number;
                        this.players = res.players;
                        if (this.timeUntilStartInMs > 0) {
                            this.blockCall = true;
                            this.startWaitTimer(Math.round((this.timeUntilStartInMs) / 1000));
                            setTimeout(() => {
                                this.progressQuiz();
                            }, this.timeUntilStartInMs);
                            this.startSubscription.unsubscribe();
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
