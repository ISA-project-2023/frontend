import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import * as olProj from 'ol/proj';
import Overlay from 'ol/Overlay';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { MapService } from '../map.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message } from 'src/features/companies/model/message.model';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map-simulator',
  templateUrl: './map-simulator.component.html',
  styleUrls: ['./map-simulator.component.css']
})
export class MapSimulatorComponent implements OnInit {
  map!: Map;
  longitude: number = 19.8335; // Pozicije markera (naseg dostavljaca)
  latitude: number = 45.2671;
  form!: FormGroup;
  userForm!: FormGroup;
  isLoaded: boolean = false;
  isCustomSocketOpened = false;
  messages: Message[] = [];
  private stompClient: any;
  latestMessage: string = '';
  markerOverlay!: Overlay;
  buttonClicked: boolean = false;

  constructor(private mapService: MapService, private http: HttpClient) {}

  ngOnInit(): void {
    this.initializeMap();
    this.markerOverlay = new Overlay({
      positioning: 'center-center',
      element: this.createMarkerElement('https://cdn-icons-png.flaticon.com/256/3855/3855480.png'),
      stopEvent: false,
    });
    this.map.addOverlay(this.markerOverlay);

    this.form = new FormGroup({
      message: new FormControl(null, [Validators.required]),
      toId: new FormControl(null)
    })

    this.userForm = new FormGroup({
      fromId: new FormControl(null, [Validators.required])
    })

    this.initializeWebSocketConnection();
  }

  // Funkcija za otvaranje konekcije sa serverom
  initializeWebSocketConnection() { // serverUrl je vrednost koju smo definisali u registerStompEndpoints() metodi na serveru
    let ws = new SockJS('http://localhost:8084/socket');
    this.stompClient = Stomp.over(ws);
    let that = this;

    // this.stompClient.connect({}, function () {
    //   that.isLoaded = true;
    //   that.openGlobalSocket()
    // });
    this.stompClient.connect({}, (frame: any) => {
        console.log('Connected to WebSocket:', frame);
        this.stompClient.subscribe('/socket-publisher', (message: any) => {
            console.log('Received message:', message.body);
            this.updateMap(message.body);
        }, (error: any) => {
          console.error('Error connecting to WebSocket:', error);
      });
        
    });
    
  }

  onStartMessageSendingClick(): void {
    this.buttonClicked = true; 
    this.http.post('http://localhost:8082/api/location/start-message-sending', {})
      .subscribe(
        response => {
          console.log('Message sending started successfully.');
        },
        error => {
          console.error('Error starting message sending:', error);
        }
      );
  }

  // Funkcija salje poruku na WebSockets endpoint na serveru
  sendMessageUsingSocket() {
    if (this.form.valid) {
      let message: Message = {
        message: this.form.value.message,
        fromId: this.userForm.value.fromId,
        toId: this.form.value.toId
      };

      // Primer slanja poruke preko web socketa sa klijenta. URL je 
      //  - ApplicationDestinationPrefix definisan u config klasi na serveru (configureMessageBroker() metoda) : /socket-subscriber
      //  - vrednost @MessageMapping anotacije iz kontrolera na serveru : /send/message
      this.stompClient.send("/socket-subscriber/send/message", {}, JSON.stringify(message));
    }
  }

  // Call this method to send a message to the server
  sendMessageToServer(message: string) {
    this.stompClient.send('/socket-subscriber/send/message', {}, message);
  }

  // Funckija salje poruku na REST endpoint na serveru
  sendMessageUsingRest() {
    if (this.form.valid) {
      var message: Message = {
        message: this.form.value.message,
        fromId: this.userForm.value.fromId,
        toId: this.form.value.toId
      };

      this.mapService.postRest(message).subscribe(res => {
        console.log(res);
      })
    }
  }

  // Funckija za pretplatu na topic /socket-publisher (definise se u configureMessageBroker() metodi)
  // Globalni socket se otvara prilikom inicijalizacije klijentske aplikacije
  openGlobalSocket() {
    if (this.isLoaded) {
      this.stompClient.subscribe("/socket-publisher", (message: { body: string; }) => {
        this.handleResult(message);
      });
    }
  }

  // Funkcija za pretplatu na topic /socket-publisher/user-id
  // CustomSocket se otvara kada korisnik unese svoj ID u polje 'fromId' u submit callback-u forme 'userForm'
  openSocket() {
    if (this.isLoaded) {
      this.isCustomSocketOpened = true;
      this.stompClient.subscribe("/socket-publisher/" + this.userForm.value.fromId, (message: { body: string; }) => {
        this.handleResult(message);
      });
    }
  }

  // Funkcija koja se poziva kada server posalje poruku na topic na koji se klijent pretplatio
  handleResult(message: { body: string; }) {
    if (message.body) {
      let messageResult: Message = JSON.parse(message.body);
      this.messages.push(messageResult);
    }
  }

  initializeMap() {
    const initialCenter = olProj.fromLonLat([20.412597, 44.807173]);
    const initialZoom = 9.5;

    this.map = new Map({
      target: 'map',
      layers: [
        new Tile({
          source: new OSM()
        })
      ],
      view: new View({
        center: initialCenter,
        zoom: initialZoom
      })
    });
  }
  



  createMarkerElement(imageUrl: string): HTMLImageElement {
    const element = new Image();
    element.src = imageUrl;

    element.style.width = '30px';
    element.style.height = '30px';

    element.className = 'map-marker';
    return element;
  }

  addMarker(coordinates: [number, number], imageUrl: string) {
    const [longitude, latitude] = coordinates;
    const position = fromLonLat([longitude, latitude]);

    // Update the existing marker's position
    this.markerOverlay.setPosition(position);
  }

  updateMap(message: string): void {
    const coordinates = message.split(',').map(Number);
    const [latitude, longitude] = coordinates;
    this.addMarker([longitude, latitude], 'https://cdn-icons-png.flaticon.com/256/3855/3855480.png');
  }
}