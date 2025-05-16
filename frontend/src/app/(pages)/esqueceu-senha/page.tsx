"use client";

import Image from "next/image";
import styles from "./esqueceu-senha.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EsqueceuSenha() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(""); // Adiciona o estado de sucesso
  const [mensagemTempo, setMensagemTempo] = useState("");
  const [tempoRestante, setTempoRestante] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErro("");
    setSucesso("");
    setMensagemTempo("");
    if (tempoRestante > 0) {
      setErro(`Aguarde ${tempoRestante}s antes de tentar novamente.`);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErro(data.message || "Erro ao enviar e-mail");
        return;
      }
      setSucesso(
        "Link de recuperação enviado com sucesso! Verifique seu e-mail."
      );
      setTempoRestante(60);
    } catch (err) {
      console.error(err);
      setErro("Erro inesperado. Tente novamente.");
    }
  };

  useEffect(() => {
    if (tempoRestante <= 0) return;

    const timer = setInterval(() => {
      setTempoRestante((prev) => {
        const novoTempo = prev - 1;
        if (novoTempo <= 0) {
          setMensagemTempo(""); // Limpar mensagem quando o tempo acabar
        }
        return novoTempo;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [tempoRestante]);

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
        <h1 className={styles.titulo}>Recuperação da senha</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Seu e-mail"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className={styles.button}>
            Enviar link
          </button>
          {mensagemTempo && (
            <p style={{ color: "#999", marginTop: "8px" }}>{mensagemTempo}</p>
          )}
          {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}
          {erro && <p style={{ color: "red" }}>{erro}</p>}
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
