import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AF, joinAf } from 'src/app/models/automato';
import { AfParserService } from 'src/app/services/af-parser.service';
import { StorageService } from 'src/app/services/storage.service';


@Component({
  selector: 'app-automato-page',
  templateUrl: './automato-page.component.html',
  styleUrls: ['./automato-page.component.scss']
})
export class AutomatoPageComponent implements OnInit {

  af1Str =
  'AsMultiploDe2'
  + '\n' + '2'
  + '\n' + 'q0'
  + '\n' + 'q0'
  + '\n' + 'a'
  + '\n' + 'q0,a,q1'
  + '\n' + 'q1,a,q0'


  af2Str =
  'ImparDeBs'
  + '\n' + '2'
  + '\n' + 'q0'
  + '\n' + 'q1'
  + '\n' + 'b'
  + '\n' + 'q0,b,q1'
  + '\n' + 'q1,b,q0'

  form: FormGroup = new FormGroup(
    {
      af1In: new FormControl(this.af1Str, [Validators.required]),
      af2In: new FormControl(this.af2Str, [Validators.required])
    }
  )
  output: string = ''



  constructor(
    private readonly afParser: AfParserService,
    private readonly storageService: StorageService
  ) {}

  ngOnInit(): void {
  }

  join = () => {
    const af1Str: string = this.form.value.af1In
    const af2Str: string = this.form.value.af2In

    const af1: AF = this.afParser.parse(af1Str)
    const af2: AF = this.afParser.parse(af2Str)

    const afOutput: AF = joinAf(af1, af2)

    this.output = this.afParser.valueOf(afOutput)
  }

  save(save: string) {
    const name = save.split('\n')[0]
    this.storageService.submitData(name, save)
  }

}
