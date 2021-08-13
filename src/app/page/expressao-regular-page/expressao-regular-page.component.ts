import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AF } from 'src/app/models/automato';
import { AfParserService } from 'src/app/services/af-parser.service';
import { ConvertErToAfService } from 'src/app/services/convert-er-to-af.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-expressao-regular-page',
  templateUrl: './expressao-regular-page.component.html',
  styleUrls: ['./expressao-regular-page.component.scss']
})
export class ExpressaoRegularPageComponent implements OnInit {

  expression: string = '(a|b)*abb'

  output: string = ''

  form: FormGroup = new FormGroup({
    input: new FormControl(this.expression, [Validators.required])
  })


  constructor(
    private readonly convertErToAfService: ConvertErToAfService,
    private readonly afParserService: AfParserService,
    private readonly storageService: StorageService
  ) { }

  ngOnInit(): void {
  }

  convertToAf = () => {
    const af: AF = this.convertErToAfService.convertToAFD(this.form.value.input)
    this.output = this.afParserService.valueOf(af)
  }


  saveAF(data: string) {
    const name = data.split('\n')[0]
    this.storageService.submitData(name, data)
  }

  saveER(data: string) {
    const name = `ER: ${data}`
    this.storageService.submitData(name, data)
  }
}
