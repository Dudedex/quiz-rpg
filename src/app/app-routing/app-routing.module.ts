import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {QuizComponent} from '../quiz/quiz.component';
import {AdminConsoleComponent} from '../admin-console/admin-console.component';
import {QuizManagerComponent} from '../quiz-manager/quiz-manager.component';

const routes: Routes = [
    {
        path: '',
        component: QuizComponent,
    },
    {
        path: 'quiz',
        component: QuizComponent,
    },
    {
        path: 'quiz/:lobby',
        component: QuizComponent,
    },
    {
        path: 'admin',
        component: AdminConsoleComponent,
    },
    {
        path: 'admin/quiz-manager',
        component: QuizManagerComponent,
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class AppRoutingModule { }
