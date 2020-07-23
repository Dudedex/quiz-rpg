import {Quiz} from '../models/quiz';
import {Question} from '../models/question';
import {QuestionType} from '../models/question-type';
import {AnswerOption} from '../models/answer-option';
import {ImageSearch} from '../models/image-search';
import {AreaData} from '../models/area-data';

export class TestQuiz {
    public static getQuizObject(): Quiz {
        const quiz = new Quiz();
        quiz.name = 'Keine Show - die Show';

        {
            const question = new Question();
            question.title = 'Welche Show ist die bessere?';
            question.type = QuestionType.RADIO;
            question.options = [];
            const q1a1 = new AnswerOption();
            q1a1.correct = true;
            q1a1.text = 'Keine Show - die Show';
            question.options.push(q1a1);
            const q1a2 = new AnswerOption();
            q1a2.text = 'Spieleabend - die Show';
            question.options.push(q1a2);
            quiz.questions.push(question);
        }

        {
            const question = new Question();
            question.title = 'Wie viel Prozent gibt Arnold in jeder Show?';
            question.wrongAnswerHint = 'Mehr als Doppelkorn geht nicht';
            question.type = QuestionType.RADIO;
            question.options = [];
            const qa1 = new AnswerOption();
            qa1.text = '0%';
            question.options.push(qa1);
            const qa2 = new AnswerOption();
            qa2.text = '38%';
            qa2.correct = true;
            question.options.push(qa2);
            const qa3 = new AnswerOption();
            qa3.text = '69%';
            question.options.push(qa3);
            const qa4 = new AnswerOption();
            qa4.text = '100%';
            question.options.push(qa4);
            quiz.questions.push(question);
        }
        {
            const question = new Question();
            question.title = 'Finde das Objekt';
            question.type = QuestionType.IMAGE_SEARCH;
            question.searchedImage = new ImageSearch();

            question.searchedImage.width = 50;
            question.searchedImage.height = 50;
            question.imageSearch = new ImageSearch();
            question.imageSearch.areaData = [];
            const areaData = new AreaData();
            areaData.x1 = 1140;
            areaData.y1 = 430;
            areaData.x2 = 1300;
            areaData.y2 = 600;
            question.imageSearch.areaData.push(areaData);

            quiz.questions.push(question);

            /*
            VM1072 main.js:415 MouseEvent {isTrusted: true, screenX: 947, screenY: 275, clientX: 947, clientY: 141, …}
            M1072 main.js:415 MouseEvent {isTrusted: true, screenX: 956, screenY: 407, clientX: 956, clientY: 273, …}
        VM1072 main.js:415 MouseEvent {isTrusted: true, screenX: 1097, screenY: 412, clientX: 1097, clientY: 278, …}
        VM1072 main.js:415 MouseEvent {isTrusted: true, screenX: 1098, screenY: 273, clientX: 1098, clientY: 139, …}
             */
        }


        {
            const question = new Question();
            question.title = 'Wo kauft Arnold seine Inneneinrichtung?';
            question.wrongAnswerHint = 'Whats poppin?';

        }
        return quiz;
    }
}
