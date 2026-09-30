import {
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";

import { CommonModule } from "@angular/common";

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { HttpClient } from "@angular/common/http";

interface BonificoFormValue {
  iban: string;
  importo: number | null;
  descrizione: string;
}

@Component({
  selector: "app-bonifico",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./bonifico.component.html",
  styleUrl: "./bonifico.component.css",
})
export class BonificoComponent implements OnInit {
  private readonly http = inject(HttpClient);

  bonificoForm = new FormGroup({
    iban: new FormControl("", {
      nonNullable: true,
      validators: [
        Validators.required,
      ],
    }),

    importo: new FormControl<number | null>(null, {
      validators: [
        Validators.required,
        Validators.min(0.01),
      ],
    }),

    descrizione: new FormControl("", {
      nonNullable: true,
    }),
  });

  saldo = signal<number | null>(null);
  messaggioEsito = signal("");
  erroreEsito = signal("");

  get datiBonifico(): BonificoFormValue {
    return this.bonificoForm.getRawValue();
  }

  ngOnInit(): void {
    this.caricaSaldo();
  }

  caricaSaldo(): void {
    this.http
      .get<{
        movimenti: unknown[];
        saldo?: number;
      }>("/api/movimenti", {
        params: {
          n: 1,
        },
      })
      .subscribe({
        next: (res) => {
          this.saldo.set(res.saldo ?? 0);
        },

        error: (err) => {
          console.error(
            "Errore caricamento saldo:",
            err
          );
        },
      });
  }

  inviaBonifico(): void {
    this.messaggioEsito.set("");
    this.erroreEsito.set("");

    if (this.bonificoForm.invalid) {
      this.bonificoForm.markAllAsTouched();

      this.erroreEsito.set(
        "Compila correttamente tutti i campi obbligatori"
      );

      return;
    }

    const datiBonifico =
      this.bonificoForm.getRawValue();

    if (datiBonifico.importo === null) {
      this.erroreEsito.set(
        "L'importo del bonifico è obbligatorio"
      );

      return;
    }

    const body = {
      ibanDestinatario:
        datiBonifico.iban.trim(),

      importo: datiBonifico.importo,

      descrizione:
        datiBonifico.descrizione.trim(),
    };

    this.http
      .post(
        "/api/operazioni/bonifico",
        body
      )
      .subscribe({
        next: () => {
          this.messaggioEsito.set(
            "Bonifico eseguito con successo"
          );

          this.bonificoForm.reset({
            iban: "",
            importo: null,
            descrizione: "",
          });

          this.caricaSaldo();
        },

        error: (err) => {
          this.erroreEsito.set(
            err.error?.message ??
            "Impossibile collegarsi al backend"
          );
        },
      });
  }
}