import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bonifico } from './bonifico';

describe('Bonifico', () => {
  let component: Bonifico;
  let fixture: ComponentFixture<Bonifico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bonifico],
    }).compileComponents();

    fixture = TestBed.createComponent(Bonifico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
