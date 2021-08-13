import { TestBed } from '@angular/core/testing';
import { AF } from '../models/automato';

import { AfParserService } from './af-parser.service';


const afdStr: string =
  'AsMultiploDe2'
  + '\n' + '2'
  + '\n' + 'q0'
  + '\n' + 'q0'
  + '\n' + 'a'
  + '\n' + 'q0,a,q1'
  + '\n' + 'q1,a,q0'

const afd: AF = {
  name: 'AsMultiploDe2',
  alphabet: ['a'],
  states: ['q0','q1'],
  start: 'q0',
  final: ['q0'],
  productions: [
      [['q0','a'],['q1']],
      [['q1', 'a'],['q0']]
  ]
}



describe('AfParserService', () => {
  let service: AfParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AfParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should parse afd from text', () => {
    const af = service.parse(afdStr)
    expect(af).toBeTruthy();
    const afStr = service.valueOf(af)
    expect(afStr).toBeTruthy();
  });
});
