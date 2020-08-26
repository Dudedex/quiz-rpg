import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {QuestionComponent} from './quiz/question/question.component';
import {QuizComponent} from './quiz/quiz.component';
import {FormsModule} from '@angular/forms';
import {ApiClientService} from './api-client.service';
import {HttpClientModule} from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {AppRoutingModule} from './app-routing/app-routing.module';
import { AdminConsoleComponent } from './admin-console/admin-console.component';
import { QuizManagerComponent } from './quiz-manager/quiz-manager.component';
import { EditQuizComponent } from './quiz-manager/edit-quiz/edit-quiz.component';
import { EditQuestionComponent } from './quiz-manager/edit-quiz/edit-question/edit-question.component';
import { ImageSearchEditorComponent } from './quiz-manager/edit-quiz/image-search-editor/image-search-editor.component';
import { RadioAndCheckboxEditorComponent } from './quiz-manager/edit-quiz/radio-and-checkbox-editor/radio-and-checkbox-editor.component';
import { DragAndDropEditorComponent } from './quiz-manager/edit-quiz/drag-and-drop-editor/drag-and-drop-editor.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { ImageSearchQuestionComponent } from './quiz/question/image-search-question/image-search-question.component';
import { DragAndDropComponent } from './quiz/question/drag-and-drop/drag-and-drop.component';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { RunGameComponent } from './quiz/question/run-game/run-game.component';
import { AlPacoRaceComponent } from './quiz-manager/edit-quiz/al-paco-race/al-paco-race.component';
import { CheckInComponent } from './quiz/question/check-in/check-in.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { SimpleQuestionComponent } from './quiz/question/simple-question/simple-question.component';
import { CheckInEditorComponent } from './quiz-manager/edit-quiz/check-in-editor/check-in-editor.component';

@NgModule({
    declarations: [
        AppComponent,
        QuestionComponent,
        QuizComponent,
        AdminConsoleComponent,
        QuizManagerComponent,
        EditQuizComponent,
        EditQuestionComponent,
        ImageSearchEditorComponent,
        RadioAndCheckboxEditorComponent,
        DragAndDropEditorComponent,
        ImageSearchQuestionComponent,
        DragAndDropComponent,
        RunGameComponent,
        AlPacoRaceComponent,
        CheckInComponent,
        SimpleQuestionComponent,
        CheckInEditorComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        NgbModule,
        AppRoutingModule,
        DragDropModule,
        ClipboardModule
    ],
    providers: [ApiClientService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
