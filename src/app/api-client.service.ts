import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Quiz} from './models/quiz';

@Injectable({
    providedIn: 'root'
})
export class ApiClientService {

    private static BASE_PATH = environment.apiUrl;

    constructor(private httpClient: HttpClient) { }

    public checkStartTime(lobby: string, username: string) {
        return this.httpClient.post(ApiClientService.BASE_PATH  + ApiClientService.streamLineLobby(lobby), {username});
    }

    public checkAnswer(lobby: string, userToken: string, questionId: string, answerIds: string[]) {
        return this.httpClient.post(ApiClientService.BASE_PATH  + ApiClientService.streamLineLobby(lobby) + 'checkAnswer', {
            userToken,
            questionId,
            answerIds
        });
    }

    public quizFinished(lobby: string, object: any) {
        return this.httpClient.post(ApiClientService.BASE_PATH + ApiClientService.streamLineLobby(lobby) + 'finished', object);
    }

    public registerPlayer(lobby: string, username: string) {
        return this.httpClient.post(ApiClientService.BASE_PATH + ApiClientService.streamLineLobby(lobby) + 'registerPlayer', {username});
    }

    public restorePlayer(lobby: string, userToken: string) {
        return this.httpClient.post(ApiClientService.BASE_PATH + ApiClientService.streamLineLobby(lobby) + 'restorePlayer', {userToken});
    }

    public loadStats(lobby: string) {
        return this.httpClient.post(ApiClientService.BASE_PATH  + ApiClientService.streamLineLobby(lobby) + 'endGameStats', {});
    }

    // admin
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

    public loadGames(token: string){
        const headers = new HttpHeaders().set('Authorization', token);
        return this.httpClient.get(ApiClientService.BASE_PATH  + 'admin/games', {
            headers
        });
    }

    public registerGame(token: string, gameName: string, gameFile: string) {
        const headers = new HttpHeaders().set('Authorization', token);
        return this.httpClient.post(ApiClientService.BASE_PATH  + gameName + '/admin/registerGame', {
            quizFileName: gameFile
        }, {
            headers
        });
    }

    public deleteGame(token: string, gameName: string){
        const headers = new HttpHeaders().set('Authorization', token);
        return this.httpClient.post(ApiClientService.BASE_PATH  + gameName + '/admin/deleteGame', {}, {
            headers
        });
    }

    public createOrUpdateGame(token: string, quiz: Quiz) {
        const headers = new HttpHeaders().set('Authorization', token);
        return this.httpClient.post(ApiClientService.BASE_PATH  + 'admin/quiz/createOrUpdate', quiz, {
            headers
        });
    }

    public verifyAdmin(token: string) {
        const headers = new HttpHeaders().set('Authorization', token);
        return this.httpClient.post(ApiClientService.BASE_PATH  + 'admin/verify', {}, {
            headers
        });
    }

    public loadExistingQuizzes(token: string) {
        const headers = new HttpHeaders().set('Authorization', token);
        return this.httpClient.post(ApiClientService.BASE_PATH  + 'admin/quizzes', {}, {
            headers
        });
    }

    private static streamLineLobby(lobby: string) {
        return lobby.replace('/', '') + '/';
    }
}
