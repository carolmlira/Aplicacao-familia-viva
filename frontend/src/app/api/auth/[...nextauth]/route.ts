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
        try {
          const res = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });
        
  

          let data;
          try {
             data = await res.json(); // Protege caso o backend não retorne nada
          } catch (err) {
            console.error("Resposta da API não é JSON:", err);
            return null;
          }

          if (!res.ok || !data.access_token) {
            console.error("Erro ao autenticar:", data);
            return null;
          }

          const accessToken = data.access_token;
          if (!accessToken || accessToken.split('.').length !== 3) {
            console.error("Token mal formado:", accessToken);
            return null;
          }

          const payload: any = JSON.parse(atob(accessToken.split('.')[1]));
          // console.log("Payload decodificado do token:", payload);
          // const user: CustomUser = {
          //   id: payload.sub,
          //   email: payload.email,
          //   role: payload.role,
          //   access_token: accessToken,
          //   name: payload.name,
          // };
          
          // console.log('Usuário autenticado:', user.name);
          // console.log('Role do Usuário autenticado:', user.role);

          return {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
            token: accessToken,
            name: payload.name,
          };
        } catch (error) {
          console.error('Erro na autenticação com Nest:', error);
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

  secret: 'c4EJegs0CbTr10VzGBikAbYJzdKFzS2gFkAsX+FIKcY=',


  pages: {
    signIn: "/login", // ou a página que você usa
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };