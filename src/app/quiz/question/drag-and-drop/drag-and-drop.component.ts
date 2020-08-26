import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Question} from '../../../models/question';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {ApiClientService} from '../../../api-client.service';

@Component({
    selector: 'app-drag-and-drop',
    templateUrl: './drag-and-drop.component.html'
})
export class DragAndDropComponent {

    @Input()
    public question: Question;

    @Input()
    public lobby: string;

    @Input()
    public userToken: string;

    @Input()
    public errorPenalty: boolean;

    @Output()
    public questionAnsweredCorrectly = new EventEmitter();

    @Output()
    public questionAnsweredFalse = new EventEmitter();

    constructor(private apiClient: ApiClientService) {
    }

    public drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.question.options, event.previousIndex, event.currentIndex);
    }

    public checkAnswer() {
        if (this.errorPenalty) {
            return;
        }
        const answerIds = this.question.options.map(o => o.uuid);
        this.apiClient.checkAnswer(this.lobby, this.userToken, this.question.uuid, answerIds).subscribe((res: any) => {
            if (res.correct) {
                this.questionAnsweredCorrectly.emit();
            } else {
                this.questionAnsweredFalse.emit();
            }
        });
    }
}
