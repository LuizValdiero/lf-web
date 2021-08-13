import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {

  af1Str =
  'AFD AsMultiploDe2'
  + '\n' + '2'
  + '\n' + 'q0'
  + '\n' + 'q0'
  + '\n' + 'a'
  + '\n' + 'q0,a,q1'
  + '\n' + 'q1,a,q0'

  af2Str =
  'AFD ImparDeBs'
  + '\n' + '2'
  + '\n' + 'q0'
  + '\n' + 'q1'
  + '\n' + 'b'
  + '\n' + 'q0,b,q1'
  + '\n' + 'q1,b,q0'

  texts: string[] = [
    this.af1Str,
    this.af2Str
  ]

  constructor() { }

  ngOnInit(): void {
  }

  remove = (index: number) => {
    this.texts.splice(index, 1)
  }
}
