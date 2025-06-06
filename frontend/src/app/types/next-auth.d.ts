import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      name: string;
      email: string;
      photoURL?: string;
      ministryId?: string;
      role: "ADMIN" | "COMUNIC" | "VOLUNT" | "LIDER";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    name: string;
    email: string;
    photoURL?: string;
    ministryId?: string;
    role: "ADMIN" | "COMUNIC" | "VOLUNT" | "LIDER";
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    photoURL?: string;
    ministryId?: string;
    role: "ADMIN" | "COMUNIC" | "VOLUNT" | "LIDER";
    accessToken?: string;
  }
}
