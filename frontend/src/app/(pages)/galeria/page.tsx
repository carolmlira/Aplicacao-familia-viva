import styles from "../galeria/galeria.module.css";
import Image from "next/image"; // Importando o componente Image para carregar as imagens de forma otimizada

export default function Galeria() {
  return (
    <div className={styles.galeria}>
      {/* Galeria */}
      <div className={styles.tituloGaleria}>
        
      </div>

      {/* Cultos */}
      <div className={styles.tituloCultos}>
        <h2>Cultos</h2>
        <div className={styles.cultosImages}>
          <Image src="/Culto_1.png" alt="Culto 1" width={300} height={200} />
          <Image src="/Culto_2.png" alt="Culto 2" width={300} height={200} />
          <Image src="/Culto_3.png" alt="Culto 3" width={300} height={200} />
          <Image src="/Culto_4.png" alt="Culto 3" width={300} height={200} />
          <Image src="/Culto_5.png" alt="Culto 3" width={300} height={200} />
        </div>
      </div>

      {/* Redes */}
      <div className={styles.tituloRedes}>
        <h2>Redes</h2>
        <div className={styles.redesImages}>
          <Image src="/kids_1.png" alt="Rede 1" width={300} height={200} />
          <Image src="/kids_2.png" alt="Rede 2" width={300} height={200} />
          <Image src="/kids_3.png" alt="Rede 3" width={300} height={200} />
        </div>
      </div>
    </div>
  );
}
