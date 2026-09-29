import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RicaricaComponent } from './ricarica.component';

describe('RicaricaComponent', () => {
  let component: RicaricaComponent;
  let fixture: ComponentFixture<RicaricaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RicaricaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RicaricaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
