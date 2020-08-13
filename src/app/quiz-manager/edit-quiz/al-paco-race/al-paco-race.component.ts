import {Component, Input, OnInit} from '@angular/core';
import {Question} from '../../../models/question';

@Component({
    selector: 'app-al-paco-race',
    templateUrl: './al-paco-race.component.html'
})
export class AlPacoRaceComponent implements OnInit {
    @Input()
    public question: Question;

    constructor() { }

    ngOnInit(): void {
    }

}
