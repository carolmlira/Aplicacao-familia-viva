import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

interface CustomUser {
  id: string;
  email: string;
  role: string;
  access_token: string;
  name: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Usuário de teste Admin
        if (
          credentials?.email === "admin@example.com" &&
          credentials?.password === "123"
        ) {
          const user: CustomUser = {
            id: "1",
            email: "admin@example.com",
            role: "admin",
            access_token: "dummyAccessToken123",
            name: "Milena Daniel",
          };

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            token: user.access_token,
            name: user.name,
          };
        }

        if (
          credentials?.email === "user@example.com" &&
          credentials?.password === "123"
        ) {
          const user: CustomUser = {
            id: "2",
            email: "user@example.com",
            role: "user",
            access_token: "dummyAccessTokenUser",
            name: "Julia Kaylane",
          };

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            token: user.access_token,
            name: user.name,
          };
        }

        // Simulação de erro caso o email ou senha não sejam corretos
        console.error("Falha na autenticação");
        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.token;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).email = token.email;
        (session.user as any).role = token.role;
        (session.user as any).name = token.name;
      }
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login", // ou a página que você usa
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
