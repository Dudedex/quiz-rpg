import {Component, Input, OnInit} from '@angular/core';
import {Question} from '../../../models/question';
import {AreaData} from '../../../models/area-data';
import {DropdownOption} from '../../../models/dropdown-option';

@Component({
    selector: 'app-image-search-editor',
    templateUrl: './image-search-editor.component.html'
})
export class ImageSearchEditorComponent implements OnInit {

    @Input()
    public question: Question;

    public tempAreaData = new AreaData();
    public areaShapeOptions: DropdownOption[];
    public selectedAreaShapeOption: DropdownOption;

    constructor() {
    }

    ngOnInit(): void {
        this.areaShapeOptions = [];
        this.areaShapeOptions.push({
            key: 'rect',
            displayValue: 'Rechteckig'
        });
        this.areaShapeOptions.push({
            key: 'circle',
            displayValue: 'Rund'
        });
        this.selectedAreaShapeOption = this.areaShapeOptions[0];
    }

    public clickedCoords(event: any) {
        const areaData = new AreaData();
        areaData.description = '';
        areaData.shape = this.selectedAreaShapeOption.key as 'rect' | 'circle';
        if (areaData.shape === 'circle') {
            areaData.radius = this.tempAreaData && this.tempAreaData.radius > 0 ? this.tempAreaData.radius : 20;
            areaData.x1 = event.offsetX;
            areaData.y1 = event.offsetY;
        } else {
            areaData.x1 = event.offsetX - 20;
            areaData.y1 = event.offsetY - 20;
            areaData.x2 = event.offsetX + 20;
            areaData.y2 = event.offsetY + 20;
            areaData.radius = this.tempAreaData && this.tempAreaData.radius > 0 ? this.tempAreaData.radius : 20;
        }

        this.tempAreaData = areaData;
    }

    public imageChangeListener($event): void {
        const file: File = $event.target.files[0];
        const myReader: FileReader = new FileReader();

        myReader.onloadend = (e) => {
            this.question.imageSearch.imageData = myReader.result as string;
        };
        myReader.readAsDataURL(file);
    }

    public addArea() {
        this.question.imageSearch.areaData.push(this.tempAreaData);
        this.tempAreaData = undefined;
    }

    public deleteArea(index: number) {
        this.question.imageSearch.areaData.splice(index, 1);
    }
}
