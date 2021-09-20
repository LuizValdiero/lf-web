import { JsonPipe } from "@angular/common"

export type NonTerminal = string
export type Terminal = string
export type Token = Terminal | NonTerminal

export type Production = {
  head: NonTerminal,
  body: Token[]
}

export const END = '$'
export const START = "S'"

export const enum ActionType {
  S = 'S', R = 'R', ACCEPT = 'acc'
}

export type Gramatica = {

  nonTerminals: NonTerminal[]
  terminals: Terminal[]

  initial: NonTerminal
  productions: Production[]
}

export type ItemLR = {
  collectionI: number
  production: Production
  position: number
  lookAHead: Terminal
}

export type GoTo = Map<string, number>
export type Action = Map<Token, {action: string, i: number}>

export type ItemLRSet = {
  i: number
  items: ItemLR[]
  goto: GoTo
}

export type FirstMap = Map<Token, Set<Terminal>>
export type FollowMap = Map<Token, Set<Terminal>>

export type LR1 = {
  glc: Gramatica,
  countItemsI: number
  first: FirstMap,
  follow: FollowMap,
  items: ItemLR[]
}

export type LR1Table = {
  lr1: LR1,
  c: ItemLRSet[],
  goto: Map<number,GoTo>,
  action: Map<number,Action>
}

export const extendGLC = (gramatica: Gramatica): Gramatica => {
  if (gramatica.nonTerminals.includes(START)) {
    return gramatica
  }
  const initial: NonTerminal = START
  const nonTerminals: NonTerminal[] = [...gramatica.nonTerminals, initial]
  const terminals: Terminal[] = [...gramatica.terminals]
  const productions: Production[] = [
    {head: initial, body: [gramatica.initial]},
    ...gramatica.productions
  ]
  return {
    initial,
    nonTerminals,
    terminals,
    productions
  }
}

export const wasEqualsItemLR = (item1: ItemLR, item2: ItemLR): boolean => {
  return item1.production === item2.production
    && item1.position === item2.position
    && item1.lookAHead === item2.lookAHead
}

export const analize = (lr1Table: LR1Table, code: string[]): string => {
  const actionMap = lr1Table.action, gotoMap = lr1Table.goto, prodList = lr1Table.lr1.glc.productions
  const queue: any[] = [0]
  const w = [...code, END]
  let w1 = 0

  let accept = false
  const log: string[] = []
  console.log('ok ' + JSON.stringify(w) +' '+ w1)
  while (!accept) {
    const q = queue[queue.length-1]
    const t = w[w1]
    const step = `pilha: ${q}, entrada: ${[...w].splice(w1)}, acao: `
    const action = actionMap.get(q)?.get(t)
    if (action) {
      if(action.action === ActionType.ACCEPT) {
        log.push(step + action.action)
        accept = true
        break;
      }
      if(action.action === ActionType.S) {
        queue.push(w[w1++])
        queue.push(action.i)
        log.push(step + action.action+ action.i)
        continue
      }
      if(action.action === ActionType.R) {
        const body = [...prodList[action.i].body]
        while (body.length > 0) {
          queue.pop()
          body.pop()
        }
        const goto = gotoMap.get(q)?.get(t)
        if (goto) {
          queue.push(goto)
          continue
        }
      }
    }
    throw new Error(`${w[w1]}: token ${w1}`)
  }
  return log.join('\n')
}
