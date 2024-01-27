import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import * as olProj from 'ol/proj';

@Component({
  selector: 'app-map-simulator',
  templateUrl: './map-simulator.component.html',
  styleUrls: ['./map-simulator.component.css']
})
export class MapSimulatorComponent implements OnInit {
  map!: Map;

  constructor() {}

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.initializeMap();
  }

  initializeMap() {
    const initialCenter = olProj.fromLonLat([20.412597,44.807173]);
    const initialZoom = 9;

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
  
  
}
