import { AF, StateAF } from "./automato"

export type LA = {
  definitions: TokenDefinition[],
  map: Map<StateAF,number[]>,
  af: AF
}

export type TokenDefinition = {
  id: string
  expression: string
}

export const validTokenDefinition = (tokenDefinition: TokenDefinition): void => {
  if (!('id' in tokenDefinition && typeof tokenDefinition.id ===  'string')) {
    throw new Error(`Invalid definition (id): ${JSON.stringify(tokenDefinition)}`)
  }
  if (!('expression' in tokenDefinition && typeof tokenDefinition.expression ===  'string')) {
    throw new Error(`Invalid definition (expression): ${JSON.stringify(tokenDefinition)}`)
  }
}

export type TokenAF = {
  definition: TokenDefinition
  af: AF
}

export type TreeNode = {
  key: string
  position?: number
  childs?: TreeNode[]

  props?: TreeNodeProps
}

export type TreeNodeProps = {
  nullable: boolean
  firstPos: number[]
  lastPos: number[]
  followPos: number[]
}

export const operatorEr = {
  cat: '.',
  alt: '|',
  rep: '*'
}
