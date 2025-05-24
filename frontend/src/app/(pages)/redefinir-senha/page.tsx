"use client";

import Image from "next/image";
import styles from "./redefinir-senha.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function RedefinirSenhaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [erroSenha, setErroSenha] = useState("");
  const [senhaCoincidem, setSenhaCoincidem] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  useEffect(() => {
    if (!token) {
      router.replace("/");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroSenha("");
    setSenhaCoincidem("");

    if (novaSenha.length < 6) {
      setErroSenha("A senha deve conter no mínimo 6 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setSenhaCoincidem("As senhas não coincidem!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password: novaSenha }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao redefinir a senha");
      }

      alert("Senha redefinida com sucesso!");
      router.push("/login");
    } catch (error: any) {
      alert(error.message || "Erro inesperado");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Image src="/viva_logo.png" alt="Logo" width={140} height={140} />
        <Image
          src="/familia_viva.png"
          alt="Família Viva"
          width={500}
          height={100}
        />
      </div>
      <div className={styles.formBox}>
        <h1 className={styles.titulo}>Redefinir senha</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nova senha"
            className={styles.input}
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirmar nova senha"
            className={styles.input}
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
          />
          {senhaCoincidem && (
            <div className={styles.erro}>{senhaCoincidem}</div>
          )}
          {erroSenha && <div className={styles.erro}>{erroSenha}</div>}
          <button type="submit" className={styles.button}>
            Redefinir
          </button>
          <button
            type="button"
            className={styles.buttonVoltar}
            onClick={() => router.back()}
          >
            Voltar
          </button>
        </form>
      </div>
    </div>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <RedefinirSenhaForm />
    </Suspense>
  );
}
