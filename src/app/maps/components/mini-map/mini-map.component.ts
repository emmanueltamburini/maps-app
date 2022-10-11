import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-mini-map',
  templateUrl: './mini-map.component.html',
  styles: [
    `
      div {
        width: 100%;
        height: 150px;
        margin: 0px;
      }
    `
  ]
})
export class MiniMapComponent implements AfterViewInit, OnDestroy {

  @Input('center')
  public center: [number, number] = [0, 0];

  @ViewChild('map')
  public divMap!: ElementRef;

  public map!: mapboxgl.Map;

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: 15,
      projection: {name: 'globe'},
      interactive: false
    });

    this.map.on('style.load', () => {
      this.map.setFog({});
    });

    new mapboxgl.Marker()
      .setLngLat(this.center)
      .addTo(this.map);
  }

  ngOnDestroy(): void {
    this.map.off('style.load', () => {});
  }
}
