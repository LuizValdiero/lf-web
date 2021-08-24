import { Injectable } from '@angular/core';
import { AF, compute, copyAf, determineAf, joinAf, renameAf, StateAF } from '../models/automato';
import { LA, TokenAF, TokenDefinition, validTokenDefinition } from '../models/er';
import { ConvertErToAfService } from './convert-er-to-af.service';

@Injectable({
  providedIn: 'root'
})
export class LexicalAnalyzerService {

  constructor(
    private convertErToAFD: ConvertErToAfService
  ) { }

  public create = (definitions: TokenDefinition[]): LA => {
    const tokenAfList: TokenDefinition[] = []
    let afJoin: AF | undefined = undefined;
    definitions.forEach((tokenDefinition: TokenDefinition) => {
      validTokenDefinition(tokenDefinition)

      const afdFromEr: AF = this.convertErToAFD.convertToAFD(tokenDefinition.expression)
      const prefixName = `${tokenAfList.length}q`
      const afdRenamed = renameAf(afdFromEr, prefixName)
      tokenAfList.push(tokenDefinition)
      if (afJoin) {
        afJoin = joinAf(copyAf(afJoin), copyAf(afdRenamed))
        afJoin = determineAf(afJoin)
      } else {
        afJoin = afdRenamed
      }
    })
    if (afJoin !== undefined) {
      const afd: AF = determineAf(afJoin)
      const laMap = this.mountLexicalAnalizerMap(afd.final)
      return {
        definitions: tokenAfList,
        map: laMap,
        af: afd
      }
    }
    throw new Error('Error to join definitions')
  }

  private mountLexicalAnalizerMap = (finals: StateAF[]): Map<StateAF, number[]> => {
    const la: Map<StateAF, number[]> = new Map()
    finals.forEach((final: StateAF) => {
      const tokens = final.split('_').filter((key: string) => key !== 'f').map((key: string) => +key.split('q')[0])
      la.set(final, tokens)
    })
    return la
  }

  // retornar a TS e lista de tokens
  analize = (la: LA, code: string): string => {
    let output = ''
    const ts: Map<string, string[]> = new Map()
    const ls: string[] = []
    const lexemes = this.getLexemesFromStr(code)
    lexemes.forEach((lex: string) => {
      if(!ts.has(lex)) {
        const definitionsMatch = la.map.get(compute(la.af, lex))
        if (definitionsMatch) {
          ts.set(lex, definitionsMatch.map((index: number) => la.definitions[index].id))
        } else {
          throw new Error(`analise: ${lex}`)
        }
      }
      // posso usar a propria lista de tokens
      ls.push(lex)
      output = output.concat(`${lex}: ${ts.get(lex)}\n`)
    })
    console.log('ts', ts)
    console.log('ls', ls)
    return output
  }

  private getLexemesFromStr = (input: string): string[] => input.replace(/\s\s*/g, ' ').trim().split(' ')

}
