import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Movimento {
movimentoID: any;
contoCorrenteID: any;
categoriaMovimentoID: string;
tipologia: any;
saldo: string|number;
descrizioneEstesa: any;
  data: string;
  importo: number;
  nomeCategoria: string;
}

@Injectable({
  providedIn: 'root'
})
export class MovimentoService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getDettaglioMovimento(id: string): Observable<Movimento> {
    return this.http.get<Movimento>(
      `${this.apiUrl}/movimenti/${id}`
    );
  }
}