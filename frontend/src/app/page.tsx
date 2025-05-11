"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();

  return (
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
                  signOut({ callbackUrl: 'http://localhost:3001/login' })
                }
              >
                Logout
              </button>

              <Link
                href="/escala"
                className="bg-blue-600 text-white px-4 py-2 rounded text-center"
              >
                Escala
              </Link>

              {['ADMIN', 'COMUNIC'].includes((session.user as any).role) && (
                <Link
                  href="/gallery"
                  className="bg-yellow-500 text-white px-4 py-2 rounded text-center"
                >
                  Galeria
                </Link>
              )}

              {(session.user as any).role === "ADMIN" && (
                <>
                  <Link
                    href="/usuarios"
                    className="bg-green-600 text-white px-4 py-2 rounded text-center"
                  >
                    Usuários
                  </Link>

                  <Link
                    href="/ministry"
                    className="bg-purple-600 text-white px-4 py-2 rounded text-center"
                  >
                    Ministérios
                  </Link>
                  <Link
                    href="/projects"
                    className="bg-orange-600 text-white px-4 py-2 rounded text-center"
                  >
                    Projeto
                  </Link>
                                    
                  <Link
                    href="/redes"
                    className="bg-pink-600 text-white px-4 py-2 rounded text-center"
                  >
                    Redes
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </main>
      <footer></footer>
    </div>
  );
}
