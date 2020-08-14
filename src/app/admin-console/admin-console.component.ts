import { Component, OnInit } from '@angular/core';
import {ApiClientService} from '../api-client.service';
import {interval, Subscription} from 'rxjs';
import {Game} from '../models/game';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
    selector: 'app-admin-console',
    templateUrl: './admin-console.component.html',
    styleUrls: ['./admin-console.component.sass']
})
export class AdminConsoleComponent implements OnInit {

    public token: string;
    public lobbyName: string;
    public gameFile: string;
    public gamesSubscription: Subscription;
    public games: Game[];
    public showedGames: string [] = [];

    constructor(private apiClient: ApiClientService, private clipboard: Clipboard) { }

    ngOnInit(): void {
        this.gamesSubscription = interval(1500).subscribe(() => {
            if (this.token && this.token.trim() !== '') {
                this.apiClient.loadGames(this.token).subscribe((res: any) => {
                    this.games = res;
                });
            }
        });
    }

    public startGame(lobby: string) {
        this.apiClient.startGame(lobby, this.token).subscribe();
    }

    public clearGame(lobby: string) {
        this.apiClient.clearGame(lobby, this.token).subscribe();
    }

    public toggleShowedGame(gameName: string) {
        const index = this.showedGames.indexOf(gameName);
        if (index === -1) {
            this.showedGames.push(gameName);
        } else {
            this.showedGames.splice(index, 1);
        }
    }

    public gameShown(game: Game) {
        if (!game || !this.showedGames) {
            return false;
        }
        return this.showedGames.indexOf(game.name) > -1;
    }

    public registerGame() {
        this.apiClient.registerGame(this.token, this.lobbyName, this.gameFile).subscribe(() => {});
    }

    public deleteGame(gameName) {
        this.apiClient.deleteGame(this.token, gameName).subscribe(() => {});
    }

    public getRightQuestions(game: Game, playerName: string) {
        if (!game.questionProgress || !game.questionProgress[playerName]) {
            return;
        }
        return game.questionProgress[playerName].filter(answer => answer.answeredCorrectly).length;
    }

    public getLastTickFromPlayer(game: Game, playerName: string) {
        if (!game.lastTick || !game.lastTick[playerName]) {
            return '-';
        }
        return (game.currentServerTime - game.lastTick[playerName]) + '';
    }

    public copyGameLink(name: string) {
        this.clipboard.copy(this.getGameLink(name));
    }

    public getGameLink(name: string) {
        const getUrl = window.location;
        const baseUrl = getUrl .protocol + '//' + getUrl.host + '/';
        return baseUrl + 'quiz-rpg/quiz/' + name;
    }

}
