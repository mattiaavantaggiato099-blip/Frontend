import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RicercaMovimenti } from './ricerca-movimenti';

describe('RicercaMovimenti', () => {
  let component: RicercaMovimenti;
  let fixture: ComponentFixture<RicercaMovimenti>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RicercaMovimenti],
    }).compileComponents();

    fixture = TestBed.createComponent(RicercaMovimenti);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
