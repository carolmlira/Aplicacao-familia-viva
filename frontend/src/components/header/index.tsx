// header.tsx
import Link from "next/link";
import Image from "next/image";
import styles from "./header.module.css";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();
  const role = session?.user?.role; // Assumindo que o role está disponível no user
  if (status === "loading") return "";
  function scrollToFooter() {
    const footer = document.getElementById("footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  }

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
            <Link href="/#sobre">Sobre</Link>
          </li>
          <li className={styles["nav-item"]}>
            <Link href="/#programacao">Cultos</Link>
          </li>
          <li className={styles["nav-item"]}>
            <Link href="/projeto">Projetos</Link>
          </li>
          <li className={styles["nav-item"]}>
            <div className={styles.dropdown}>
              <Link href="/redes" className={styles["nav-link"]}>
                Redes
              </Link>
              <ul className={styles["dropdown-menu"]}>
                <li>
                  <Link href="/redes/rede-kids">Rede Kids</Link>
                </li>
                <li>
                  <Link href="/redes/rede-mulheres">Rede de Mulheres</Link>
                </li>
                <li>
                  <Link href="/redes/rede-jovem">Rede de Jovens</Link>
                </li>
              </ul>
            </div>
          </li>

          <li className={styles["nav-item"]}>
            <Link href="/galeria">Galeria</Link>
          </li>

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
          <li className={styles["nav-item"]}>
            <button onClick={scrollToFooter} className={styles["nav-link"]}>
              Localização
            </button>
          </li>
          <li className={styles["nav-item"]}>
            <button onClick={scrollToFooter} className={styles["nav-link"]}>
              Contato
            </button>
          </li>
        </ul>

        <div className={styles["login-container"]}>
          {session ? (
            <>
              <button onClick={() => signOut()} className={styles.botaoLogin}>
                Sair
              </button>
              <p className={styles.nomeLogin}>{session.user?.name}</p>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.botaoLogin}>
                Login
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
