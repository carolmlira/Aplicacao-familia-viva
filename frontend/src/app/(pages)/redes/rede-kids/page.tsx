"use client";
import Image from "next/image";
import styles from "../rede-kids/kids.module.css"; // Importando o CSS
import { useSession } from "next-auth/react";
import { MdOutlineModeEdit } from "react-icons/md";

export default function Kids() {
  const { data: session } = useSession();

  const userRole = session?.user?.role;
  const podeEditar = userRole === "ADMIN" || userRole === "COMUNIC";

  return (
    <div className={styles.kids}>
      {/* Título */}
      <div className={styles.tituloKids}>
        <h1>Kids</h1>
      </div>

      {podeEditar && (
        <button className={styles.botaoEdit}>
          <MdOutlineModeEdit
            className={`${styles.icon} ${styles.iconCultos}`}
          />
          Editar
        </button>
      )}

      {/* Logo */}
      <div className={styles.logoKids}>
        <Image
          src="/kids_logo.png"
          alt="Rede Kids Logo"
          width={300}
          height={300}
        />
      </div>

      {/* Texto */}
      <div className={styles.textoKids}>
        <p>
          Lorem ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industrys standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </p>
        <p>
          It has survived not only five centuries, but also the leap into
          electronic typesetting, remaining essentially unchanged. It was
          popularised in the 1960s.
        </p>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industrys standard dummy text ever
          since the 1500s.
        </p>
      </div>

      {/* Galeria de imagens */}
      <div className={styles.kidsImages}>
        <Image src="/kids_1.png" alt="Foto 1" width={300} height={200} />
        <Image src="/kids_2.png" alt="Foto 2" width={300} height={200} />
        <Image src="/Kids_3.png" alt="Foto 3" width={300} height={200} />
      </div>
    </div>
  );
}
