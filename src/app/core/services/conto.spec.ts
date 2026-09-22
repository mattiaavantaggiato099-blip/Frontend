import { TestBed } from '@angular/core/testing';

import { Conto } from './conto';

describe('Conto', () => {
  let service: Conto;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Conto);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
