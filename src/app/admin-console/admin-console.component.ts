import { Component, OnInit } from '@angular/core';
import {ApiClientService} from '../api-client.service';

@Component({
    selector: 'app-admin-console',
    templateUrl: './admin-console.component.html',
    styleUrls: ['./admin-console.component.sass']
})
export class AdminConsoleComponent implements OnInit {

    public token: string;
    public lobby: string = 'show';

    constructor(private apiClient: ApiClientService) { }

    ngOnInit(): void {
    }

    public startGame() {
        this.apiClient.startGame(this.lobby, this.token).subscribe();
    }

    public clearGame() {
        this.apiClient.clearGame(this.lobby, this.token).subscribe();
    }

}
