import { Epsilon } from "src/app/models/automato";
import { Gramatica, Production } from "src/app/models/gramatica";

export class ParserGLC {
  constructor() {}

  static parse = (glc: Gramatica) => {
    throw new Error('not implemented')
  }

  static valueOf = (glcStr: string): Gramatica => {
    const lines: string[] = glcStr.split('\n')
    const productions: Production[] = []
    let nonTerminals: string[] = []
    const terminals: string[] = []
    let symbols: Set<string> = new Set()

    for(let line of lines) {
      const l = line.split('->')
      if (l.length !== 2) {
        throw new Error('Invalid GLC: ' + line)
      }
      const head = ParserGLC.removeEmptySpaces(l[0].trim())
      const body = l[1].trim().split(' ').filter(v => v!='')

      nonTerminals.push(head)
      symbols = new Set([...symbols, ...body])
      productions.push(
        {
          head,
          body
        }
      )
    }
    const initial = nonTerminals[0]
    nonTerminals = [...new Set(nonTerminals)]

    const glc: Gramatica = {
      initial,
      productions,
      nonTerminals,
      terminals: [...symbols].filter(t => !nonTerminals.includes(t) && t !== Epsilon)
    }
    console.log(JSON.stringify(glc))
    return glc;
  }

  public static removeEmptySpaces = (input: string): string => {
    return input.replace(/\s/g, '')
  }
}
