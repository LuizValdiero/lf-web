import { Injectable } from '@angular/core';
import { Epsilon } from 'src/app/models/automato';
import { FirstMap, FollowMap, Gramatica, Production, Terminal, Token } from 'src/app/models/gramatica';

@Injectable({
  providedIn: 'root'
})
export class FirstFollowGLCService {

  constructor() { }


  createFirsts = (gramatica: Gramatica): FirstMap => {
    const firstMap: FirstMap = new Map()

    console.log(JSON.stringify(gramatica.terminals))
    gramatica.terminals
      .forEach((t: Terminal) => firstMap.set(t, new Set([t])))
    console.log(JSON.stringify(firstMap.keys))
    this.createFirstOfTheNonTerminal(gramatica, firstMap)
    return firstMap
  }

  createFollows = (gramatica: Gramatica, firstMap: FirstMap): FollowMap => {
    const followMap: FollowMap = new Map()
    followMap.set(gramatica.initial, new Set(['$']))
    gramatica.productions.forEach((prod: Production) => {
      const size = prod.body.length
      if (size > 1) {
        for(let i = 0; i <= size-1; i++) {
          const firstNext = firstMap.get(prod.body[i+1])
          if (gramatica.nonTerminals.includes(prod.body[i]) && firstNext) {
            this.addtoSet(prod.body[i], followMap, [...firstNext])
          }
        }
      }
    })
    let update = true
    while (update) {
      update = false
      for(let prod of gramatica.productions) {
        const followHead = followMap.get(prod.head)
        const size = prod.body.length
        if (followHead) {
          for (let i = 0; i <= size; i++) {
            const nt = prod.body[i]
            if (gramatica.nonTerminals.includes(nt)) {
              if (+i === size || firstMap.get(prod.body[i+1])?.has(Epsilon)) {
                update ||= this.addtoSet(nt, followMap, [...followHead])
              }
            }
          }
        }
      }
    }
    return followMap
  }

  private createFirstOfTheNonTerminal = (gramatica: Gramatica, firstMap: FirstMap): void => {
    let update = true
    while (update) {
      update = false
      for (let prod of gramatica.productions) {
        if(prod.body[0] === Epsilon) {
          update ||= this.addtoSet(prod.head, firstMap, [Epsilon])
          continue;
        }
        const size = prod.body.length
        for (let i = 0; i < size; i++) {
          let firstNext = firstMap.get(prod.body[i])
          if (firstNext) {
            update ||= this.addtoSet(prod.head, firstMap, [...firstNext].filter(x => x!==Epsilon))
            if(firstNext.has(Epsilon)) {
              if (i+1 === size) {
                update ||= this.addtoSet(prod.head, firstMap, [Epsilon])
              }
            } else {
              break
            }
          }
        }
      }
    }
  }

  private addtoSet = (nonTerminal: Token, map: Map<Token,Set<Token>>, newTokens: Token[]): boolean => {
    if (newTokens === undefined || newTokens.length === 0) {
      return false
    }
    let set = map.get(nonTerminal)
    if (set) {
      const size = set.size
      set = new Set([...set, ...newTokens])
      map.set(nonTerminal, set)
      return size !== set.size
    } else {
      map.set(nonTerminal, new Set(newTokens));
      return true
    }
  }
}
