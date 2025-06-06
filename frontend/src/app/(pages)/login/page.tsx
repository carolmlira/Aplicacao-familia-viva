"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [banner, setBanner] = useState<BannerType | null>(null);
  const [imgTimestamp, setImgTimestamp] = useState("");
  const router = useRouter();

  type BannerType = {
    id: string;
    imagemLogo?: string;
    imagemBanner?: string;
    frase?: string;
    imagemLogoFile?: File;
    imagemBannerFile?: File;
  };   
   
  useEffect(() => {
    fetchBanner();
    setImgTimestamp(Date.now().toString());
  }, []); 

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/logo`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.url) {
          setLogoUrl(`${data.url}?t=${Date.now()}`);
        }
      })
      .catch((err) => console.error("Erro ao carregar logo:", err));
  }, []);

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
      setError("Login ou Senha Inválida");
    }
  };

  async function fetchBanner() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banner`);
      if (!res.ok) throw new Error("Erro ao buscar dados do Banner");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setBanner(data[0]); // pega só o primeiro
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4">
      {/* Logos */}
      <div className="flex flex-col items-center space-y-2">
        {logoUrl && (
          <Image
            src={`${logoUrl}?t=${imgTimestamp}`}
            alt="Logo institucional"
            width={140}
            height={140}
            className="rounded-full"
          />
        )}

        {banner ? (
          banner.imagemLogo ? (
            <Image
              src={`${banner.imagemLogo}?t=${imgTimestamp}`}
              alt="Logo principal"
              width={500}
              height={140}
            />
          ) : (
            <Image
              src="/viva_logo.png"
              alt="Família Viva Logo"
              width={500}
              height={140}
            />
          )
        ) : null}

      </div>

      {/* Formulário */}
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-zinc-900 mt-8 p-8 rounded-2xl shadow-2xl text-white space-y-6"
      >
        <div className="space-y-4">
          <div>
            <input
              id="email"
              type="email"
              placeholder="Digite seu email"
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          <div>
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
    </div>
  );
}