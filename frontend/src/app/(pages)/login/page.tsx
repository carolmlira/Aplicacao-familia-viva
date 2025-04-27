"use client";

import React, { useState } from "react";
import Image from "next/image";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      router.push("/");
    } else {
      setError("Login inválido, Calabrezo");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4">
      <Link href="/home">
      <Image
        src="/logo_viva.jpg"
        alt="Família Viva Logo"
        width={140}
        height={140}
        className="mb-4"
      /></Link>

      <h1 className="text-white text-4xl font-light italic">
        Família <span className="font-bold not-italic text-yellow-400">VIVA</span>
      </h1>

      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-zinc-900 mt-6 text-white rounded-2xl shadow-lg"
      >
        <div className="p-6 space-y-4">
          <div>
            {/* <Label htmlFor="email">Email</Label> */}
            <input
              id="email"
              type="email"
              placeholder="Digite seu email"
              className="mt-1 bg-zinc-800 border-zinc-700 text-white"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div>
            {/* <Label htmlFor="password">Senha</Label> */}
            <input
             
              type="password"
              placeholder="Digite sua senha"
              className="mt-1 bg-zinc-800 border-zinc-700 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="w-full bg-white text-black hover:bg-gray-200">
            Entrar
          </button>

          <div className="text-center text-sm">
            <a href="#" className="text-zinc-400 hover:text-white underline">
              Esqueceu a senha?
            </a>
          </div>
        </div>
      </form>
      <Link href="/">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Voltar
          </button>
        </Link>
    </div>
  );
}
