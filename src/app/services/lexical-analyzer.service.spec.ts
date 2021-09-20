import { TestBed } from '@angular/core/testing';

import { LexicalAnalyzerService } from './lexical-analyzer.service';

describe('LexicalAnalyzerService', () => {
  let service: LexicalAnalyzerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LexicalAnalyzerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
