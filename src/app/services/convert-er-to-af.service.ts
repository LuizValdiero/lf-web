import { Injectable } from '@angular/core';
import { AF, Alphabet, Production, renameAf, StateAF } from '../models/automato';
import { operatorEr, TreeNode } from '../models/er';
import { ParserErService } from './parser-er.service';

type DState = string

@Injectable({
  providedIn: 'root'
})
export class ConvertErToAfService {

  constructor(private readonly parserErService: ParserErService) { }

  public convertToAFD = (er: string): AF => {

    const [root, listT] :[root: TreeNode, listT: TreeNode[]] = this.parserErService.valueOf(er)
    this.handle(root, listT)

    if (root.props === undefined) {
      throw new Error(`root: ${JSON.stringify(root)}`)
    }


    const start = this.createDState(root.props.firstPos)
    const alphabet = this.getAlphabet(listT)
    const statesUnmarked = [start]
    const states: StateAF[] = []
    const productions: Production[] = []

    while (statesUnmarked.length > 0) {
      const state = statesUnmarked.pop()
      if (state) {
        states.push(state)
        const statesFollow = this.getStatesList(listT, state.split(''))

        alphabet.forEach((alph) => {
          let statesP: number[] = []
          statesFollow.filter((p) => p.key === alph)
            .forEach((p) => {
              if (p.props) {
                statesP =  this.joinPos(statesP, p.props.followPos)
              }
            })
          if (statesP.length > 0) {
            const newDState = this.createDState(statesP)
            if(!statesUnmarked.includes(newDState) && !states.includes(newDState)) {
              statesUnmarked.push(newDState)
            }
            productions.push(this.createProduction(state, alph, newDState))
          }
        })
      }
    }

    const final: StateAF[] = this.getFinals(states, listT.length-1)

    const afd = {
      name: er,
      states,
      alphabet,
      start,
      final,
      productions
    }

    return renameAf(afd,'q')
  }

  private createProduction = (head: DState, alphabet: Alphabet ,state: DState): Production => {
    return [[head, alphabet], [state]]
  }

  private createDState = (list: number[]): DState => {
    return list.sort().join('')
  }

  private getFinals = (states: StateAF[], accept: number): StateAF[] => {
    const finals = states.filter(s => s.split('')[s.length-1] === `${accept}`)
    return finals
  }

  private getStatesList(states: TreeNode[], positions: String[]): TreeNode[] {
    return positions.map((i) => states[+i])
  }

  private getAlphabet = (list: TreeNode[]): string[] => {
    const alphabetList: string[] = list.map((node: TreeNode) => node.key).filter((key: string) => key !== '#')
    const withoutRepeated = [...(new Set<string>(alphabetList))]
    return withoutRepeated
  }

  private handle = (n: TreeNode, list: TreeNode[]) => {
    if (n === undefined) throw new Error('to handle n === epsilon')
    if (n.key === operatorEr.alt ) {
      this.nodeAltHandle(n, list)
    } else if (n.key === operatorEr.cat) {
      this.nodeCatHandle(n, list)
    } else if (n.key === operatorEr.rep) {
      this.nodeRepHandle(n, list)
    } else {
      this.nodeAlphabetHandle(n, list)
    }
  }

  private nodeCatHandle = (n: TreeNode, list: TreeNode[]) => {
    if (n.childs && n.childs.length === 2) {
      const c1 = n.childs[0]
      const c2 = n.childs[1]
      this.handle(c1, list)
      this.handle(c2, list)
      if (c1.props && c2.props) {
        const nullable = c1.props.nullable && c2.props.nullable
        const firstPos = !c1.props.nullable ? [...c1.props.firstPos] : this.joinPos(c1.props.firstPos, c2.props.firstPos)
        const lastPos = !c2.props.nullable ? [...c2.props.lastPos] : this.joinPos(c2.props.lastPos, c1.props.lastPos)

        c1.props.lastPos.forEach((i) => {
          const nodeI = list[i]
          if (nodeI.props && c2.props) {
            nodeI.props.followPos = this.joinPos(nodeI.props.followPos, c2.props.firstPos)

          }
        })
        n.props = {
          nullable,
          firstPos,
          lastPos,
          followPos: []
        }
      } else throw new Error(`Invalid node: ${JSON.stringify(n)}`)
    } else throw new Error(`Invalid node: ${JSON.stringify(n)}`)

  }

  private nodeAltHandle = (n: TreeNode, list: TreeNode[]) => {
    if (n.childs && n.childs.length === 2) {
      const c1 = n.childs[0]
      const c2 = n.childs[1]
      this.handle(c1, list)
      this.handle(c2, list)
      if (c1.props && c2.props) {
        n.props = {
          nullable: c1.props.nullable || c2.props.nullable,
          firstPos: this.joinPos(c1.props.firstPos, c2.props.firstPos),
          lastPos: this.joinPos(c1.props.lastPos, c2.props.lastPos),
          followPos: []
        }
      } else throw new Error(`Invalid node: ${JSON.stringify(n)}`)
    } else throw new Error(`Invalid node: ${JSON.stringify(n)}`)

  }

  private nodeRepHandle = (n: TreeNode, list: TreeNode[]) => {
    if (n.childs && n.childs.length === 1) {
      const c1 = n.childs[0]
      this.handle(c1, list)
      if(c1.props) {
        n.props = {
          nullable: true,
          firstPos: [...c1.props.firstPos],
          lastPos: [...c1.props.lastPos],
          followPos: []
        }
        n.props.lastPos.forEach((i) => {
          const nodeI = list[i]
          if (nodeI.props && n.props) {
            nodeI.props.followPos = this.joinPos(nodeI.props.followPos, n.props.firstPos)
          }
        })
      } else throw new Error(`Invalid node: ${JSON.stringify(n)}`)
    } else throw new Error(`Invalid node: ${JSON.stringify(n)}`)
  }

  private nodeAlphabetHandle = (n: TreeNode, list: TreeNode[]) => {
    if (n.position !== undefined) {
      n.props = {
        nullable: false,
        firstPos: [n.position],
        lastPos: [n.position],
        followPos: []
      }
    } else { throw new Error(`Invalid node: ${JSON.stringify(n)}`) }
  }

  joinPos = (list1: number[], list2: number[]) => [...( new Set<number>([...list1, ...list2]))]

  toString = (tree: TreeNode): string => {
    let text = tree.childs?.map((k) => this.toString(k)).join(', ')
    if (text) {
      return `${tree.key}:[${text}]`
    }
    return tree.key
  }
}
