import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

export const authOptions: NextAuthOptions = {
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
            role: user.role || user.level, // ajuste conforme vier
            ministryId: user.ministryId || "",
            accessToken: user.accessToken || null,
          };
        } catch (error) {
          console.error("Erro ao autenticar:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
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
        (session.user as any).id = token.id;
        (session.user as any).email = token.email;
        (session.user as any).name = token.name;
        (session.user as any).role = token.role;
        (session.user as any).ministryId = token.ministryId;
        (session.user as any).photo = token.photo;
      }
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutos
  },

  secret: `${process.env.NEXTAUTH_SECRET_ROUTER}`,

  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };