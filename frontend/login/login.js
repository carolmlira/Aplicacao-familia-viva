import React, { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      console.log("Email:", email);
      console.log("Password:", password);
      alert("Login simulado com sucesso!");
    } catch (err) {
      setError("Falha ao entrar. Verifique seus dados.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4">
      <Image
        src="/logo_viva.png"
        alt="Família Viva Logo"
        width={140}
        height={140}
        className="mb-4"
      />

      <h1 className="text-white text-4xl font-light italic">
        Família <span className="font-bold not-italic text-yellow-400">VIVA</span>
      </h1>

      <div className="w-full max-w-sm bg-zinc-900 mt-6 text-white rounded-2xl shadow-lg">
        <div className="p-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu email"
              className="mt-1 bg-zinc-800 border-zinc-700 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              className="mt-1 bg-zinc-800 border-zinc-700 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button onClick={handleLogin} className="w-full bg-white text-black hover:bg-gray-200">
            Entrar
          </Button>

          <div className="text-center text-sm">
            <a href="#" className="text-zinc-400 hover:text-white underline">
              Esqueceu a senha?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
