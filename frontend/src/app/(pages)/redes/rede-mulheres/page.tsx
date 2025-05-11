"use client";

import Image from "next/image";
import styles from "../rede-mulheres/mulheres.module.css"; // Importando o CSS

export default function Mulheres() {
  return (
    <div className={styles.mulheres}>
      {/* Título */}
      <div className={styles.tituloMulher}>
        <h1>Rede Mulheres</h1>
      </div>

      {/* Logo */}
      <div className={styles.logoMulher}>
        <Image 
          src="/rede-mulheres.png" 
          alt="Rede Mulheres Logo" 
          width={300} 
          height={300} 
        />
      </div>

      {/* Texto */}
      <div className={styles.textoMulher}>
        <p>
          Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem
          Ipsum has been the industrys standard dummy text ever since the 1500s, when an
          unknown printer took a galley of type and scrambled it to make a type specimen
          book.
        </p>
        <p>
          It has survived not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged. It was popularised in the 1960s.
        </p>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
          Ipsum has been the industrys standard dummy text ever since the 1500s.
        </p>
      </div>

      {/* Galeria de imagens */}
      <div className={styles.mulheresImages}>
        <Image src="/mulheres_1.png" alt="Foto 1" width={300} height={200} />
        <Image src="/mulheres_2.png" alt="Foto 2" width={300} height={200} />
        <Image src="/mulheres_3.png" alt="Foto 3" width={300} height={200} />
      </div>
    </div>
  );
}

