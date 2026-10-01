import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Profilo, ProfiloService } from '../../services/profilo.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profilo',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './profilo.component.html',
  styleUrl: './profilo.component.css'
})
export class ProfiloComponent implements OnInit {
  private profiloService = inject(ProfiloService);

  profilo = signal<Profilo | null>(null);
  isLoading = signal<boolean>(true);
  errore = signal<string | null>(null);

  ngOnInit(): void {
    this.caricaProfilo();
  }

  caricaProfilo(): void {
    this.isLoading.set(true);
    this.errore.set(null);

    this.profiloService.getProfilo().subscribe({
      next: (data) => {
        this.profilo.set(data);
        this.isLoading.set(false);
      },
      error: (errore) => {
        console.error('Errore nel caricamento del profilo:', errore);
        this.errore.set('Impossibile caricare il profilo. Riprova più tardi.');
        this.isLoading.set(false);
      },
    });
  }
}