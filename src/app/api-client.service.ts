import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ApiClientService {

    constructor(private httpClient: HttpClient) { }

    public checkStartTime(lobby: string) {
        return this.httpClient.get(lobby);
    }

    public quizFinished(lobby: string, object: any) {
        return this.httpClient.post(lobby + 'finished', object);
    }

    public registerPlayer(lobby: string, username: string) {
        return this.httpClient.post(lobby + 'registerPlayer', {username});
    }

    public startGame(lobby: string, token: string) {
        const headers = new HttpHeaders().set('Authorization', token).set('Content-Type', 'application/json').set('Accept', 'application/json');
        return this.httpClient.post(lobby + 'admin/startGame', {}, {
            headers
        });
    }

    public clearGame(lobby: string, token: string) {
        const headers = new HttpHeaders().set('Authorization', token);
        return this.httpClient.post(lobby + 'admin/clearGame', {}, {
            headers
        });
    }

    public loadStats(lobby: string) {
        return this.httpClient.post(lobby + 'stats', {});
    }
}
