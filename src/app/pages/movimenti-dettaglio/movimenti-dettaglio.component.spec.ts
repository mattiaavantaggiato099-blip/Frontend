import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimentiDettaglioComponent } from './movimenti-dettaglio.component';

describe('MovimentiDettaglioComponent', () => {
  let component: MovimentiDettaglioComponent;
  let fixture: ComponentFixture<MovimentiDettaglioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimentiDettaglioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MovimentiDettaglioComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
