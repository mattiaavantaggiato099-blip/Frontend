import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RicercaMovimentiService } from './ricerca-movimenti.service';
import { Movimento } from './ricerca-movimenti.model';

type ModoFiltro = 'nessuno' | 'categoria' | 'date';

@Component({
  selector: 'app-ricerca-movimenti',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ricerca-movimenti.html',
  styleUrl: './ricerca-movimenti.css'
})
export class RicercaMovimenti implements OnInit {

  // TODO: da sostituire con i dati reali dell'utente autenticato (JWT/auth service dei colleghi)
  nomeUtente = 'Nome Cognome';
  inizialiUtente = 'NC';

  modoFiltro: ModoFiltro = 'nessuno';

  filtro = {
    n: 20,
    categoriaId: null as string | null,
    dataDa: '',
    dataA: ''
  };

  movimenti: Movimento[] = [];
  categorie: { id: string; nome: string }[] = [];
  caricamento = false;

  // Riepilogo in alto: dati mock in attesa di un endpoint dedicato
  // (non fanno parte delle specifiche RicercaMovimenti1/2/3 — vedi nota in chat)
  saldoDisponibile = 2487.32;
  numeroConto = '1234567890';
  variazione7gg = 1248.76;

  private trendValori = [2200, 2100, 2350, 2300, 2050, 2400, 2487];
  trendGiorni = ['15 Set', '16 Set', '17 Set', '18 Set', '19 Set', '20 Set', '21 Set'];
  trendPoints = '';
  trendCirclePoints: { x: number; y: number }[] = [];

  categorieSpesa = [
    { nome: 'Utenze', percentuale: 32.4, colore: '#2563eb' },
    { nome: 'Alimentari', percentuale: 18.7, colore: '#198754' },
    { nome: 'Trasporti', percentuale: 14.2, colore: '#fd7e14' },
    { nome: 'Intrattenimento', percentuale: 12.6, colore: '#6f42c1' },
    { nome: 'Altro', percentuale: 22.1, colore: '#6b7280' }
  ];
  donutSegments: { colore: string; dasharray: string; dashoffset: string }[] = [];

  // Mappa approssimativa categoria -> icona/colore, in attesa dell'elenco categorie reale dal backend
  private mappaIconeCategoria: { match: string; icona: string; colore: string }[] = [
    { match: 'bonifico', icona: 'fa-right-left', colore: '#2563eb' },
    { match: 'stipendio', icona: 'fa-arrow-up', colore: '#198754' },
    { match: 'utenz', icona: 'fa-bolt', colore: '#6f42c1' },
    { match: 'ricarica', icona: 'fa-mobile-screen-button', colore: '#0891b2' },
    { match: 'prelievo', icona: 'fa-money-bill-wave', colore: '#fd7e14' },
    { match: 'versamento', icona: 'fa-piggy-bank', colore: '#0f6e56' },
    { match: 'apertura', icona: 'fa-door-open', colore: '#6b7280' },
    { match: 'shopping', icona: 'fa-cart-shopping', colore: '#2563eb' },
    { match: 'amazon', icona: 'fa-cart-shopping', colore: '#2563eb' }
  ];

  constructor(
    private ricercaMovimentiService: RicercaMovimentiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.calcolaTrendChart();
    this.calcolaDonutChart();
    this.caricaCategorie();
    this.cercaMovimenti();
  }

  impostaModoFiltro(modo: ModoFiltro): void {
    this.modoFiltro = modo;
    if (modo !== 'categoria') this.filtro.categoriaId = null;
    if (modo !== 'date') { this.filtro.dataDa = ''; this.filtro.dataA = ''; }
  }

  caricaCategorie(): void {
    this.ricercaMovimentiService.getCategorie().subscribe(c => this.categorie = c);
  }

  cercaMovimenti(): void {
    this.caricamento = true;
    this.ricercaMovimentiService.cerca(this.filtro).subscribe({
      next: res => {
        this.movimenti = res.movimenti;
        if (res.saldo !== undefined) this.saldoDisponibile = res.saldo;
        this.caricamento = false;
      },
      error: () => this.caricamento = false
    });
  }

  esportaCsv(): void {
    // separatore ';', virgola decimale, BOM UTF-8 — riusa l'implementazione già presente nel service
    this.ricercaMovimentiService.esportaCsv(this.movimenti);
  }

  vaiADettaglio(m: Movimento): void {
    this.router.navigate(['/dettaglio-movimento', m.movimentoId]);
  }

  logout(): void {
    // TODO: da collegare all'auth service reale (rimozione token, redirect a /login)
    this.router.navigate(['/login']);
  }

  iconaCategoria(nomeCategoria: string): { icona: string; colore: string } {
    const trovata = this.mappaIconeCategoria.find(c =>
      nomeCategoria?.toLowerCase().includes(c.match)
    );
    return trovata ?? { icona: 'fa-circle-dot', colore: '#6b7280' };
  }

  private calcolaTrendChart(): void {
    const min = Math.min(...this.trendValori);
    const max = Math.max(...this.trendValori);
    const range = max - min || 1;
    const stepX = 320 / (this.trendValori.length - 1);

    this.trendCirclePoints = this.trendValori.map((v, i) => ({
      x: i * stepX,
      y: 100 - ((v - min) / range) * 90 - 5
    }));
    this.trendPoints = this.trendCirclePoints.map(p => `${p.x},${p.y}`).join(' ');
  }

  private calcolaDonutChart(): void {
    const circonferenza = 2 * Math.PI * 15.9;
    let offsetAccumulato = 0;

    this.donutSegments = this.categorieSpesa.map(c => {
      const lunghezzaArco = (c.percentuale / 100) * circonferenza;
      const segmento = {
        colore: c.colore,
        dasharray: `${lunghezzaArco} ${circonferenza - lunghezzaArco}`,
        dashoffset: `${-offsetAccumulato}`
      };
      offsetAccumulato += lunghezzaArco;
      return segmento;
    });
  }
}