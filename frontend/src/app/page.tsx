"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();

  return (
    // Aqui que fica as tags do tipo html
    <div>
      <main className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex flex-row gap-4">
          {!session ? (
            <>
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded text-center"
              >
                Login
              </Link>
            </>
          ) : (
            <>
              <p>Bem-vindo, {session.user?.name}</p>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={() =>
                  signOut({ callbackUrl: 'http://localhost:3001' })
                }
              >
                Logout
              </button>
              {/* Mostrar o botão Escala apenas se o usuário estiver autenticado */}
              <Link
                href="/escala"
                className="bg-blue-600 text-white px-4 py-2 rounded text-center"
              >
                Escala
              </Link>
              {(session.user as any).role === "ADMIN" && (
              <Link
               href="/usuarios"
               className="bg-green-600 text-white px-4 py-2 rounded text-center"
                >
                Usuários
              </Link>
              )}
            </>
          )}
        </div>
      </main>
      <footer></footer>
    </div>
  );
}
