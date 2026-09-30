import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaPasswordComponent } from './modifica-password.component';

describe('ModificaPasswordComponent', () => {
  let component: ModificaPasswordComponent;
  let fixture: ComponentFixture<ModificaPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificaPasswordComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificaPasswordComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
