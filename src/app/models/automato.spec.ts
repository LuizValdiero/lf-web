import { AF, Alphabet, StateAF } from './automato';
import { compute, isAFD, transformAfToDeterministic, productionToMap } from './automato';

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
    states: ['p_q','q_r','p_q_r','r'],
    start: 'p_q',
    final: ['p_q_r','q_r','r'],
    productions: [
      [['p_q','a'],['p_q']],
      [['p_q','b'],['q_r']],
      [['p_q','c'],['p_q_r']],
      [['p_q_r','a'],['p_q']],
      [['p_q_r','b'],['q_r']],
      [['p_q_r','c'],['p_q_r']],
      [['q_r','a'],['p_q']],
      [['q_r','b'],['r']],
      [['q_r','c'],['p_q']]
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
    const prodMap = productionToMap(afnd.productions)
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
