import {Quiz} from '../models/quiz';
import {Question} from '../models/question';
import {QuestionType} from '../models/question-type';
import {AnswerOption} from '../models/answer-option';

export class TestQuiz {
    public static getQuizObject(): Quiz {
        const quiz = new Quiz();
        quiz.name = 'Keine Show - die Show';
        const question1 = new Question();
        question1.title = 'Welche Show ist die bessere?';
        question1.type = QuestionType.RADIO;
        question1.options = [];
        const q1a1 = new AnswerOption();
        q1a1.correct = true;
        q1a1.text = 'Keine Show - die Show';
        question1.options.push(q1a1);
        const q1a2 = new AnswerOption();
        q1a2.text = 'Spieleabend - die Show';
        question1.options.push(q1a2);
        quiz.questions.push(question1);
        return quiz;
    }
}
