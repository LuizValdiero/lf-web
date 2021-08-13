export type StateAF = string
export type Alphabet = string
export type Production = [[StateAF, Alphabet], StateAF[]]
export type ProductionMap = Map<StateAF,Map<Alphabet,StateAF[]>>
export type ProductionEpsilonFechoMap = Map<StateAF[],Map<Alphabet,StateAF[]>>

export const Epsilon = '&'

export type AF = {
    name: string,
    alphabet: Alphabet[],
    states: StateAF[],
    start: StateAF,
    final: StateAF[],
    productions: Production[]
}

export const productionToMap = (productions: Production[]): ProductionMap => {
  const map: ProductionMap = new Map()
  let mapAux = new Map<[StateAF, Alphabet],StateAF[]>(productions)
  for (let entry of mapAux.entries()) {
    const [[state, alphabet], v] = entry
    if (map.get(state)) {
      map.get(state)?.set(alphabet,v)
    } else {
      map.set(state, new Map([[alphabet, v]]))
    }
  }
  return map;
}

export const isAFD = (af: AF): boolean => {
  let ok: boolean = !(af.alphabet.find( alph => alph == Epsilon))
  let map = new Map<[StateAF, Alphabet],StateAF[]>(af.productions)
  for (let entry of map.entries()) {
    const [_, v] = entry
    if(v.length !== 1) {
      ok = false
      break
    }
  }
  return ok
}

export const compute = (af: AF, input: string): boolean => {
  const productions: ProductionMap = productionToMap(af.productions)
  if(!isAFD(af)) {
    return computeWord(productions, af.start, af.final, input)
  } else {
    const afd: AF = transformAfToDeterministic(af, productions)
    return computeWord(productionToMap(afd.productions), afd.start, afd.final, input)
  }
}

const computeWord = ( productions: ProductionMap, state: StateAF, final: StateAF[], input: string): boolean => {
  if (input.length==0) {
    return final.includes(state)
  }
  const next = input[0], rest = input.substring(1)
  const states = productions.get(state)?.get(next)
  if (states) {
    for (let nextState of states) {
      if (computeWord(productions, nextState, final, rest)) {
        return true
      }
    }
  }
  return false
}

export const determineAf = (af: AF): AF => {
  if(isAFD(af)) {
    return af
  }
  const prodMap = productionToMap(af.productions)
  const afd = transformAfToDeterministic(af, prodMap)
  return afd
}

export const transformAfToDeterministic = (af: AF, productions: ProductionMap): AF => {

  const eFechoStates: Map<StateAF, StateAF[]> = createEpsilonFechoMap(af, productions)

  const new_states: Set<StateAF> = new Set()
  const unvisited_states: StateAF[][] = []
  unvisited_states.push(getValue<StateAF[]>(eFechoStates, af.start))
  new_states.add(getValue<StateAF[]>(eFechoStates, af.start).join('_'))

  const start: StateAF = getValue<StateAF[]>(eFechoStates, af.start).join('_')
  const final: StateAF[] = []
  const new_alphabet: Alphabet[] = af.alphabet.filter((x: String): boolean => x != '&')
  const new_productions: Production[] = []

  while (unvisited_states.length > 0) {
    const state: StateAF[] | undefined = unvisited_states.pop()
    if(state) {
      const new_state = state.sort().join('_')
      if(hasFinalState(af, state)) {
        final.push(new_state)
      }
      for (let alphabet of new_alphabet) {
        const new_target: StateAF[] = createNewProductionToDeterminization(state, alphabet, eFechoStates, productions)
        if (new_target.length > 0) {
          const new_t_str = new_target.join('_')
          new_productions.push([[new_state, alphabet],[new_t_str]])
          if (!new_states.has(new_t_str)) {
            unvisited_states.push(new_target)
            new_states.add(new_t_str)
          }
        }
      }
    }
  }
  return { name: af.name, alphabet: new_alphabet, states: [ ...new_states], start, final, productions: new_productions}
}

const hasFinalState = (af: AF, states: StateAF[]): boolean => {
  const statesSet = new Set(states)
  for (let state of af.final) {
    if(statesSet.has(state)) {
      return true
    }
  }
  return false
}

const getValue = <T>(map: Map<string, T>, key: string): T => {
  const value: any = map.get(key)
  if (value) {
    return value
  }
  throw new Error("key undefined")
}

const createEpsilonFechoMap = (af: AF, productions: ProductionMap): Map<StateAF, StateAF[]> => {
  const eFechoStates: Map<StateAF, StateAF[]> = new Map()
  for (let state of af.states) {
    const states = createEpsilonFechoNewState(state, productions)
    eFechoStates.set(state, states)
  }
  return eFechoStates
}

const createEpsilonFechoNewState = (state: StateAF, productions: ProductionMap): StateAF[] => {
  let states = productions.get(state)?.get(Epsilon)
  if (states) {
    states.push(state)
    states = [ ...new Set(states)]
    states.sort()
  } else {
    states = [state]
  }
  return states
}

const createNewProductionToDeterminization = (state: StateAF[], alphabet: Alphabet, eFechoStates: Map<StateAF, StateAF[]>, productions: ProductionMap): StateAF[] => {
  const new_target: Set<StateAF> = new Set()
  for (let st of state) {
    const targets = productions.get(st)?.get(alphabet)
    if (targets) {
      for (let target of targets) {
        for (let t_epsilon_fecho of getValue(eFechoStates, target)) {
          new_target.add(t_epsilon_fecho)
        }
      }
    }
  }
  return [ ...new_target].sort()
}

export const renameAf = (af: AF, prefix: string): AF => {
  let i = 0;
  const statesMap: Map<StateAF,StateAF> = new Map()

  af.states.forEach(state => {
    const newName = prefix.concat(i.toString())
    i++
    statesMap.set(state, newName)
  })
  const states: StateAF[] = af.states.map(state => renameState(state, statesMap))
  const initialState: StateAF = statesMap.get(af.start) || ''
  const finalStates: StateAF[] = af.final.map(state => statesMap.get(state) || '')
  const prods: Production[] = af.productions.map(
    ([[head,alph],targets]) => [[renameState(head, statesMap), alph], targets.map(state => renameState(state, statesMap))]
  )
  return {
    name: af.name,
    states,
    alphabet: af.alphabet,
    start: initialState,
    final: finalStates,
    productions: prods
  }
}

const renameState = (state: StateAF, statesMap: Map<StateAF,StateAF>) => statesMap.get(state) || ''

export const joinAf = (af1: AF, af2: AF): AF => {
  const af1Renamed = renameAf(af1, '0q')
  const af2Renamed = renameAf(af2, '1q')

  const alphabet = [
    ...(new Set([...af1Renamed.alphabet, ...af2Renamed.alphabet,  '&']))
  ]

  const initialState: StateAF = 'q0'
  const finalStates: StateAF[] = ['f']
  const states: StateAF[] = [initialState, ...finalStates, ...af1Renamed.states, ...af2Renamed.states]

  let productions: Production[] = [
    [[initialState, '&'],[af1Renamed.start]],
    [[initialState, '&'],[af2Renamed.start]],
    ...af1Renamed.productions, ...af2Renamed.productions,
    ...(af1Renamed.final.map<Production>(state => [[state,'&'],[...finalStates]])),
    ...(af2Renamed.final.map<Production>(state => [[state,'&'],finalStates]))
  ]

  return {
    name: `${af1Renamed.name}_${af2Renamed.name}`,
    alphabet,
    states,
    start: initialState,
    final: finalStates,
    productions
  }
}
