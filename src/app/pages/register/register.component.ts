import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  protected fb = inject(FormBuilder);
  protected authSrv = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  registerForm = this.fb.group({
    email: ['', { validators: [Validators.required] }],
    password: ['', { validators: [Validators.required] }],
    confermaPassword: ['', { validators: [Validators.required]}],
    nome: ['', { validators: [Validators.required]}],
    cognome: ['', { validators: [Validators.required]}]
  });

  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.registerForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.errorMessage.set(null))
  }

  register() {
    console.log('Valido?', this.registerForm.valid);
  console.log('Valori', this.registerForm.getRawValue());

    this.errorMessage.set(null);

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { password, confermaPassword } = this.registerForm.getRawValue();
    if (password !== confermaPassword) {
      this.errorMessage.set('Le password non coincidono');
      return;
    }

    const { email, nome, cognome } = this.registerForm.getRawValue();

    this.authSrv
      .register(email!, password!, nome!, cognome!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['/login'], {
            queryParams: { registered: '1' },
            relativeTo: this.activatedRoute
          });
        },
        error: err => {
          const msg =
            err?.error?.message ||
            err?.message ||
            'Errore nella registrazione';
          this.errorMessage.set(msg);
        }
      });
  }
}
