import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  glcStr = 'S -> ROW  \nROW -> IF \nROW -> IF ROW \nSCOP -> { ROW } \nSCOP -> { } \nIF -> if COND SCOP ELSE  \nIF -> if COND SCOP  \nELSE -> else SCOP \nCOND -> COMP  \nCOND -> true  \nCOND -> false  \nCOMP -> num op-cmp num '
  expressionsStr = '[\n  {\n    "id": "if", \n    "expression": "if"\n  }, \n  {\n    "id": "else", \n    "expression": "else"\n  }, \n  {\n    "id": "{", \n    "expression": "{"\n  }, \n  {\n    "id": "}", \n    "expression": "}"\n  }, \n  {\n    "id": "false", \n    "expression": "false"\n  },\n  {\n    "id": "true", \n    "expression": "true"\n  },\n  {\n    "id": "num", \n    "expression": "(0|(1|(2|3)))*"\n  },\n  {\n    "id": "op-cmp", \n    "expression": "(==|!=)"\n  }\n]'

  code = 'if 12120 == 2 { if true { } else { } } if false { }'

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

  log: { text: string } = { text: ''}
  result: string = ''

  constructor(
    private readonly lexicalAnalizer: LexicalAnalyzerService,
    private readonly firstFollowService: FirstFollowGLCService,
    private readonly lr1GeneratorService: LR1GeneratorService
  ) {}

  ngOnInit(): void {
  }

  createAnaliser = () => {
    this.log.text = '', this.outputTS = [], this.outputLS = [], this.lr1Table = undefined
    const glcStr: string = this.form.value.glc
    const expresssionsStr: string = this.form.value.expressions
    try {
      this.la = this.createLA(expresssionsStr)

      this.lr1Table = this.createSA(glcStr)

      this.action = [...this.lr1Table.lr1.glc.terminals, END ]
      this.goto = [...this.lr1Table.lr1.glc.nonTerminals]
    } catch(e) {
      this.log.text += '\n' + e
    }
  }


  compute = () => {
    const code: string = this.formCompile.value.code
    if (this.la === undefined ) {
      const msgError = 'la not found'
      this.log.text += '\nError: ' + msgError
      throw new Error(msgError)
    }
    if (this.lr1Table === undefined ) {
      const msgError = 'lr1 table not found'
      this.log.text += '\nError: ' + msgError
      throw new Error(msgError)
    }
    try {

      const [ts, ls] = this.analiseLa(this.la, code)
      const tokens: string[] = []
      ls.forEach((t) => {
        const l = ts.get(t)
        if (l && l.length > 0) {
          tokens.push(l[0])
        } else {
          const msgError = `Error to identify ${t}`
          this.log.text += '\n' + msgError
          throw new Error(msgError)
        }
      })
      console.log(ts, ls)

      this.outputTS = Array.from(ts).map(([key, values]) => { return {key, values} })
      this.outputLS = ls
      this.result = this.analiseSa(this.lr1Table, tokens, this.log)
    } catch (e) {
      this.log.text += '\n' + e
      this.result = ''+e
    }
  }

  private createLA = (expressionJsonStr: string): LA => {
    let definitionsList: TokenDefinition[]
    try {
      definitionsList = JSON.parse(expressionJsonStr)
    } catch (error) {
      console.error(error)
      const msgError = 'Parse Json file'
      this.log.text += '\n' + msgError
      throw new Error(msgError)
    }
    if(!(definitionsList && definitionsList.length > 0)) {
      const msgError = 'Empty definitions'
      this.log.text += '\n' + msgError
      throw new Error(msgError)
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
      const msgError = ''+e
      this.log.text += '\n' + e
      throw new Error(msgError)
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
