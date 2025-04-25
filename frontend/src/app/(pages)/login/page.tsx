"use client";
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import React, { useState } from "react";
import Image from "next/image";
=======
=======
>>>>>>> c713450 (Finalização das redes e galeria. Ajuste na tela de login.)
=======
>>>>>>> 8f12c0c (Auth front, back e banco. Tabela de usuario(ADD,EDIT,Delet))

import React, { useState } from "react";
import Image from "next/image";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 8dea4da (Front parcialmente feito)
=======
=======
import React, { useState } from "react";
import Image from "next/image";
>>>>>>> 3d50828 (Finalização das redes e galeria. Ajuste na tela de login.)
>>>>>>> c713450 (Finalização das redes e galeria. Ajuste na tela de login.)
=======
>>>>>>> 8f12c0c (Auth front, back e banco. Tabela de usuario(ADD,EDIT,Delet))
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
      setError("Login inválido");
=======
      setError("Login inválido, Calabrezo");
>>>>>>> 8dea4da (Front parcialmente feito)
=======
      setError("Login inválido, Calabrezo");
=======
      setError("Login inválido");
>>>>>>> 3d50828 (Finalização das redes e galeria. Ajuste na tela de login.)
>>>>>>> c713450 (Finalização das redes e galeria. Ajuste na tela de login.)
=======
      setError("Login inválido, Calabrezo");
>>>>>>> 8f12c0c (Auth front, back e banco. Tabela de usuario(ADD,EDIT,Delet))
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4">
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
      {/* Logos */}
      <div className="flex flex-col items-center space-y-2">
        <Image
          src="/viva_logo.png"
          alt="Família Viva Logo"
          width={140}
          height={140}
        />
        <Image
          src="/familia_viva.png"
          alt="Nome Família Viva"
          width={500}
          height={100}
        />
      </div>

      {/* Formulário */}
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-zinc-900 mt-8 p-8 rounded-2xl shadow-2xl text-white space-y-6"
      >
        <div className="space-y-4">
          <div>
=======
=======
>>>>>>> c713450 (Finalização das redes e galeria. Ajuste na tela de login.)
=======
>>>>>>> 8f12c0c (Auth front, back e banco. Tabela de usuario(ADD,EDIT,Delet))
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
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 8dea4da (Front parcialmente feito)
=======
=======
      {/* Logos */}
      <div className="flex flex-col items-center space-y-2">
        <Image
          src="/viva_logo.png"
          alt="Família Viva Logo"
          width={140}
          height={140}
        />
        <Image
          src="/familia_viva.png"
          alt="Nome Família Viva"
          width={500}
          height={100}
        />
      </div>

      {/* Formulário */}
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-zinc-900 mt-8 p-8 rounded-2xl shadow-2xl text-white space-y-6"
      >
        <div className="space-y-4">
          <div>
>>>>>>> 3d50828 (Finalização das redes e galeria. Ajuste na tela de login.)
>>>>>>> c713450 (Finalização das redes e galeria. Ajuste na tela de login.)
=======
>>>>>>> 8f12c0c (Auth front, back e banco. Tabela de usuario(ADD,EDIT,Delet))
            <input
              id="email"
              type="email"
              placeholder="Digite seu email"
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
=======
              className="mt-1 bg-zinc-800 border-zinc-700 text-white"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
>>>>>>> 8dea4da (Front parcialmente feito)
=======
              className="mt-1 bg-zinc-800 border-zinc-700 text-white"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
=======
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
>>>>>>> 3d50828 (Finalização das redes e galeria. Ajuste na tela de login.)
>>>>>>> c713450 (Finalização das redes e galeria. Ajuste na tela de login.)
=======
              className="mt-1 bg-zinc-800 border-zinc-700 text-white"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
>>>>>>> 8f12c0c (Auth front, back e banco. Tabela de usuario(ADD,EDIT,Delet))
            />
          </div>

          <div>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-white text-black font-semibold py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Entrar
          </button>

          <div className="text-center">
          <Link href="/esqueceu-senha" className="text-sm text-zinc-400 hover:text-white underline transition"> 
          Esqueceu a senha?
          </Link>
          </div>
        </div>
      </form>

      {/* Botão Voltar */}
      <div className="mt-6">
        <Link href="/">
          <button className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-6 py-2 rounded-lg shadow-md">
            Voltar
          </button>
        </Link>
      </div>
=======
=======
>>>>>>> c713450 (Finalização das redes e galeria. Ajuste na tela de login.)
=======

>>>>>>> 8f12c0c (Auth front, back e banco. Tabela de usuario(ADD,EDIT,Delet))
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
            <a href="#" className="text-zinc-400 hover:text-white underline"></a>

            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-white text-black font-semibold py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Entrar
          </button>

          <div className="text-center">

            <a
              href="#"
              className="text-sm text-zinc-400 hover:text-white underline transition"
            >

              Esqueceu a senha?
            </a>

          <Link href="/esqueceu-senha" className="text-sm text-zinc-400 hover:text-white underline transition"> 
          Esqueceu a senha?
          </Link>

          </div>
        </div>
      </form>
      <Link href="/">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Voltar
          </button>
        </Link>
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 8dea4da (Front parcialmente feito)
=======
=======

      {/* Botão Voltar */}
      <div className="mt-6">
        <Link href="/">
          <button className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-6 py-2 rounded-lg shadow-md">
            Voltar
          </button>
        </Link>
      </div>
>>>>>>> 3d50828 (Finalização das redes e galeria. Ajuste na tela de login.)
>>>>>>> c713450 (Finalização das redes e galeria. Ajuste na tela de login.)
=======
>>>>>>> 8f12c0c (Auth front, back e banco. Tabela de usuario(ADD,EDIT,Delet))
    </div>
  );
}
