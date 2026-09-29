import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DatePipe,DecimalPipe } from '@angular/common';

interface Movimento {
  movimentoID: string;
  data: string;
  importo: number;
  descrizioneEstesa: string;
  categoriaMovimentoID?: string;
}

interface HomeData {
  nomeTitolare: string;
  cognomeTitolare: string;
  IBAN: string;
  saldo: number;
  contoCorrenteId: string;
  movimenti: Movimento[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, DatePipe, DecimalPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  today: Date = new Date();
  private http = inject(HttpClient);

  homeData: HomeData | null = null;

  ngOnInit() {
    this.caricaHome();
  }

  caricaHome() {
    this.http.get<HomeData>('/api/conto-corrente/home')
      .subscribe({
        next: (data) => {
          console.log('Dati home:', data);
          this.homeData = data;
        },
        error: (err) => {
          console.error('Errore caricamento home:', err);
        }
      });
  }
}
