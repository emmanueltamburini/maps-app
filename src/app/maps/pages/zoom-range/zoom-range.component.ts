import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [`
    .row {
      background-color: white;
      border-radius: 5px;
      bottom: 50px;
      left: 50px;
      padding: 10px;
      position: fixed;
      z-index: 99999;
      width: 400px;
    }
  `]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('divMap')
  public divMap!: ElementRef;

  public map!: mapboxgl.Map;

  public zoomLevel: number = 15;

  public center: [number, number] = [-71.132664, 8.620822];


  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel,
      projection: {name: 'globe'}
    });

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

  public setZoom (zoom: string): void {
    this.map.zoomTo(Number(zoom));
  }

  public zoomIn (): void {
    this.map.zoomIn();
  }

  public zoomOut (): void {
    this.map.zoomOut();
  }
}
