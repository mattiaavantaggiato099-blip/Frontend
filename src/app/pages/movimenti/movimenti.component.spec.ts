import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaMovimentiComponent } from './movimenti.component';

describe('MovimentiComponent', () => {
  let component: ListaMovimentiComponent;
  let fixture: ComponentFixture<ListaMovimentiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaMovimentiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaMovimentiComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
