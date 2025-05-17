import { useEffect, useState } from "react";
import { GrLocation } from "react-icons/gr";
import { FaInstagram } from "react-icons/fa";
import styles from "./footer.module.css";

export function Footer() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <footer id="footer" className={styles.footer}>
      <nav className={`${styles.footerbar} ${isMobile ? styles.mobile : ""}`}>
        <ul className={styles["footer-menu"]}>
          <li className={styles.contato}>
            <h1>Contato</h1>
            <div className={styles.info}>
              <a
                className={styles.info}
                href="https://www.instagram.com/familia_vivarecife/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className={styles.icon} />
                familia_vivarecife
              </a>
            </div>
          </li>

          <li className={styles.localizacao}>
            <h1>Localização</h1>
            <div className={styles.info}>
              <a
                className={styles.info}
                href="https://maps.app.goo.gl/QQSbdw2sD8LH5sAk8"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GrLocation className={styles.icon} />
                Av. Afonso Olindense, 1045 - Várzea, Recife - PE, 50810-000
              </a>
            </div>
          </li>
        </ul>
      </nav>
    </footer>
  );
}