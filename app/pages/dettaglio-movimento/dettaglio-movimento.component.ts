import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-dettaglio-movimento',
  standalone: true,
  imports: [
    NavbarComponent,
    RouterLink
  ],
  templateUrl: './dettaglio-movimento.component.html',
  styleUrl: './dettaglio-movimento.component.css'
})
export class DettaglioMovimentoComponent {

  movimentoId: string | null = null;

  constructor(private route: ActivatedRoute) {

    this.movimentoId =
      this.route.snapshot.paramMap.get('id');

  }

}