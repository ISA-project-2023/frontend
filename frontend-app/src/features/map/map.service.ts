import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, map } from 'rxjs';
import { Message } from '../companies/model/message.model';

@Injectable({
    providedIn: 'root'
})
export class MapService {
  url: string = "http://localhost:8080/api/socket";
  restUrl:string = "http://localhost:8080/sendMessageRest";

    // private stompClient: Client | undefined;
    // private latestMessageSubject = new Subject<string>();

    constructor(private http: HttpClient) {
        //this.initializeWebSocketConnection();
    }

    post(data: Message) {
      return this.http.post<Message>(this.url, data)
        .pipe(map((data: Message) => { return data; }));
    }
  
    postRest(data: Message) {
      return this.http.post<Message>(this.restUrl, data)
        .pipe(map((data: Message) => { return data; }));
    }

    // private initializeWebSocketConnection() {
    //     const socket = new WebSocket('ws://localhost:8080/websocket');
    //     this.stompClient = new Client({
    //         brokerURL: 'ws://localhost:8080/websocket',
    //         connectHeaders: {},
    //         debug: function (str) {
    //             console.log(str);
    //         },
    //         onConnect: (frame) => {
    //             this.stompClient?.subscribe('/topic/location', (message: Message) => {
    //                 if (message.body) {
    //                     this.latestMessageSubject.next(message.body);
    //                 }
    //             });
    //         }
    //     });

    //     this.stompClient.activate();
    // }

    // getLatestMessage(): Observable<string> {
    //     return this.latestMessageSubject.asObservable();
    // }
}
