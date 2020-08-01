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

@NgModule({
    declarations: [
        AppComponent,
        QuestionComponent,
        QuizComponent,
        AdminConsoleComponent,
        QuizManagerComponent,
        EditQuizComponent,
        EditQuestionComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        NgbModule,
        AppRoutingModule
    ],
    providers: [ApiClientService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
