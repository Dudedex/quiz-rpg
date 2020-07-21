import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

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
}
