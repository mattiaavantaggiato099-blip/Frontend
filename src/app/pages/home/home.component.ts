import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ListaMovimentiComponent } from '../../components/lista-movimenti/lista-movimenti.component';

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
  imports: [RouterLink, RouterLinkActive, DatePipe, DecimalPipe, ListaMovimentiComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  today: Date = new Date();
  private http = inject(HttpClient);

  homeData = signal<HomeData | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  saldoConto: number | null = null;
  
  ngOnInit() {
    this.caricaHome();
  }

  caricaHome() {
    this.isLoading.set(true);
    this.error.set(null);

    this.http.get<HomeData>('/api/conto-corrente/user').subscribe({
      next: (data) => {
        // Debug: vedi cosa arriva esattamente
        console.log('Dati home ricevuti:', data);

        if (!data) {
          this.error.set('Nessun dato ricevuto dal server');
          this.isLoading.set(false);
          return;
        }

        this.homeData.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Errore caricamento home:', err);
        this.error.set('Impossibile caricare i dati. Riprova più tardi.');
        this.isLoading.set(false);
      },
    });
  }
}