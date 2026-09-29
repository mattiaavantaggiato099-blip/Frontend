import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProfiloService, Profilo } from '../../services/profilo.service';

@Component({
selector: 'app-profilo',
standalone: true,
imports: [RouterLink],
templateUrl: './profilo.component.html',
styleUrl: './profilo.component.css'
})
export class ProfiloComponent implements OnInit {

nome: string = '';
cognome: string = '';
email: string = '';
contoCorrenteID: string = '';
dataApertura: string = '';
iban: string = '';

constructor(private profiloService: ProfiloService) {}

ngOnInit(): void {
this.caricaProfilo();
}

caricaProfilo(): void {


this.profiloService.getProfilo().subscribe({

  next: (data: Profilo) => {

    this.nome = data.NomeTitolare;
    this.cognome = data.CognomeTitolare;

  },

  error: (errore) => {
    console.error('Errore nel caricamento del profilo:', errore);
  }

});


}

}
