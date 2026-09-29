import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonificoComponent } from './bonifico.component';

describe('BonificoComponent', () => {
  let component: BonificoComponent;
  let fixture: ComponentFixture<BonificoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonificoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BonificoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
