import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LA, TokenDefinition } from 'src/app/models/er';
import { LexicalAnalyzerService } from 'src/app/services/lexical-analyzer.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-analizador-lexico-page',
  templateUrl: './analizador-lexico-page.component.html',
  styleUrls: ['./analizador-lexico-page.component.scss']
})
export class AnalizadorLexicoPageComponent implements OnInit {

  myDefinition = '[{"id": "first", "expression": "aa"}, {"id": "second", "expression": "bb"}, {"id": "third", "expression": "cc"}, {"id": "fourth", "expression": "a*"}]'

  form: FormGroup = new FormGroup(
    {
      definitions: new FormControl(this.myDefinition, [Validators.required]),
      code: new FormControl('a', [Validators.required])
    }
  )
  output: string = ''



  constructor(
    private readonly lexicalAnalizer: LexicalAnalyzerService,
    private readonly storageService: StorageService
  ) {}

  ngOnInit(): void {
  }

  createLA = () => {
    const definitionsStr: string = this.form.value.definitions
    console.log(definitionsStr)
    let definitionsList: TokenDefinition[]
    try {
      definitionsList = JSON.parse(this.form.value.definitions)
    } catch (error) {
      console.error(error)
      throw new Error('Parse Json file')
    }
    if(!(definitionsList && definitionsList.length > 0)) {
      throw new Error('Empty definitions')
    }
    const la: LA = this.lexicalAnalizer.create(definitionsList)
    this.output = this.lexicalAnalizer.analize(la, this.form.value.code)
  }

  save(save: string) {
    const name = save.split('\n')[0]
    this.storageService.submitData(name, save)
  }
}
