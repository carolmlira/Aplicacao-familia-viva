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
            width={85}
            height={100}
          ></Image>
        </Link>
        <ul className={styles["nav-menu"]}>
          <li className={styles["nav-item"]} id="home">
            <Link href="/home">Home</Link>
          </li>
          <li className={styles["nav-item"]}>
            <Link href="#sobre">Sobre</Link>
          </li>
          <li className={styles["nav-item"]}>
            <Link href="/cultos">Cultos</Link>
          </li>
          <li className={styles["nav-item"]}>
            <Link href="/projeto">Projetos</Link>
          </li>
          <li className={styles["nav-item"]}>
            <Link href="/redes">Redes</Link>
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
            <Link href="/" className={styles.botaoLogin}>
              Login
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
