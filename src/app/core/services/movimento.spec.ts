import { TestBed } from '@angular/core/testing';

import { Movimento } from './movimento';

describe('Movimento', () => {
  let service: Movimento;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Movimento);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
