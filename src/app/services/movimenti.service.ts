import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface MovimentoRicercaResult {
  movimenti: Movimento[];
  saldo?: number;
}

export interface Categoria {
  categoriaMovimentoId: string;
  nomeCategoria: string;
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

@Injectable({ providedIn: 'root' })
export class MovimentiService {
  private http = inject(HttpClient);

  cerca(
    numMov?: number,
    dataDa?: string,
    dataA?: string,
    categoria?: string
  ): Observable<MovimentoRicercaResult> {
    let params = new HttpParams();

    if (numMov !== undefined && numMov !== null) {
      params = params.set('n', numMov.toString());
    }

    if (dataDa) {
      params = params.set('dataDa', dataDa);
    }

    if (dataA) {
      params = params.set('dataA', dataA);
    }

    if (categoria) {
      params = params.set('categoriaId', categoria);
    }

    return this.http.get<MovimentoRicercaResult>(
      '/api/movimenti',
      { params }
    );
  }

  cercaNomeCat(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>('/api/categoria/cercaNomeCat');
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