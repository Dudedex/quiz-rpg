import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, SimpleChanges} from '@angular/core';
import {Question} from '../../models/question';
import {AreaData} from '../../models/area-data';
import {QuestionType} from '../../models/question-type';
import {ApiClientService} from '../../api-client.service';

@Component({
    selector: 'app-image-search-question',
    templateUrl: './image-search-question.component.html'
})
export class ImageSearchQuestionComponent implements OnChanges {

    static IMAGE_SEARCH_SKIP_TIME = 30;

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
    public skippingImageSearchPossible: boolean;
    public timeRemainingForSkip: number;

    constructor(private apiClient: ApiClientService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.timeRemainingForSkip = undefined;
        this.skippingImageSearchPossible = false;
        if (this.question.type === QuestionType.IMAGE_SEARCH) {
            this.calcTimeRemainingForSkip(ImageSearchQuestionComponent.IMAGE_SEARCH_SKIP_TIME);
            setTimeout(() => {
                this.skippingImageSearchPossible = true;
            }, ImageSearchQuestionComponent.IMAGE_SEARCH_SKIP_TIME * 1000);
        }
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

    public skipImageSerch() {
        if (!this.skippingImageSearchPossible) {
            return;
        }
        this.apiClient.checkAnswer(this.lobby, this.userToken, this.question.uuid, []).subscribe((res: any) => {
            // no chance to fail
            this.questionAnsweredCorrectly.emit();
        });
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

    private calcTimeRemainingForSkip(time: number) {
        this.timeRemainingForSkip = time;
        if (this.timeRemainingForSkip > 0) {
            setTimeout(() => {
                this.calcTimeRemainingForSkip(time - 1);
            }, 1000);
        }
    }

}
