import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_URL = '/api';

export interface Categoria {
  id: string;
  nome: string;
  tipologia: string;
}

export interface Movimento {
  movimentoId: string;
  contoCorrenteId: string;
  data: string;
  importo: number;
  saldo: number;
  categoriaMovimentoId: string;
  nomeCategoria: string;
  tipologia: 'Entrata' | 'Uscita';
  descrizioneEstesa: string;
}

export interface RicercaMovimentiFiltro {
  n: number;
  categoriaId: string | null;
  dataDa: string;
  dataA: string;
}

export interface RicercaMovimentiResponse {
  movimenti: Movimento[];
  saldo?: number;
}

@Injectable({ providedIn: 'root' })
export class MovimentiService {
  private http = inject(HttpClient);

  getCategorie(): Observable<Categoria[]> {
  return this.http.get<Categoria[]>(`${API_URL}/categoria`);
}

  cerca(filtro: RicercaMovimentiFiltro): Observable<RicercaMovimentiResponse> {
    let params = new HttpParams().set('n', filtro.n);

    if (filtro.categoriaId) {
      params = params.set('categoriaId', filtro.categoriaId);
    }
    if (filtro.dataDa && filtro.dataA) {
      params = params.set('dataDa', filtro.dataDa).set('dataA', filtro.dataA);
    }

    return this.http.get<RicercaMovimentiResponse>(`${API_URL}/movimenti`, { params });
  }

  esportaCsv(movimenti: Movimento[]): void {
    const intestazione = ['Data', 'Descrizione', 'Categoria', 'Tipo', 'Importo', 'Saldo'];
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;

    const righe = movimenti.map(m =>
      [m.data, m.descrizioneEstesa, m.nomeCategoria, m.tipologia, m.importo, m.saldo]
        .map(esc)
        .join(';')
    );

    const csv = '\uFEFF' + [intestazione.map(esc).join(';'), ...righe].join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));

    const a = document.createElement('a');
    a.href = url;
    a.download = 'movimenti.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}