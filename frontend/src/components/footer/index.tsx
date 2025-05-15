import { useEffect, useState } from "react";
import { GrLocation } from "react-icons/gr";
import { FaInstagram } from "react-icons/fa";
import styles from "./footer.module.css";
import Image from "next/image";

type FooterData = {
  contato:string;
  localizacao: string;
};

export function Footer() {
  const [isMobile, setIsMobile] = useState(false);
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FooterData>({
    contato: "",
    localizacao: "",
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Buscar dados do footer
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/footer`)
      .then((res) => res.json())
      .then((data) => setFooterData(data))
      .catch((err) => console.error("Erro ao buscar footer:", err));
  }, []);

  // Atualizar dados (exemplo: PATCH)
  const updateFooter = async (data: Partial<FooterData>) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/footer`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const updated = await res.json();
      setFooterData(updated);
      setShowModal(false); // fecha o modal
    } catch (err) {
      console.error("Erro ao atualizar footer:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFooter(formData);
  };

  return (
    <footer id="footer" className={styles.footer}>
      <nav className={`${styles.footerbar} ${isMobile ? styles.mobile : ""}`}>
        <ul className={styles["footer-menu"]}>
          <li className={styles.contato}>
            <h1>Contato</h1>
            <div className={styles.info}>
              <a
                className={styles.info}
                href={`https://www.instagram.com/${footerData?.contato || "Não informado"}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className={styles.icon} />
                {footerData?.contato || "Não informado"}
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
                {footerData?.localizacao || "Não informado"}
              </a>
              
            </div>
            
          </li>
        </ul>
        {/* Botão para abrir o modal */}
        <button
          className={styles.editButton}
          onClick={() => setShowModal(true)}
        >
          <Image
            src="/images/pen.svg"
            alt="Editar"
            width={20}
            height={20}
            className={styles.iconeEditar}
          />
          <span>Editar</span>
        </button>
      </nav>
      {/* Modal de edição */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Editar Footer</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Instagram:
                <input
                  type="text"
                  name="contato"
                  value={formData.contato}
                  onChange={handleChange}
                />
              </label>
              <label>
                Localização:
                <input
                  type="text"
                  name="localizacao"
                  value={formData.localizacao}
                  onChange={handleChange}
                />
              </label>
              <div className={styles.modalActions}>
                <button type="submit">Salvar</button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={styles.cancelButton}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
}
