import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EntityType } from 'src/app/models/entity-type';
import { ActionType, analize, END, FirstMap, FollowMap, Gramatica, LR1Table, NonTerminal } from 'src/app/models/gramatica';
import { FirstFollowGLCService } from 'src/app/services/glc/first-follow-glc.service';
import { LR1GeneratorService } from 'src/app/services/glc/lr1-generator.service';
import { ParserGLC } from 'src/app/services/glc/parser-glc';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-gerador-analizador-sintatico-page',
  templateUrl: './gerador-analizador-sintatico-page.component.html',
  styleUrls: ['./gerador-analizador-sintatico-page.component.scss']
})
export class GeradorAnalizadorSintaticoPageComponent implements OnInit {
  glc2 = 'S -> A B C \n A -> a A \n A -> & \n B -> b B \n B -> A C d \n C -> c C \n C -> &'
  glc3 = 'S -> A b \n S -> A B c \n B -> b B  \n B -> A d  \n B -> &  \n A -> a A \n A -> &'
  glc4 = 'S -> C C \n C -> c C \n C -> d'
  glc1 = this.glc4

  lr1Table: LR1Table | undefined;

  word = 'c d d'

  action: string[] = []
  goto: NonTerminal[] = []

  form: FormGroup = new FormGroup(
    {
      glc: new FormControl(this.glc1, [Validators.required]),
    }
  )

  formCompute: FormGroup = new FormGroup(
    {
      word: new FormControl(this.word, [Validators.required]),
    }
  )


  firstOutput: string = ''
  followOutput: string = ''
  output: string = ''

  constructor(
    private readonly storageService: StorageService,
    private readonly firstFollowService: FirstFollowGLCService,
    private readonly lr1GeneratorService: LR1GeneratorService

  ) { }

  ngOnInit(): void { }

  createSA = () => {
    const glcStr: string = this.form.value.glc
    const glc: Gramatica = ParserGLC.valueOf(glcStr)

    const first: FirstMap = this.firstFollowService.createFirsts(glc)
    const follow: FollowMap = this.firstFollowService.createFollows(glc, first) // fix: follow com problema

    this.lr1Table = this.lr1GeneratorService.createTableLR1(glc, first, follow)
    this.action = [...this.lr1Table.lr1.glc.terminals, END ]
    this.goto = [...this.lr1Table.lr1.glc.nonTerminals]



  }

  computeWord = () => {
    console.log('computeWord')
    try{
      console.log(this.formCompute)
      const word: string = this.formCompute.value.word
      if (this.lr1Table && word !== undefined) {
        const tokens = word.trim().split(' ').map((t: string) => ParserGLC.removeEmptySpaces(t)).filter((t: string) => t !=='')
        this.output = analize(this.lr1Table, tokens)
      } else {
        console.log(this.lr1Table, word)
      }
    } catch(e) {
      console.log(e);
      this.output = JSON.stringify(e)
    }
  }

  saveGLC(save: string) {
    const name = 'GLC'
    this.storageService.submitData(name, save, EntityType.Glc)
  }

  saveLR1Table(save: string) {
    const name = 'lr1-table'
    this.storageService.submitData(name, save, EntityType.Lr1Table)
  }


  private parseMapToString = (title: string, map: Map<string, Set<string>>): string => {
    let text = ''
    map.forEach((value, key) => text = text + `${title} (${key}): ${JSON.stringify([...value])} \n`)
    return text;
  }

  showAction = (obj: {i: number, action: string} | undefined): string => {
    if (obj) {
      if (obj.action === ActionType.ACCEPT) {
        return obj.action.toLowerCase()
      }
      return (obj.action + obj.i).toLowerCase()
    }
    return ''
  }

}
