import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  protected fb = inject(FormBuilder);
  protected authSrv = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  showPassword = false;
  showPasswordConferma = false;

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

  const { password, confermaPassword } =
    this.registerForm.getRawValue();

  if (password !== confermaPassword) {
    this.errorMessage.set('Le password non coincidono');
    return;
  }

  const { email, nome, cognome } =
    this.registerForm.getRawValue();

  this.authSrv
    .register(email!, password!, nome!, cognome!)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => {
        this.router.navigate(['/verifica-email'], {
          queryParams: { registered: '1' },
          relativeTo: this.activatedRoute,
        });
      },

      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(
          this.getErrorMessage(err)
        );
      },
    });
}

private getErrorMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'Impossibile contattare il server. Riprova più tardi.';
  }

  const rawMessage = this.extractErrorMessage(error);

  if (rawMessage) {
    return this.formatBackendMessage(rawMessage);
  }

  switch (error.status) {
    case 400:
      return 'I dati inseriti non sono validi.';

    case 409:
      return 'Questa email è già associata a un account.';

    case 422:
      return 'Controlla i dati inseriti e riprova.';

    case 500:
      return 'Si è verificato un errore durante la registrazione.';

    default:
      return 'Errore durante la registrazione. Riprova più tardi.';
  }
}

private extractErrorMessage(error: HttpErrorResponse): string | null {
  if (typeof error.error === 'object' && error.error?.message) {
    return error.error.message;
  }

  if (typeof error.error !== 'string') {
    return null;
  }

  const html = error.error;

  // Cerca il testo contenuto nel tag <pre>
  const preMatch = html.match(/<pre>([\s\S]*?)<\/pre>/i);

  if (!preMatch) {
    return null;
  }

  const text = preMatch[1]
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&')
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .trim();

  // Prende solo la prima riga significativa, ignorando lo stack trace
  return text.split('\n')[0].trim() || null;
}

private formatBackendMessage(message: string): string {
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes('email') &&
    (
      normalizedMessage.includes('already') ||
      normalizedMessage.includes('exist') ||
      normalizedMessage.includes('esiste') ||
      normalizedMessage.includes('duplicate')
    )
  ) {
    return 'Questa email è già associata a un account.';
  }

  if (
    normalizedMessage.includes('password') &&
    normalizedMessage.includes('weak')
  ) {
    return 'La password non è abbastanza sicura.';
  }

  return message;
}
}
