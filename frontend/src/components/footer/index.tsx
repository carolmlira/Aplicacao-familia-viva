import { GrLocation } from "react-icons/gr";
import { FaInstagram } from "react-icons/fa";
import styles from "./footer.module.css";

export function Footer(){
    return(
        <footer className={styles.footer}>
            <nav className={styles.footerbar}>
            <ul className={styles["footer-menu"]}>
            <li className={styles.contato}>
                <h1>
                    Contato
                </h1>
                <FaInstagram className={styles.icon}/>
            <a
              href="https://www.instagram.com/familia_vivarecife/"
              target="_blank"
              rel="noopener noreferrer"
            >
              familia_vivarecife
            </a>
          </li>

          <li className={styles.localizacao}>
            <h1>Localização</h1>
            <GrLocation className={styles.icon}/>
            <a
              href="https://maps.app.goo.gl/QQSbdw2sD8LH5sAk8"
              target="_blank"
              rel="noopener noreferrer"
            > Av. Afonso Olindense, 1045 - Várzea, Recife - PE, 50810-000
            </a>
          </li>
          </ul>
          </nav>

        </footer>
    )
}