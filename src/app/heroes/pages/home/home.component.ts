import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  theme = 'dark';

  constructor() { }

  switchTheme(theme: string): void {
    this.theme = theme;
  }

}
