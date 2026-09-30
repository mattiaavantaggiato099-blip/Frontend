import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ProfiloService, Profilo } from '../../services/profilo.service';

@Component({
  selector: 'app-profilo',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profilo.component.html',
  styleUrl: './profilo.component.css'
})
export class ProfiloComponent implements OnInit {
  private profiloService = inject(ProfiloService);

  profilo = signal<Profilo | null>(null);
nome: any;
cognome: any;
email: any;
contoCorrenteID: any;
dataApertura: any;
iban: any;

  ngOnInit(): void {
    this.caricaProfilo();
  }

  caricaProfilo(): void {
    this.profiloService.getProfilo().subscribe({
      next: (data) => this.profilo.set(data),
      error: (errore) => console.error('Errore nel caricamento del profilo:', errore),
    });
  }
}