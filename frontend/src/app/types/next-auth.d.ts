import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    role?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      level: "ADMIN" | "VOLUNT" | "COMUNIC"; // novo campo que você quer
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    role?: string;
    level?: "ADMIN" | "VOLUNT" | "COMUNIC"; // também adiciona no JWT (caso use nele)
  }
}
