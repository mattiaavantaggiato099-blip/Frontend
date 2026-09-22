import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profilo',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profilo.component.html',
  styleUrl: './profilo.component.css'
})
export class ProfiloComponent {

  nome = 'Francesco';
  cognome = 'Pasetto';
  email = 'francesco.pasetto@email.it';
  dataApertura = '21/09/2026';
  iban = 'IT12X020081234567890123456789';
  contoCorrenteID = '1234567890';

}