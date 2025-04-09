// schedule.entity.ts
export class Schedule {
    ministryId: string; // referência ao ministério
    date: string; // ISO format: YYYY-MM-DD
    members: string[]; // nomes ou IDs de pessoas escaladas
    notes?: string; // observações
    confirmed?: boolean; // se a escala foi confirmada pelos membros
  }