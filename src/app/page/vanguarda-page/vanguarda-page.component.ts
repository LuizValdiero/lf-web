import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Epsilon } from 'src/app/models/automato';
import { LA, TokenDefinition } from 'src/app/models/er';
import { ActionType, analize, END, FirstMap, FollowMap, Gramatica, LR1Table, NonTerminal } from 'src/app/models/gramatica';
import { FirstFollowGLCService } from 'src/app/services/glc/first-follow-glc.service';
import { LR1GeneratorService } from 'src/app/services/glc/lr1-generator.service';
import { ParserGLC } from 'src/app/services/glc/parser-glc';
import { LexicalAnalyzerService } from 'src/app/services/lexical-analyzer.service';

@Component({
  selector: 'app-vanguarda-page',
  templateUrl: './vanguarda-page.component.html',
  styleUrls: ['./vanguarda-page.component.scss']
})
export class VanguardaPageComponent implements OnInit {
  glcStr = 'S -> ROW \nROW -> IF \nIF -> if { } ELSE \nELSE -> & \nELSE -> else { }'
  expressionsStr = '[{"id": "if", "expression": "if"}, {"id": "else", "expression": "else"}, {"id": "{", "expression": "{"}, {"id": "}", "expression": "}"}]'

  code = 'if { } else { }'

  la: LA | undefined
  outputTS: {key: string, values: string[]}[] = []
  outputLS: string[] = []

  lr1Table: LR1Table | undefined;
  action: string[] = []
  goto: NonTerminal[] = []


  form: FormGroup = new FormGroup(
    {
      glc: new FormControl(this.glcStr, [Validators.required]),
      expressions: new FormControl(this.expressionsStr, [Validators.required])
    }
  )

  formCompile: FormGroup = new FormGroup(
    {
      code: new FormControl(this.code, [Validators.required]),
    }
  )

  output: string = ''
  result: string = ''

  constructor(
    private readonly lexicalAnalizer: LexicalAnalyzerService,
    private readonly firstFollowService: FirstFollowGLCService,
    private readonly lr1GeneratorService: LR1GeneratorService
  ) {}

  ngOnInit(): void {
  }

  createAnaliser = () => {
    const glcStr: string = this.form.value.glc
    const expresssionsStr: string = this.form.value.expressions

    this.la = this.createLA(expresssionsStr)

    this.lr1Table = this.createSA(glcStr)

    this.action = [...this.lr1Table.lr1.glc.terminals, END ]
    this.goto = [...this.lr1Table.lr1.glc.nonTerminals]
  }


  compute = () => {
    const code: string = this.formCompile.value.code
    if (this.la === undefined ) {
      throw new Error('la not found')
    }
    if (this.lr1Table === undefined ) {
      throw new Error('lr1 table not found')
    }

    try {

      const [ts, ls] = this.analiseLa(this.la, code)
      const tokens: string[] = []
      ls.forEach((t) => {
        const l = ts.get(t)
        if (l && l.length > 0) {
          tokens.push(l[0])
        } else {
          throw new Error(`Error to identify ${t}`)
        }
      })
      console.log(ts, ls)
      const log = { text: ''}

      this.outputTS = Array.from(ts).map(([key, values]) => { return {key, values} })
      this.outputLS = ls
      this.result = this.analiseSa(this.lr1Table, tokens, log)
    } catch (e) {
      this.result = ''+e
    }
  }

  private createLA = (expressionJsonStr: string): LA => {
    let definitionsList: TokenDefinition[]
    try {
      definitionsList = JSON.parse(expressionJsonStr)
    } catch (error) {
      console.error(error)
      throw new Error('Parse Json file')
    }
    if(!(definitionsList && definitionsList.length > 0)) {
      throw new Error('Empty definitions')
    }
    return this.lexicalAnalizer.create(definitionsList)
  }

  private createSA = (glcStr: string): LR1Table => {
    const glc: Gramatica = ParserGLC.valueOf(glcStr)

    const first: FirstMap = this.firstFollowService.createFirsts(glc)
    const follow: FollowMap = this.firstFollowService.createFollows(glc, first) // fix: follow com problema

    return this.lr1GeneratorService.createTableLR1(glc, first, follow)
  }

  private analiseLa = (la: LA ,code: string): [Map<string,string[]>, string[]] => {
    const [ts, ls] = this.lexicalAnalizer.analize(la, code)
    return [ts, ls]
  }

  analiseSa = (lr1Table: LR1Table, tokens: string[], log: { text: string }): string => {
    try{
      analize(lr1Table, tokens, log)
    } catch(e) {
      console.log(e);
    } finally {
      const r = log.text.split('\n')
      return r[r.length-1]
    }
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
