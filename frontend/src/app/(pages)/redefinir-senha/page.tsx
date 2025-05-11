"use client";

import Image from "next/image";
import styles from "./redefinir-senha.module.css";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RedefinirSenha() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      router.replace("/"); // ou "/login", ou exiba uma página de erro
    }
  }, [token]);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (novaSenha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password: novaSenha,
          }),
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
          <p>* A senha deve conter no mínimo 6 caracteres</p>
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
