"use client";

import Image from "next/image";
import styles from "../esqueceu-senha/esqueceu-senha.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EsqueceuSenha() {
  const [etapa, setEtapa] = useState(1);
  const router = useRouter();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEtapa(2);
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Senha redefinida com sucesso!");
  };
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
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
      <div className={styles.formBox}>
        {etapa === 1 ? (
          <>
            <h1 className={styles.titulo}>Recuperação da senha</h1>
            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                placeholder="Seu e-mail"
                className={styles.input}
                required
              />
              <button type="submit" className={styles.button}>
                Próximo
              </button>
              <button
                type="button"
                className={styles.buttonVoltar}
                onClick={() => router.back()}
              >
                Voltar
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className={styles.titulo}>Redefinir senha</h1>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                placeholder="Nova senha"
                className={styles.input}
                required
              />
              <input
                type="password"
                placeholder="Confirmar nova senha"
                className={styles.input}
                required
              />
              <p>* A senha deve conter no mínimo 6 caracteres</p>
              <button type="submit" className={styles.button}>
                Redefinir
              </button>
              <button
                type="button"
                className={styles.buttonVoltar}
                onClick={() => setEtapa(1)}
              >
                Voltar
              </button>

            </form>
          </>
        )}
      </div>
    </div>
  );
}
