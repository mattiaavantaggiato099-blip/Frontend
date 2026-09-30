import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MovimentoService, Movimento } from '../../services/movimenti-dettaglio.service';

@Component({
  selector: 'app-movimenti-dettaglio',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './movimenti-dettaglio.component.html',
  styleUrl: './movimenti-dettaglio.component.css'
})
export class MovimentiDettaglioComponent implements OnInit {

  movimento: Movimento | null = null;

  loading = true;
  errore = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movimentoService: MovimentoService
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errore = 'Movimento non trovato.';
      this.loading = false;
      return;
    }

    this.caricaMovimento(id);
  }

  caricaMovimento(id: string): void {

    this.movimentoService.getDettaglioMovimento(id).subscribe({

      next: (data) => {
        this.movimento = data;
        this.loading = false;
      },

      error: (error) => {
        console.error('Errore nel caricamento del movimento:', error);

        this.errore = 'Impossibile caricare il dettaglio del movimento.';
        this.loading = false;
      }

    });
  }

  tornaAiMovimenti(): void {
    this.router.navigate(['/movimenti-dettaglio']);
  }

}