import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Categoria, Movimento } from '../../ricerca-movimenti/ricerca-movimenti.model';
import { RicercaMovimentiService } from '../../ricerca-movimenti/ricerca-movimenti.service';


type ModalitaFiltro = 'nessuno' | 'categoria' | 'date';

@Component({
  selector: 'app-lista-movimenti',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movimenti.component.html',
  styleUrl: './movimenti.component.css'
})
export class ListaMovimentiComponent implements OnInit {

  constructor(private ricercaMovimentiService: RicercaMovimentiService) {}

  n = 20;
  modalita: ModalitaFiltro = 'nessuno';
  categoriaId = '';
  dataDa = '';
  dataA = '';

  categorie = signal<Categoria[]>([]);
  movimenti = signal<Movimento[]>([]);
  saldo = signal<number | null>(null);
  caricamento = signal(false);
  errore = signal<string | null>(null);

  movimentiOrdinati = computed(() =>
    [...this.movimenti()].sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    )
  );

  ngOnInit(): void {
    this.ricercaMovimentiService.getCategorie().subscribe({
      next: (cat) => this.categorie.set(cat),
      error: () => this.errore.set('Impossibile caricare le categorie.')
    });

    this.cerca();
  }

  cerca(): void {
    if (this.modalita === 'date' && (!this.dataDa || !this.dataA)) {
      this.errore.set('Devi selezionare entrambe le date.');
      return;
    }

    this.caricamento.set(true);
    this.errore.set(null);

    this.ricercaMovimentiService.cerca({
      n: this.n,
      categoriaId: this.modalita === 'categoria' ? this.categoriaId : null,
      dataDa: this.modalita === 'date' ? this.dataDa : '',
      dataA: this.modalita === 'date' ? this.dataA : '',
    }).subscribe({
      next: (res) => {
        this.movimenti.set(res.movimenti);
        this.saldo.set(res.saldo ?? null);
        this.caricamento.set(false);
      },
      error: () => {
        this.errore.set('Errore nel recupero dei movimenti.');
        this.caricamento.set(false);
      }
    });
  }

  cambiaModalita(modalita: ModalitaFiltro): void {
    this.modalita = modalita;
    this.categoriaId = '';
    this.dataDa = '';
    this.dataA = '';
  }

  esportaCsv(): void {
    this.ricercaMovimentiService.esportaCsv(this.movimentiOrdinati());
  }
}