import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-markers',
  templateUrl: './markers.component.html'
})
export class MarkersComponent implements AfterViewInit, OnDestroy {
  @ViewChild('divMap')
  public divMap!: ElementRef;

  public map!: mapboxgl.Map;

  public zoomLevel: number = 15;

  public center: [number, number] = [-71.132664, 8.620822];

  constructor() { }

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel,
      projection: {name: 'globe'}
    });

    const marketHTML: HTMLElement = document.createElement('em');
    marketHTML.classList.add('bi');
    marketHTML.classList.add('bi-house-fill');
    marketHTML.style.fontSize = '25px';

    new mapboxgl.Marker({
      element: marketHTML
    })
      .setLngLat(this.center)
      .addTo(this.map);

    this.map.on('style.load', () => {
      this.map.setFog({});
    });

    this.map.on('zoom', event => {this.zoomLevel = event.target.getZoom()});

    this.map.on('zoomend', event => {event.target.getZoom() > 18 && this.map.zoomTo(18)});

    this.map.on('move', event => {
      const {target} = event;
      const {lng, lat} = target.getCenter();
      this.center = [lng, lat]
    });

  }

  ngOnDestroy(): void {
    this.map.off('zoom', () => {});
    this.map.off('zoomend', () => {});
    this.map.off('move', () => {});
    this.map.off('style.load', () => {});
  }

}
