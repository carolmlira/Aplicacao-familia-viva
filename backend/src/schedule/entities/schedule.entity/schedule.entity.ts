// schedule.entity.ts

  export class ScheduleEntity {
    id: string;
    date: string; // ISO format: YYYY-MM-DD
    description: string; // descrição do que o usuario tem que fazer naquele dia.
    available: boolean; // Se o usuario tem disponibilidade
    confirmed?: boolean; // quem se disponibilizou
    ministryId: string; // referência ao ministério]
    userId: string; // Referencia ao Usuario
    time: Date;
  }
  