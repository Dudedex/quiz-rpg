import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ApiClientService {

    private static BASE_PATH = 'http://5.230.70.116:3000/';

    constructor(private httpClient: HttpClient) { }

    public checkStartTime(lobby: string) {
        return this.httpClient.get(ApiClientService.BASE_PATH  + ApiClientService.streamLineLobby(lobby));
    }

    public quizFinished(lobby: string, object: any) {
        return this.httpClient.post(ApiClientService.BASE_PATH + ApiClientService.streamLineLobby(lobby) + 'finished', object);
    }

    public registerPlayer(lobby: string, username: string) {
        return this.httpClient.post(ApiClientService.BASE_PATH + ApiClientService.streamLineLobby(lobby) + 'registerPlayer', {username});
    }

    public startGame(lobby: string, token: string) {
        const headers = new HttpHeaders().set('Authorization', token).set('Content-Type', 'application/json').set('Accept', 'application/json');
        return this.httpClient.post(ApiClientService.BASE_PATH + ApiClientService.streamLineLobby(lobby) + 'admin/startGame', {}, {
            headers
        });
    }

    public clearGame(lobby: string, token: string) {
        const headers = new HttpHeaders().set('Authorization', token);
        return this.httpClient.post(ApiClientService.BASE_PATH  + ApiClientService.streamLineLobby(lobby) + 'admin/clearGame', {}, {
            headers
        });
    }

    public loadStats(lobby: string) {
        return this.httpClient.post(ApiClientService.BASE_PATH  + ApiClientService.streamLineLobby(lobby) + 'stats', {});
    }

    private static streamLineLobby(lobby: string) {
        return lobby.replace('/', '') + '/';
    }
}
