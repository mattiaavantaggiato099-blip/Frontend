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

export interface Categoria {
  id: string;
  nome: string;
  tipologia: 'Entrata' | 'Uscita';
}