import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-movimenti',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './movimenti.component.html',
  styleUrl: './movimenti.component.css'
})
export class MovimentiComponent {

  saldo = '2.487,32';

}