import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  theme = 'dark';

  constructor() { }

  ngOnInit(): void {
  }

  switchTheme(theme: string) {
    this.theme = theme;
  }

}
