import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  showMenu:number = 0

  constructor() { }

  ngOnInit(): void {
  }

  openCloseTools = () => {
    this.showMenu = this.showMenu === 1 ? 0 : 1;
  }

  openCloseLA = () => {
    this.showMenu = this.showMenu === 2 ? 0 : 2;
  }

  openCloseSA = () => {
    this.showMenu = this.showMenu === 3 ? 0 : 3;
  }
}
