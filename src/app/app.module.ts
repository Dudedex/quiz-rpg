import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {QuestionComponent} from './question/question.component';
import {QuizComponent} from './quiz/quiz.component';
import {FormsModule} from '@angular/forms';
import {ApiClientService} from './api-client.service';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
    declarations: [
        AppComponent,
        QuestionComponent,
        QuizComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule
    ],
    providers: [ApiClientService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
