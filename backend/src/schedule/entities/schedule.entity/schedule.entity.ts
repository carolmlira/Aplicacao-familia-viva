// schedule.entity.ts

  export class ScheduleEntity {
    id: string;
    date: string; // ISO format: YYYY-MM-DD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    members: string[]; // nomes ou IDs de pessoas que foram escaladas
=======
>>>>>>> 5f138ea (Correção Telas, Implem Escala, Exceções em Usuarios)
    description: string; // descrição do que o usuario tem que fazer naquele dia.
    available: boolean; // Se o usuario tem disponibilidade
    confirmed?: boolean; // quem se disponibilizou
=======
    members: string[]; // nomes ou IDs de pessoas escaladas
    description: string; // descrição do que o usuario tem que fazer naquele dia.
    available: boolean; // Se o usuario tem disponibilidade
    confirmed?: boolean; // se a escala foi confirmada pelos membros
>>>>>>> 626a55d (Login e Auth do Front. Correção Usuarios e Auth do back)
=======
    members: string[]; // nomes ou IDs de pessoas que foram escaladas
    description: string; // descrição do que o usuario tem que fazer naquele dia.
    available: boolean; // Se o usuario tem disponibilidade
    confirmed?: boolean; // quem se disponibilizou
>>>>>>> 5a69e9e (Auth front, back e banco. Tabela de usuario(ADD,EDIT,Delet))
    ministryId: string; // referência ao ministério]
    userId: string; // Referencia ao Usuario
  }
  