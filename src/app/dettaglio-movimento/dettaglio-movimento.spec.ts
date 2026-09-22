import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioMovimento } from './dettaglio-movimento';

describe('DettaglioMovimento', () => {
  let component: DettaglioMovimento;
  let fixture: ComponentFixture<DettaglioMovimento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DettaglioMovimento],
    }).compileComponents();

    fixture = TestBed.createComponent(DettaglioMovimento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
