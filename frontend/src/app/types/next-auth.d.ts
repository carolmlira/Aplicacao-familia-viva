import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
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
  }
}
