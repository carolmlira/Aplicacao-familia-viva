// header.tsx
import Link from "next/link";
import Image from "next/image";
import styles from "./header.module.css";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();
  const role = session?.user?.role; // Assumindo que o role está disponível no user
  if (status === "loading") return "Carregando...";

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" width={80} height={100} />
        </Link>
        <ul className={styles["nav-menu"]}>
          <li className={styles["nav-item"]}>
            <Link href="/">Home</Link>
          </li>
          <li className={styles["nav-item"]}>
            <Link href="/home#sobre">Sobre</Link>
          </li>
          <li className={styles["nav-item"]}>
            <Link href="/projeto">Projetos</Link>
          </li>
          <li className={styles["nav-item"]}>
            <Link href="/redes">Redes</Link>
          </li>

          <li className={styles["nav-item"]}>
            <a
              href="https://maps.app.goo.gl/QQSbdw2sD8LH5sAk8"
              target="_blank"
              rel="noopener noreferrer"
            >
              Localização
            </a>
          </li>
          <li className={styles["nav-item"]}>
            <a
              href="https://www.instagram.com/familia_vivarecife/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contato
            </a>
          </li>

          {/* Galeria visível para ADMIN e COMUNIC */}
          {(role === "ADMIN" || role === "COMUNIC") && (
            <li className={styles["nav-item"]}>
              <Link href="/galeria">Galeria</Link>
            </li>
          )}

          {/* Escala visível para ADMIN, COMUNIC, VOLUNT, USER */}
          {["ADMIN", "COMUNIC", "VOLUNT", "USER"].includes(role ?? "") && (
            <li className={styles["nav-item"]}>
              <Link href="/escala">Escalas</Link>
            </li>
          )}

          {/* Usuários visível só para ADMIN */}
          {role === "ADMIN" && (
            <li className={styles["nav-item"]}>
              <Link href="/usuarios">Usuários</Link>
            </li>
          )}

          <li>
            {session ? (
              <div>
                <button onClick={() => signOut()} className={styles.botaoLogin}>
                  Sair
                </button>
                <p className={styles.nomeLogin}>{session.user?.name}</p>
              </div>
            ) : (
              <Link href="/login" className={styles.botaoLogin}>
                Login
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
