import { Component, OnDestroy, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html'
})
export class FullScreenComponent implements OnInit, OnDestroy {

  public map!: mapboxgl.Map;

  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-71.132664, 8.620822],
      zoom: 15,
      projection: {name: 'globe'}
    });

    this.map .on('style.load', () => {
      this.map .setFog({});
    });
  }

  ngOnDestroy(): void {
    this.map.off('style.load', () => {});
  }

}
