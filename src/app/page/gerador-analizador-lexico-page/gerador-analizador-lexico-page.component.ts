import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EntityType } from 'src/app/models/entity-type';
import { LA, TokenDefinition } from 'src/app/models/er';
import { AfParserService } from 'src/app/services/af-parser.service';
import { LexicalAnalyzerService } from 'src/app/services/lexical-analyzer.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-gerador-analizador-lexico-page',
  templateUrl: './gerador-analizador-lexico-page.component.html',
  styleUrls: ['./gerador-analizador-lexico-page.component.scss']
})
export class GeradorAnalizadorLexicoPageComponent implements OnInit {

  myDefinition = '[{"id": "first", "expression": "aa"}, {"id": "second", "expression": "bb"}, {"id": "third", "expression": "cc"}, {"id": "fourth", "expression": "a*"}]'

  form: FormGroup = new FormGroup(
    {
      definitions: new FormControl(this.myDefinition, [Validators.required]),
    }
  )
  output: string = ''

  constructor(
    private readonly afParser: AfParserService,
    private readonly lexicalAnalizer: LexicalAnalyzerService,
    private readonly storageService: StorageService
  ) { }

  ngOnInit(): void { }

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

    const laFile = {
      definitions: la.definitions,
      map: Array.from(la.map).map(([key, values]) => { return {key, values} }),
      af: this.afParser.valueOf(la.af)
    }
    this.output = JSON.stringify(laFile)
  }

  saveDefinitions(save: string) {
    const name = 'Definitions'
    this.storageService.submitData(name, save, EntityType.Definitions)
  }

  saveLa(save: string) {
    const name = 'La'
    this.storageService.submitData(name, save, EntityType.La)
  }
}
