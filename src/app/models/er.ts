
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
