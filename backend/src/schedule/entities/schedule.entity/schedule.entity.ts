// schedule.entity.ts

  export class ScheduleEntity {
    id: string;
    date: string; // ISO format: YYYY-MM-DD
    members: string[]; // nomes ou IDs de pessoas escaladas
    description: string; // descrição do que o usuario tem que fazer naquele dia.
    available: boolean; // Se o usuario tem disponibilidade
    confirmed?: boolean; // se a escala foi confirmada pelos membros
    ministryId: string; // referência ao ministério]
    userId: string; // Referencia ao Usuario
  }
  