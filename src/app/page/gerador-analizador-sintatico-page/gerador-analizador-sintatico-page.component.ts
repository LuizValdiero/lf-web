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
  glc2 = 'S -> A B C \nA -> a A \nA -> & \nB -> b B \nB -> A C d \nC -> c C \nC -> &'
  glc3 = 'S -> A b \nS -> A B c \nB -> b B  \nB -> A d  \nB -> &  \nA -> a A \nA -> &'
  glc4 = 'S -> C C \nC -> c C \nC -> d'
  glc1 = this.glc4


  word = 'c d d'
  result = ''
  log: {text: string} = {text:''}

  lr1Table: LR1Table | undefined;
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
    try{
      const word: string = this.formCompute.value.word
      if (this.lr1Table && word !== undefined) {
        const tokens = word.trim().split(' ').map((t: string) => ParserGLC.removeEmptySpaces(t)).filter((t: string) => t !=='')
        analize(this.lr1Table, tokens, this.log)
      } else {
        console.log(this.lr1Table, word)
      }
    } catch(e) {
      console.log(e);
    } finally {
      const r = this.log.text.split('\n')
      this.result = r[r.length-1]
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
