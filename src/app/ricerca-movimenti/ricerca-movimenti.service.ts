import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria, Movimento, RicercaMovimentiFiltro, RicercaMovimentiResponse } from './ricerca-movimenti.model';

// TODO: da adattare all'URL reale dell'app (per ora come da progress: http://localhost:3000/api)
const API_URL = 'http://localhost:3000/api';

@Injectable({
  providedIn: 'root'
})
export class RicercaMovimentiService {

  constructor(private http: HttpClient) {}

  cerca(filtro: RicercaMovimentiFiltro): Observable<RicercaMovimentiResponse> {
    let params = new HttpParams().set('n', filtro.n);

    if (filtro.categoriaId) {
      params = params.set('categoriaId', filtro.categoriaId);
    } else if (filtro.dataDa && filtro.dataA) {
      params = params.set('dataDa', filtro.dataDa).set('dataA', filtro.dataA);
    }

    return this.http.get<RicercaMovimentiResponse>(`${API_URL}/movimenti`, { params });
  }

  getCategorie(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${API_URL}/categorie-movimenti`);
  }

  esportaCsv(movimenti: Movimento[]): void {
    const intestazione = ['Data', 'Descrizione', 'Categoria', 'Tipo', 'Importo', 'Saldo'];

    const righe = movimenti.map(m => [
      new Date(m.data).toLocaleString('it-IT'),
      m.descrizioneEstesa,
      m.nomeCategoria,
      m.tipologia,
      m.importo.toFixed(2).replace('.', ','),
      m.saldo.toFixed(2).replace('.', ',')
    ]);

    const contenuto = [intestazione, ...righe]
      .map(riga => riga.map(campo => `"${String(campo).replace(/"/g, '""')}"`).join(';'))
      .join('\r\n');

    const bom = '\uFEFF';
    const blob = new Blob([bom + contenuto], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `movimenti_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  }
}