import Image from "next/image";
import styles from "../rede-jovem/jovem.module.css"; // Importando o CSS

export default function Jovens() {
  return (
    <div className={styles.jovens}>
      {/* Título */}
      <div className={styles.tituloJovens}>
        <h1>Rede Jovens</h1>
      </div>

      {/* Logo */}
      <div className={styles.logoJovens}>
        <Image
          src="/rede-jovem.png"
          alt="Rede jovens Logo"
          width={300}
          height={300}
        />
      </div>

      {/* Texto */}
      <div className={styles.textoJovens}>
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
      <div className={styles.jovensImages}>
        <Image src="/jovens_1.png" alt="Foto 1" width={300} height={200} />
        <Image src="/jovens_2.png" alt="Foto 2" width={300} height={200} />
        <Image src="/jovens_3.png" alt="Foto 3" width={300} height={200} />
      </div>
    </div>
  );
}
