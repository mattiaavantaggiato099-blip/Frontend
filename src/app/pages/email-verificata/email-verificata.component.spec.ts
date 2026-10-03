import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVerificataComponent } from './email-verificata.component';

describe('EmailVerificataComponent', () => {
  let component: EmailVerificataComponent;
  let fixture: ComponentFixture<EmailVerificataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailVerificataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailVerificataComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
