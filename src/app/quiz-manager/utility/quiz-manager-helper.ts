import {AnswerOption} from '../../models/answer-option';

export class QuizManagerHelper {
    public static getDummyAnswer() {
        const dummyAnswer = new AnswerOption();
        dummyAnswer.text = '';
        dummyAnswer.wrongAnswerHint = '';
        dummyAnswer.correct = false;
        dummyAnswer.checked = false;
        return dummyAnswer;
    }
}
