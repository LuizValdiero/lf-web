import { Injectable } from '@angular/core';
import { operatorEr, TreeNode } from '../models/er';

type TreeControl<T=string> = { i: number , list: T[]}

@Injectable({
  providedIn: 'root'
})
export class ParserErService {

  special: string[] = ['*', '|', '(', ')', '.', '?']

  constructor() { }

  valueOf = (er: string): [TreeNode, TreeNode[]] => {
    const expression = this.removeEmptySpaces(er)

    const list = expression.split('');
    if(list.length === 0 || list[list.length-1] !== '#') {
      list.push('#')
    }
    this.validEr(list)

    const numerator: TreeControl<TreeNode> = { i: 0, list: []}
    const control: TreeControl = { i: 0, list };

    const root = this.next(control, this.start(control, numerator), numerator)
    return [root, numerator.list]
  }

  next = (control: TreeControl, root: TreeNode, numerator: TreeControl<TreeNode>): TreeNode => {
    if (control.list.length <= control.i) {
      return root
    }
    const key = control.list[control.i++]
    if (key === '(') {
      const subNode = this.subEr(control, numerator)
      const last = { key:'.', childs: [root, subNode]}
      return this.next(control, last, numerator)

    } else if (key === ')') {
      throw new Error(`Parentheses \')\' unexpected in expression: ${control.list.join('')}`)

    } else if (key === operatorEr.alt) {
      const right = this.next(control, this.start(control, numerator), numerator)
      return { key, childs:[root, right]}

    } else if (key === operatorEr.rep) {
      const last = { key, childs:[root]}
      return this.next(control, last, numerator)

    } else if (key === operatorEr.cat) {
      return this.next(control, root, numerator)

    } else {
      const last = { key:'.', childs: [root, this.createLeaf(key, numerator)]}
      return this.next(control, last, numerator)
    }
  }

  createLeaf = (key: string, numerator: TreeControl<TreeNode>): TreeNode => {
    const leaf: TreeNode = { key, position: numerator.list.length }
    numerator.list.push(leaf)
    return leaf
  }

  subEr = (control: TreeControl, numerator: TreeControl<TreeNode>): TreeNode => {
    if(control.list[control.i-1] !== '(') {
      throw new Error(`subEr start with ${control.list[control.i]}`)
    }
    const { begin, end } = this.calcIntervalOfSubEr(control)
    const newControl = { i:0, list: control.list.slice(begin, end)}
    const subNode = this.next(newControl, this.start(newControl, numerator), numerator)
    control.i = end+1
    return subNode
  }

  calcIntervalOfSubEr = (control: TreeControl): { begin: number, end: number } => {
    let hasEnd = false, open = 1, close = 0
    let i = control.i

    for(i; i < control.list.length; i++) {
      const key = control.list[i]
      if (key === '(') {
        open++
      } else if (key === ')') {
        close++
        if (open === close) {
          hasEnd = true
          break
        }
        if (open < close) throw new Error('Invalid order of parentheses')
      }
    }

    if(!hasEnd) throw new Error(`calcIntervalOfSubEr \nbegin: ${control.i}, end: ${i},
      parent size: ${control.list.length}, '(': ${open}, ')': ${close}`)
    if(control.i === i) throw new Error(`Empty parentheses`)

    return { begin:control.i, end:i }
  }

  start = (control: TreeControl, numerator: TreeControl<TreeNode>): TreeNode => {
    this.validEr(control.list)
    const key = control.list[control.i++]
    if (key === '(') {
      return this.subEr(control, numerator)
    }
    if(this.special.includes(key)) {
      throw new Error()
    } else {
      return this.createLeaf(key, numerator)
    }
  }

  validEr = (expression: string[]) => {
    this.validNumberOfParentheses(expression)
    this.validfirstKey(expression, undefined)
    this.validCat(expression)
  }

  validNumberOfParentheses = (expression: string[]) => {
    let open = 0, close = 0
    expression.forEach((key) => {
      if (key === '(') {
        open++
      } else if (key === ')') {
        close++
      }
    })
    if(open !== close ) {
      throw new Error(`Invalid parentheses, '(': ${open}, ')': ${close}`)
    }
  }

  validfirstKey = (expression: string[], parent?: TreeNode): void => {
    const key = expression[0]
    if (['*', '.', '|', ')','?'].includes(key) && parent === undefined) {
      throw new Error(`first key: ${key} in expression: ${expression.join('')}`)
    }
  }

  validCat = (expression: string[]): void => {
    const result = expression.join('').includes(('\.\.'))
    if (result) {
      throw new Error(`cat symbol: ${result} in expression: ${expression.join('')}`)
    }
  }

  removeEmptySpaces = (input: string): string => {
    return input.replace(/\s/g, '')
  }
}
