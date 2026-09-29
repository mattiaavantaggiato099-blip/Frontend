import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Movimento {
  movimentoID: string;
  contoCorrenteID: string;
  data: string;
  importo: number;
  saldo: number;
  categoriaMovimentoID: string;
  nomeCategoria?: string;
  tipologia?: string;
  descrizioneEstesa: string;
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