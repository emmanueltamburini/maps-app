import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';

interface Markers {
  marker: mapboxgl.Marker,
  color?: string,
  center?: [number, number]
}

@Component({
  selector: 'app-markers',
  templateUrl: './markers.component.html',
  styles: [`
    .list-group {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99;
    }
    .message {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 99;
      color: red;
    }
    li {
      cursor: pointer
    }
  `]
})
export class MarkersComponent implements AfterViewInit, OnDestroy {
  @ViewChild('divMap')
  public divMap!: ElementRef;

  public map!: mapboxgl.Map;

  public zoomLevel: number = 15;

  public center: [number, number] = [-71.132664, 8.620822];

  public markers: Markers[] = [];

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel,
      projection: {name: 'globe'}
    });

    this.loadMarkers();

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
    this.markers.forEach(marker => {
      marker.marker.off('dragend');
    });
  }

  private _createMarker(color: string, center: [number, number]): void {
    const marker: mapboxgl.Marker = new mapboxgl.Marker({
      draggable: true, color
    })
      .setLngLat(center)
      .addTo(this.map);

    marker.on('dragend', () => {
      this.saveMarkers();
    })

    this.markers.push({marker, color});
  }

  public addMarker(): void {
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));

    this._createMarker(color, this.center);

    this.saveMarkers();
  }

  public goMarker(currentMarker: mapboxgl.Marker): void {
    this.map.flyTo({
      center: currentMarker.getLngLat()
    })
  }

  public deleteMarker(i: number) {
    const currentMarker: mapboxgl.Marker = this.markers[i].marker;
    currentMarker.off('dragend');
    currentMarker.remove();
    this.markers.splice(i, 1);
    this.saveMarkers();
  }

  public saveMarkers(): void {
    const markersToSave = this.markers.map(marker =>  {
      const {lng, lat} = marker.marker.getLngLat();
      return {
        color: marker.color,
        center: [lng, lat]
      }
    });

    localStorage.setItem('markers', JSON.stringify(markersToSave));
  }

  public loadMarkers(): void {
    const markers: string | null = localStorage.getItem('markers');
    if(!markers) {
      return;
    }

    const markersSaved: Markers[] = JSON.parse(markers);

    markersSaved.forEach(marker => {
      this._createMarker(marker.color!, marker.center!);
    });
  }

}
