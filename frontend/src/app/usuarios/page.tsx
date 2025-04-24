"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";


export default function usuarios() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session || (session.user as any).role !== "admin") {
      router.push("/"); // ou página de erro
    }
  }, [session, status, router]);

  if (status === "loading" || !session || (session.user as any).role !== "admin") {
    return <p className="text-center mt-10">404 Not Found, Voltando para Página inicial...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <main className="w-full max-w-md p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Usuarios</h1>

       
      </main>

      <footer className="mt-8 text-sm text-gray-500">
        <Link href="/">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Voltar
          </button>
        </Link>
      </footer>
    </div>
  );
}
