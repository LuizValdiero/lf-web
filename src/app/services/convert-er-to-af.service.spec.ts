import { TestBed } from '@angular/core/testing';

import { ConvertErToAfService } from './convert-er-to-af.service';

describe('ConvertErToAfService', () => {
  let service: ConvertErToAfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConvertErToAfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
