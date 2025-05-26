import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "COMUNIC" | "VOLUNT" | "LIDER";
  ministryId?: string;
  photo?: string;
  accessToken?: string;
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          const user = await res.json();

          if (!res.ok || !user?.id) {
            console.error("Falha ao autenticar:", user?.message || "Erro desconhecido");
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role || user.level,
            ministryId: user.ministryId || "",
            accessToken: user.access_token || null,
          };
        } catch (error) {
          console.error("Erro ao autenticar:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: AuthUser  }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.photo = user.photo;
        token.ministryId = user.ministryId;
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        (session.user).id = token.id;
        (session.user).email = token.email;
        (session.user).name = token.name;
        (session.user).role = token.role;
        (session.user).ministryId = token.ministryId;
        (session.user).photo = token.photo;
      }
      (session).accessToken = token.accessToken;
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET_ROUTER,

  pages: {
    signIn: "/login",
    signOut: process.env.NEXT_PUBLIC_API_URL,
  },
};

const handler = NextAuth(authOptions);

// Exporta apenas os handlers que a rota suporta
export { handler as GET, handler as POST };
