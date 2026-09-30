import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ricarica',
  imports: [ReactiveFormsModule],
  templateUrl: './ricarica.component.html',
  styleUrl: './ricarica.component.css',
})
export class RicaricaComponent {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  ricaricaForm: FormGroup;

  messaggioEsito = '';
  erroreEsito = '';

  constructor() {
    this.ricaricaForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d[\d\s]{6,}$/)]],
      operator: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(5)]]
    });
  }

  inviaRicarica() {
    this.messaggioEsito = '';
    this.erroreEsito = '';

    if (this.ricaricaForm.invalid) {
      this.ricaricaForm.markAllAsTouched();
      return;
    }

    const { phone, operator, amount } = this.ricaricaForm.value;

    const body = {
      numeroTelefonico: phone.replace(/\s+/g, ''),
      operatore: operator,
      taglio: Number(amount)
    };

    this.http.post('/api/operazioni/ricarica', body).subscribe({
      next: () => {
        this.messaggioEsito = 'Ricarica eseguita con successo';
        this.ricaricaForm.reset();
      },
      error: (err) => {
        this.erroreEsito = err.error?.message || 'Impossibile collegarsi al backend';
      }
    });
  }
}