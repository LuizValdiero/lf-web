import { Injectable } from '@angular/core';
import { Epsilon } from 'src/app/models/automato';
import { Action, ActionType, END, extendGLC, FirstMap, FollowMap, GoTo, Gramatica, ItemLR, ItemLRSet, LR1, LR1Table, Production, START, Terminal, Token, wasEqualsItemLR } from 'src/app/models/gramatica';

@Injectable({
  providedIn: 'root'
})
export class LR1GeneratorService {

  constructor() { }

  createTableLR1 = (gramatica: Gramatica, first: FirstMap, follow: FollowMap): LR1Table => {
    const glc: Gramatica = extendGLC(gramatica)
    const lr1: LR1 = {
      glc,
      countItemsI: 0,
      first,
      follow,
      items: []
    }

    const c =  this.createItemsGLCExtended(lr1)
    const goto: Map<number, GoTo> = new Map()
    const action: Map<number, Action> = new Map()
    try {
      c.forEach(itemI => {
        const itemIAction: Map<Token, {action: string, i: number}> = new Map()
        itemI.items.forEach(item => {
          if(item.position === item.production.body.length) {
            if(item.production.head !== START) { // b
              this.updateAction(item.lookAHead, itemIAction,
                  {action: ActionType.R, i:glc.productions.indexOf(item.production)})
            } else if (item.lookAHead === END) { // c
              this.updateAction(item.lookAHead, itemIAction,
                {action: ActionType.ACCEPT, i:0})
            }
          } else {
            const symbol = item.production.body[item.position]
            const targetGoto = itemI.goto.get(symbol)
            if((glc.terminals.includes(symbol) || symbol === '$') && targetGoto) { // a
              this.updateAction(symbol, itemIAction, {action: ActionType.S, i: targetGoto})
            }
          }
          action.set(itemI.i, itemIAction)

          const itemIGoto: GoTo = new Map()
          itemI.goto.forEach((value, key) => {
            if(glc.nonTerminals.includes(key)) {
              itemIGoto.set(key, value)
            }
          })
          goto.set(itemI.i, itemIGoto)
        })
      })

    } catch(e) {
      console.error(e)
    }
    return { lr1, c: c,goto, action}
  }

  createItemsGLCExtended = (lr1: LR1): ItemLRSet[] => {
    const prodBegin = lr1.glc.productions.filter((p: Production) => p.head === lr1.glc.initial)[0]

    const itemBegin: ItemLRSet = {
      i: lr1.countItemsI,
      items: [
        {collectionI: lr1.countItemsI, production: prodBegin, position:0, lookAHead: END}
      ],
      goto: new Map()
    }
    this.lr1AddItems(lr1, itemBegin)

    const c: ItemLRSet[] = [
      this.closure(itemBegin, lr1)
    ]
    let update = true
    while(update) {
      update = false
      c.forEach((itemISet: ItemLRSet) => {
        const xCalculated = [...itemISet.goto.keys()]
        const xSet = new Set(
          itemISet.items.filter(item => item.position !== item.production.body.length)
            .map(item => item.production.body[item.position]).filter(x => !xCalculated.includes(x))
        )
        xSet.forEach((x: string) => {
          const newItemI = this.calculateGoto(itemISet, x, lr1)
          const alreadyExists = this.getItemISetIfExists(c, newItemI)
          if (alreadyExists) {
            itemISet.goto.set(x, alreadyExists.i)

          } else {
            this.lr1AddItems(lr1, newItemI)
            itemISet.goto.set(x, newItemI.i)
            c.push(newItemI)
            update = true
          }
        })
      })

    }
    return c
  }

  private getItemISetIfExists = (c: ItemLRSet[], newItemISet: ItemLRSet): ItemLRSet | undefined => {
    const numItems = newItemISet.items.length
    for(let itemI of c) {
      if (itemI.items.length !== numItems) {
        continue
      }
      let exist = true
      for(let newItem of newItemISet.items) {
        if(itemI.items.filter(it => wasEqualsItemLR(it, newItem)).length === 0) {
          exist = false
          break
        }
      }
      if(exist) {
        return itemI
      }
    }
    return undefined
  }

  private lr1AddItems = (lr1: LR1, newItemISet: ItemLRSet): void => {
    lr1.countItemsI++
    lr1.items.push(...newItemISet.items)
  }

  private closure = (itemsI: ItemLRSet, lr1: LR1): ItemLRSet => {
    const glc: Gramatica = lr1.glc, firstMap: FirstMap = lr1.first
    const iii = [...itemsI.items]
    while (iii.length > 0) {
      const item = iii.pop()
      if (item === undefined) continue

      if (item.production.body.length > item.position) {
        const nonTerminal = item.production.body[item.position]
        if (glc.nonTerminals.includes(nonTerminal)) {
          const lookAHead = this.calculateLookAHead(item, firstMap)
          const prods = glc.productions.filter((p: Production) => p.head === nonTerminal)
          prods.forEach((p: Production) => {
            lookAHead.forEach(lookAHd => {
              const newItem: ItemLR = {
                collectionI: itemsI.i,
                production: p,
                position: 0,
                lookAHead: lookAHd
              }
              if(itemsI.items.filter((i) => wasEqualsItemLR(i, newItem)).length === 0) {
                itemsI.items.push(newItem)
                iii.push(newItem)
              }
            })
          })
        }
      }
    }
    return itemsI
  }

  private calculateGoto = (itemsI: ItemLRSet, x: Token, lr1: LR1): ItemLRSet => {
    const items: ItemLR[] = itemsI.items.filter(i => {
        if(i.position === i.production.body.length) {
          return false
        }
        return i.production.body[i.position] === x
      }).map(i => ({...i, position: i.position+1}))

    const newItemsI: ItemLRSet = {
      i: lr1.countItemsI,
      goto: new Map(),
      items
    }
    return this.closure(newItemsI, lr1)
  }


  private calculateLookAHead = (item: ItemLR, firstMap: FirstMap): Terminal[] => {
    let lookAHead = [item.lookAHead]
    if (item.position+1 < item.production.body.length) {
      const first = firstMap.get(item.production.body[item.position])
      if(first) {
        if(first?.has(Epsilon)) {
          first.add(item.lookAHead)
        }
        lookAHead = [...first]
      }
    }
    return lookAHead
  }

  private updateAction = (symbol: string, actions: Action, newAction: {action: string, i: number}): void => {
    const oldAction = actions.get(symbol)
    if (oldAction && (oldAction.action !== newAction.action || oldAction.i !== newAction.i)) {
      throw new Error('GLC is not LR(1)')
    } else {
      actions.set(symbol, newAction)
    }
  }

}
