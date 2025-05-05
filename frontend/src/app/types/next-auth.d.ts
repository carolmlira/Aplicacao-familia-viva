import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 47f7474 (Correção Telas, Implem Escala, Exceções em Usuarios)
    role?: string;
<<<<<<< HEAD
>>>>>>> fddd392 (Login e Auth do Front. Correção Usuarios e Auth do back)
    user: {
      id: string;
      name: string;
      email: string;
      photo?: string;
      ministryId: string;
      role: "ADMIN" | "COMUNIC" | "VOLUNT" | "USER";
    };
=======
>>>>>>> 626a55d (Login e Auth do Front. Correção Usuarios e Auth do back)
=======
    user: {
      id: string;
      name: string;
      email: string;
      photo?: string;
      ministryId: string;
      role: "ADMIN" | "COMUNIC" | "VOLUNT" | "USER";
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
    role: "ADMIN" | "COMUNIC" | "VOLUNT" | "USER";
>>>>>>> 5f138ea (Correção Telas, Implem Escala, Exceções em Usuarios)
  }

  interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
    role: "ADMIN" | "COMUNIC" | "VOLUNT" | "USER";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    photo?: string;
    role: "ADMIN" | "COMUNIC" | "VOLUNT" | "USER";
    accessToken?: string;
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 47f7474 (Correção Telas, Implem Escala, Exceções em Usuarios)
    role?: string;
<<<<<<< HEAD
    level?: "ADMIN" | "VOLUNT" | "COMUNIC"; // também adiciona no JWT (caso use nele)
=======
>>>>>>> 626a55d (Login e Auth do Front. Correção Usuarios e Auth do back)
<<<<<<< HEAD
>>>>>>> fddd392 (Login e Auth do Front. Correção Usuarios e Auth do back)
=======
=======
>>>>>>> 5f138ea (Correção Telas, Implem Escala, Exceções em Usuarios)
>>>>>>> 47f7474 (Correção Telas, Implem Escala, Exceções em Usuarios)
  }
}
