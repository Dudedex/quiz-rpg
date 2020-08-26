import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, SimpleChanges} from '@angular/core';
import {Question} from '../../../models/question';
import {AreaData} from '../../../models/area-data';
import {QuestionType} from '../../../models/question-type';
import {ApiClientService} from '../../../api-client.service';

@Component({
    selector: 'app-image-search-question',
    templateUrl: './image-search-question.component.html'
})
export class ImageSearchQuestionComponent {

    @ViewChild('image') public image: ElementRef;

    @Input()
    public question: Question;

    @Input()
    public lobby: string;

    @Input()
    public userToken: string;

    @Output()
    public questionAnsweredCorrectly = new EventEmitter();

    public IMAGE_CONTAINER_MAX_WIDTH = 420;

    constructor(private apiClient: ApiClientService) {
    }

    public getCordsForArea(area: AreaData) {
        // 420 container max-width
        let ratio = 1;
        if (this.image && this.image.nativeElement && this.image.nativeElement.width !== 0) {
            ratio = this.image.nativeElement.width / this.IMAGE_CONTAINER_MAX_WIDTH;
        }
        switch (area.shape) {
            case 'circle':
                return area.x1 * ratio + ',' + area.y1 * ratio + ',' + area.radius * ratio;
            case 'rect':
                return area.x1 * ratio + ',' + area.y1 * ratio + ',' + area.x2 * ratio + ',' + area.y2 * ratio;
        }
        console.error('Shape ' +  area.shape + ' has no handler yet');
        return '';
    }

    public areaClicked(area: AreaData) {
        area.checked = true;
        if (this.question.imageSearch.areaData.findIndex(ad => !ad.checked) === -1) {
            this.apiClient.checkAnswer(this.lobby, this.userToken, this.question.uuid, []).subscribe((res: any) => {
                // no chance to fail
                this.questionAnsweredCorrectly.emit();
            });
        }
    }
}
