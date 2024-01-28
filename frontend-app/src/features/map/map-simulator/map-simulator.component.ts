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

  private serverUrl = 'http://localhost:8080/socket'
  private stompClient: any;

  latestMessage: string = '';

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.initializeMap();
    this.addMarker([this.longitude, this.latitude], 'https://cdn-icons-png.flaticon.com/256/3855/3855480.png');

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
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;

    this.stompClient.connect({}, function () {
      that.isLoaded = true;
      that.openGlobalSocket()
    });
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
  

  addMarker(coordinates: [number, number], imageUrl: string) {
    const marker = new Overlay({
      position: fromLonLat(coordinates),
      positioning: 'center-center',
      element: this.createMarkerElement(imageUrl),
      stopEvent: false,
    });

    this.map.addOverlay(marker);
  }

  createMarkerElement(imageUrl: string): HTMLImageElement {
    const element = new Image();
    element.src = imageUrl;

    element.style.width = '30px';
    element.style.height = '30px';

    element.className = 'map-marker';
    return element;
  }

  updateMap(message: string): void {

  }
}
