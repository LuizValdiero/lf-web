import { AF, Alphabet, StateAF } from './automato';
import { compute, isAFD, transformAfToDeterministic, production_to_map } from './automato';

const makeAFD = (): AF => {
  const af: AF =  {
    name: 'par_de_a',
    alphabet: ['a'],
    states: ['q0', 'q1'],
    start: 'q0',
    final: ['q0'],
    productions: [[['q0','a'],['q1']],[['q1','a'],['q0']]]
  }
  return af
}

const makeAFND1 = (): AF => {
  const afnd: AF =  {
    name: 'afnd1',
    alphabet: ['a', 'b', 'c', '&'],
    states: ['p', 'q', 'r'],
    start: 'p',
    final: ['r'],
    productions: [
      [['p','&'],['p','q']],
      [['p','b'],['q']],
      [['p','c'],['r']],
      [['p','b'],['q']],
      [['q','a'],['p']],
      [['q','b'],['r']],
      [['q','c'],['p','q']]
    ]
  }
  return afnd
}

const makeAFND1Determinized = (): AF => {
  const afd: AF = {
    name: 'afnd1',
    alphabet: ['a','b','c'],
    states: ['p,q','q,r','p,q,r','r'],
    start: 'p,q',
    final: ['p,q,r','q,r','r'],
    productions: [
      [['p,q','a'],['p,q']],
      [['p,q','b'],['q,r']],
      [['p,q','c'],['p,q,r']],
      [['p,q,r','a'],['p,q']],
      [['p,q,r','b'],['q,r']],
      [['p,q,r','c'],['p,q,r']],
      [['q,r','a'],['p,q']],
      [['q,r','b'],['r']],
      [['q,r','c'],['p,q']]
    ]}
    return afd
}

const makeAFND2 = (): AF => {
  const afnd: AF =  {
    name: 'afnd1',
    alphabet: ['0', '1'],
    states: ['p', 'q', 'r', 's'],
    start: 'p',
    final: ['q','s'],
    productions: [
      [['p','0'],['q','s']],
      [['p','1'],['q']],
      [['q','0'],['r']],
      [['q','1'],['q','r']],
      [['r','0'],['s']],
      [['r','1'],['p']],
      [['s','1'],['p']]
    ]
  }
  return afnd
}

describe('Automato', () => {
  it('should create an instance', () => {
    const af: AF = makeAFD()
    const map = new Map<[StateAF,Alphabet], StateAF[]>(af.productions)
    //console.log(JSON.stringify(af))
    expect(af).toBeTruthy();
    expect(af.name).toEqual('par_de_a')
    expect(af.alphabet).toEqual(['a'])
    expect(af.start).toEqual('q0')
    expect(af.final).toEqual(['q0'])
    expect(af.states).toEqual(['q0', 'q1'])
    expect(af.productions[0][1]).toEqual(['q1'])
    expect(af.productions[1][1]).toEqual(['q0'])
    expect(map.size).toBe(2)
  });

  it('isAFD should return true if AF is deterministic', () => {
    const afd: AF = makeAFD()
    expect(isAFD(afd)).toBe(true)
  })
  it('isAFD should return false if AF is not deterministic (without &)', () => {
    const afnd: AF = makeAFND1()
    expect(isAFD(afnd)).toBe(false)
  })

  it('isAFD should return false if AF is not deterministic (with &)', () => {
    const afnd: AF = makeAFND2()
    expect(isAFD(afnd)).toBe(false)
  })

  it('compute should return true if AF computes the input word', () => {
    const afd: AF = makeAFD()
    for(const word of ['', 'aa', 'aaaa']) {
      expect(compute(afd, word)).toBeTrue()
    }
  })

  it('compute should return false if AF not computes the input word', () => {
    const afd: AF = makeAFD()
    for(const word of ['a', 'aaa', 'aaaaa']) {
      expect(compute(afd, word)).toBeFalse()
    }
  })

  it('compute should return true if AFND computes the input word', () => {
    const afnd: AF = makeAFND1()
    for(const word of ['bb']) {
      expect(compute(afnd, word)).toBeTrue()
    }
  })

  it('compute should return false if AFND not computes the input word', () => {
    const afnd: AF = makeAFND1()
    for(const word of ['a', 'b']) {
      expect(compute(afnd, word)).toBeFalse()
    }
  })

  it('create_epsilon_fecho should create &-fecho correctly', () => {
    const afnd: AF = makeAFND1()
    const prodMap = production_to_map(afnd.productions)
    const afd = transformAfToDeterministic(afnd, prodMap)

    const expected: AF = makeAFND1Determinized()
    expect(afd.name).toEqual(expected.name)
    expect(afd.alphabet).toEqual(expected.alphabet)
    expect(afd.states).toEqual(expected.states)
    expect(afd.start).toEqual(expected.start)
    expect(afd.final).toEqual(expected.final)
    expect(afd.productions).toEqual(expected.productions)
  })

});
