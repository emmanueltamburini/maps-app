import { Component } from '@angular/core';

interface MenuItem {
  root: string,
  name: string
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: [`
    li {
      cursor: pointer
    }
  `]
})
export class MenuComponent {

  public items: MenuItem [] = [
    {
      root: '/maps/fullscreen',
      name: 'Fullscreen'
    },
    {
      root: '/maps/zoom-range',
      name: 'Zoon Range'
    },
    {
      root: '/maps/markers',
      name: 'Markers'
    },
    {
      root: '/maps/real-estate',
      name: 'Real Estate'
    }
  ]

}
