import { Injectable } from '@angular/core';
import { AF, Alphabet, Production, StateAF } from '../models/automato';


type ProdKey = string

type ProdsReturn = {
  states: Set<string>
  prods: Production[]
}

@Injectable({
  providedIn: 'root'
})
export class AfParserService {

  constructor() { }


  valueOf = (af: AF): string => {
    const output: string[] = []

    output.push(af.name)
    output.push(af.states.length.toString())
    output.push(af.start)
    output.push(af.final.join(','))
    output.push(af.alphabet.join(','))

    af.productions.forEach(([[head, alph], targets]) => {
      targets.forEach(state => output.push(`${head},${alph},${state}`))
    })
    return output.join('\n')
  }

  parse = (af1Text: string): AF => {
    const text: string[] = af1Text.split('\n')

    const name: string = text[0].toString()
    const numberStates: number = +text[1]
    const initialState: StateAF = text[2].toString().replace(' ', '')
    const finalStates: StateAF[] = this.getFinalStates(text[3].toString())
    const alphabet: Alphabet[] = this.getAlphabet(text[4])

    const prodStrArr: string[] = this.removeEmptyValues(text.slice(5))
    const {states: statesSet, prods} = this.getProduction(prodStrArr, alphabet)
    finalStates.forEach(state => statesSet.add(state))

    const states: string[] = [...statesSet]
    if(numberStates != statesSet.size) {
      throw new Error(`number of states != ${numberStates}, found ${statesSet.size}`)
    }

    const af: AF = {
      name,
      alphabet,
      states,
      start: initialState,
      final: finalStates,
      productions: prods
    }
    return af;
  }

  getFinalStates = (input: string): string[] => {
    const states = input.split(',')
    return this.removeEmptyValues(states)
  }
  getAlphabet = (input: string): string[] => {
    const states = input.split(',')
    return this.removeEmptyValues(states)
  }

  getProduction = (prodsStr: string[], alphabet: string[]): ProdsReturn => {
    const states: Set<string> = new Set()
    const prodsMap: Map<ProdKey,string[]> = new Map()

    prodsStr.forEach(
      (prod: string) => {
        const terms: string[] =  this.removeEmptyValues(prod.replace(' ', '').split(','))
        if (terms.length != 3) {
          throw new Error(`Invalid production: ${prod}`)
        }
        if (!alphabet.includes(terms[1])) {
          throw new Error(`Invalid value in production: ${prod}. ${terms[1]} is not defined in the alphabet`)
        }
        states.add(terms[0])
        states.add(terms[2])
        const prodKey = `${terms[0]},${terms[1]}`
        const p = prodsMap.get(prodKey)
        if(p) {
          prodsMap.set(prodKey, [...p, terms[2]])
        } else {
          prodsMap.set(prodKey,[terms[2]])
        }
      }
    )
    const prods: Production[] = []
    prodsMap.forEach((values: string[], key: string) =>  this.addProductionToProds(key, values, prods))
    return {states, prods}
  }

  addProductionToProds = (key: ProdKey, values: string[], prods: Production[]): void => {
    const head = key.split(',')
    if(head) {
      prods.push([[head[0],head[1]], values])
    }
  }

  removeEmptyValues = (list: string[]): string[] => list.filter((elem) => elem !== '')
}
