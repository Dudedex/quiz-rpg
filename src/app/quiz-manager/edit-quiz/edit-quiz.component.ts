import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Quiz} from '../../models/quiz';
import {Question} from '../../models/question';
import {QuestionType} from '../../models/question-type';
import {QuizManagerHelper} from '../utility/quiz-manager-helper';
import {ApiClientService} from '../../api-client.service';
import {ImageSearch} from '../../models/image-search';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-edit-quiz',
    templateUrl: './edit-quiz.component.html'
})
export class EditQuizComponent implements OnInit {

    @Input()
    public quiz: Quiz;

    @Input()
    public token: string;

    @Output()
    public quizCreated = new EventEmitter<void>();

    @Output()
    public cancelQuizEmit = new EventEmitter<void>();

    public tempQuestion: Question;
    public editedQuestion: Question;
    public showInvalidQuizError: boolean;
    public showQuizCouldNotBeCreatedError: boolean;

    constructor(private apiClientService: ApiClientService) {
    }

    ngOnInit(): void {
    }

    public getQuestionType(question: Question) {
        switch (question.type) {
            case QuestionType.RADIO:
                return 'Multiple Choice';
            case QuestionType.CHECKBOX:
                return 'Checkboxes';
            case QuestionType.IMAGE_SEARCH:
                return 'Wimmelbild';
            default:
                return question.type;
        }
    }

    public deleteQuestion(index: number) {
        this.quiz.questions.splice(index, 1);
    }

    public createNewQuestion() {
        this.tempQuestion = new Question();
        this.tempQuestion.type = QuestionType.RADIO;
        this.tempQuestion.imageSearch = new ImageSearch();
        this.tempQuestion.imageSearch.areaData = [];
        this.tempQuestion.options = [];
        this.tempQuestion.options.push(QuizManagerHelper.getDummyAnswer());
        this.tempQuestion.options.push(QuizManagerHelper.getDummyAnswer());
        this.tempQuestion.options.push(QuizManagerHelper.getDummyAnswer());
        this.tempQuestion.options.push(QuizManagerHelper.getDummyAnswer());
    }

    public editQuestion(question: Question) {
        this.editedQuestion = question;
        this.tempQuestion = undefined;
    }


    public finishQuestionEdit(question: Question) {
        this.editedQuestion = undefined;
    }

    public addQuestionToQuiz(question: Question) {
        this.quiz.questions.push(question);
        this.tempQuestion = undefined;
        this.editedQuestion = undefined;
    }

    public reArrangeQuestion(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.quiz.questions, event.previousIndex, event.currentIndex);
    }

    public cancelQuiz() {
        this.cancelQuizEmit.emit();
    }
    
    public createOrUpdateQuiz() {
        if (this.quiz.name && this.quiz.name.trim().length > 3 && this.quiz.name.indexOf(' ') === -1 && this.quiz.questions && this.quiz.questions.length > 0) {
            this.showInvalidQuizError = false;
            this.apiClientService.createOrUpdateGame(this.token, this.quiz).subscribe((res) => {
                this.quizCreated.emit();
                this.showQuizCouldNotBeCreatedError = false;
            }, (error => {
                this.showQuizCouldNotBeCreatedError = true;
            }));
        } else {
            this.showQuizCouldNotBeCreatedError = false;
            this.showInvalidQuizError = true;
        }
    }
}
