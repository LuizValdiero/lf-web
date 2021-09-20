import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  showTools:boolean = false
  showLA:boolean = false
  showSA: boolean = false

  constructor() { }

  ngOnInit(): void {
  }

  openCloseTools = () => {
    this.showTools = !this.showTools
  }

  openCloseLA = () => {
    this.showLA = !this.showLA
  }

  openCloseSA = () => {
    this.showSA = !this.showSA
  }
}
