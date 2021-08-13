import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { determineAf } from 'src/app/models/automato';
import { AfParserService } from 'src/app/services/af-parser.service';

@Component({
  selector: 'app-determinizacao-page',
  templateUrl: './determinizacao-page.component.html',
  styleUrls: ['./determinizacao-page.component.scss']
})
export class DeterminizacaoPageComponent implements OnInit {

  form: FormGroup = new FormGroup({
    input: new FormControl('', [Validators.required])
  })

  output: string = ''

  constructor(
    private readonly afParser: AfParserService,
    private readonly router: Router
  ) {
    const navigation = this.router.getCurrentNavigation()
    if(navigation) {
      this.form.patchValue({input: navigation.extras.state?.input || ''})
    }
  }

  ngOnInit(): void {
  }

  determine  = () => {
    const afStr = this.form.value.input

    const af = this.afParser.parse(afStr)
    const afd = determineAf(af)

    this.output = this.afParser.valueOf(afd)
  }
}
