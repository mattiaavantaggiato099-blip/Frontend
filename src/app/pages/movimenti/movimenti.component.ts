import { Component, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ListaMovimentiComponent } from '../../components/lista-movimenti/lista-movimenti.component';
import { Categoria } from '../../services/movimenti.service';

export type Modalita = 'nessuno' | 'categoria' | 'date';

@Component({
  selector: 'app-movimenti',
  imports: [ReactiveFormsModule, ListaMovimentiComponent],
  templateUrl: './movimenti.component.html',
  styleUrl: './movimenti.component.css',
})
export class MovimentiComponent {
  private fb = inject(FormBuilder);
  listaMov = viewChild<ListaMovimentiComponent>(ListaMovimentiComponent);

  modalita: Modalita = 'nessuno';

  movimentiForm = this.fb.group({
    numMov: [5],
    categoria: [''],
    dataDa: [null as Date | null],
    dataA: [null as Date | null],
  });

  categorie = signal<Categoria[]>([]);

  get numMov() {
    return this.movimentiForm.get('numMov')?.value ?? 5;
  }

  get categoria() {
    return this.movimentiForm.get('categoria')?.value ?? '';
  }

  get dataDa() {
    const val = this.movimentiForm.get('dataDa')?.value as Date | null;
    return val ?? undefined;
  }

  get dataA() {
    const val = this.movimentiForm.get('dataA')?.value as Date | null;
    return val ?? undefined;
  }

  cambiaModalita(m: Modalita) {
    this.modalita = m;

    this.movimentiForm.patchValue({
      numMov: m === 'nessuno' ? 5 : this.movimentiForm.get('numMov')?.value,
      categoria: m === 'categoria' ? this.movimentiForm.get('categoria')?.value : '',
      dataDa: m === 'date' ? this.movimentiForm.get('dataDa')?.value : null,
      dataA: m === 'date' ? this.movimentiForm.get('dataA')?.value : null,
    });
  }

  cerca() {
    this.listaMov()?.cerca();
  }

  esportaCsv() {
    this.listaMov()?.esportaCsv();
  }
}