import { TestBed } from '@angular/core/testing';

import { ParserErService } from './parser-er.service';

describe('ParserErService', () => {
  let service: ParserErService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParserErService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
