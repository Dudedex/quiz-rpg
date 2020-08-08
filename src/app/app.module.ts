import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {QuestionComponent} from './question/question.component';
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
import { ImageSearchQuestionComponent } from './question/image-search-question/image-search-question.component';
import { DragAndDropComponent } from './question/drag-and-drop/drag-and-drop.component';
import {ClipboardModule} from '@angular/cdk/clipboard';

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
        DragAndDropComponent
    ],
    imports: [
        BrowserModule,
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
