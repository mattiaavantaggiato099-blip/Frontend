import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Categoria,
  MovimentoRicercaResult
} from '../pages/movimenti/movimenti.component';

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
}