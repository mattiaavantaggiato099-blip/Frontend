import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { HttpClient } from "@angular/common/http";

interface DepositoResponse {
  message: string;
  movimento: {
    MovimentoID: string;
    Importo: number;
    Saldo: number;
    Data: string;
  };
}

@Component({
  selector: "app-deposito",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./deposito.component.html",
  styleUrl: "./deposito.component.css",
})
export class DepositoComponent implements OnInit {
  private readonly http = inject(HttpClient);

  // deve coincidere con @Max del DepositoDto nel backend
  readonly importoMax = 10000;

  depositoForm = new FormGroup({
    importo: new FormControl<number | null>(null, {
      validators: [
        Validators.required,
        Validators.min(0.01),
        Validators.max(this.importoMax),
      ],
    }),
    descrizione: new FormControl("", {
      nonNullable: true,
      validators: [Validators.maxLength(200)],
    }),
  });

  saldo = signal<number | null>(null);
  messaggioEsito = signal("");
  erroreEsito = signal("");
  inCorso = signal(false);

  get importo(): number {
    return this.depositoForm.controls.importo.value ?? 0;
  }

  get saldoDopoDeposito(): number | null {
    const saldoAttuale = this.saldo();
    return saldoAttuale === null ? null : saldoAttuale + this.importo;
  }

  ngOnInit(): void {
    this.caricaSaldo();
  }

  caricaSaldo(): void {
    this.http
      .get<{ movimenti: unknown[]; saldo?: number }>("/api/movimenti", {
        params: { n: 1 },
      })
      .subscribe({
        next: (res) => this.saldo.set(res.saldo ?? 0),
        error: (err) => console.error("Errore caricamento saldo:", err),
      });
  }

  inviaDeposito(): void {
    this.messaggioEsito.set("");
    this.erroreEsito.set("");

    if (this.depositoForm.invalid) {
      this.depositoForm.markAllAsTouched();
      this.erroreEsito.set("Inserisci un importo valido");
      return;
    }

    const { importo, descrizione } = this.depositoForm.getRawValue();
    this.inCorso.set(true);

    this.http
      .post<DepositoResponse>("/api/operazioni/deposito", {
        importo,
        descrizione: descrizione.trim() || undefined,
      })
      .subscribe({
        next: (res) => {
          this.messaggioEsito.set("Deposito eseguito con successo");
          this.saldo.set(res.movimento.Saldo); // il saldo aggiornato è già nella risposta
          this.depositoForm.reset({ importo: null, descrizione: "" });
          this.inCorso.set(false);
        },
        error: (err) => {
          this.erroreEsito.set(
            err.error?.message ?? "Impossibile collegarsi al backend"
          );
          this.inCorso.set(false);
        },
      });
  }
}