import Link from "next/link";
import Image from "next/image";
import styles from "./header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={80}
            height={100}
          />
        </Link>
        <ul className={styles["nav-menu"]}>
          <li className={styles["nav-item"]} id="home">
            <Link href="/home">Home</Link>
          </li>
          <li className={styles["nav-item"]}>
            <Link href="/home#sobre">Sobre</Link>
          </li>
          <li className={styles["nav-item"]}>
            <Link href="/galeria#galeria">Cultos</Link>
          </li>
          <li className={styles["nav-item"]}>
            <Link href="/projeto">Projetos</Link>
          </li>
          <li className={styles["nav-item"]}>
            <div className={styles.dropdown}>
              <Link href="/Redes" className={styles["nav-link"]}>
                Redes
              </Link>
              <ul className={styles["dropdown-menu"]}>
                <li><Link href="/redes/rede-kids">Rede Kids</Link></li>
                <li><Link href="/redes/rede-mulheres">Rede de Mulheres</Link></li>
                <li><Link href="/redes/rede-jovens">Rede de Jovens</Link></li>
              </ul>
            </div>
          </li>
          <li className={styles["nav-item"]}>
            <Link href="/galeria">Galeria</Link>
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
          <li>
            <Link href="/login" className={styles.botaoLogin}>
              Login
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
