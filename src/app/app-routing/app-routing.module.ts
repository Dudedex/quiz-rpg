import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {QuizComponent} from '../quiz/quiz.component';
import {AdminConsoleComponent} from '../admin-console/admin-console.component';

const routes: Routes = [
    {
        path: '',
        component: QuizComponent,
    },
    {
        path: 'admin',
        component: AdminConsoleComponent,
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
