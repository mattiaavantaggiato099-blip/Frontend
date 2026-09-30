import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Profilo {
  NomeTitolare: string;
  CognomeTitolare: string;
  Saldo: number;
  UltimiMovimenti: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ProfiloService {

  private apiUrl = 'http://localhost:3000/api/conto-corrente';

  constructor(private http: HttpClient) {}

  getProfilo(): Observable<Profilo> {
    return this.http.get<Profilo>(
      `${this.apiUrl}/home`
    );
  }
}