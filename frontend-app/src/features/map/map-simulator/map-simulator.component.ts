import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import * as olProj from 'ol/proj';
import Overlay from 'ol/Overlay';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';

@Component({
  selector: 'app-map-simulator',
  templateUrl: './map-simulator.component.html',
  styleUrls: ['./map-simulator.component.css']
})
export class MapSimulatorComponent implements OnInit {
  map!: Map;
  longitude: number = 19.8335; // Pozicije markera (naseg dostavljaca)
  latitude: number = 45.2671;

  constructor() {}

  ngOnInit(): void {
    this.initializeMap();
    this.addMarker([this.longitude, this.latitude], 'https://cdn-icons-png.flaticon.com/256/3855/3855480.png');
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
}
