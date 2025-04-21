// schedule.entity.ts

  export class ScheduleEntity {
    id: string;
    date: string; // ISO format: YYYY-MM-DD
<<<<<<< HEAD
    members: string[]; // nomes ou IDs de pessoas que foram escaladas
    description: string; // descrição do que o usuario tem que fazer naquele dia.
    available: boolean; // Se o usuario tem disponibilidade
    confirmed?: boolean; // quem se disponibilizou
=======
    members: string[]; // nomes ou IDs de pessoas escaladas
    description: string; // descrição do que o usuario tem que fazer naquele dia.
    available: boolean; // Se o usuario tem disponibilidade
    confirmed?: boolean; // se a escala foi confirmada pelos membros
>>>>>>> 626a55d (Login e Auth do Front. Correção Usuarios e Auth do back)
    ministryId: string; // referência ao ministério]
    userId: string; // Referencia ao Usuario
  }
  