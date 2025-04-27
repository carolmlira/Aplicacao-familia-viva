import styles from "../home/home.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>



      {/* Banner principal da home */}
      <div className="relative w-full h-[400px] overflow-hidden">
        <Image
          src="/banner.svg"
          alt="Banner de fundo"
          fill
          className={styles.banner}
        />
        <div className={styles.logoPrincipal}>
          <Image
            src="/familiaVIVA.svg"
            alt="Logo principal"
            width={700}
            height={200}
          />
          <h1>Um Lugar de Adoração ao Deus Vivo</h1>
        </div>
      </div>



{/* Sobre a igreja */}
<div className={styles.sobre} id="sobre">
  <h2>Quem somos?</h2>
  <div className={styles.conteudoSobre}>
    <p>        Lorem Ipsumis simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.lore
    </p>
    <Image
      src="/sobre.svg"
      alt="Sobre a igreja"
      className={styles.sobreImagem}
      width={600}
      height={200}
    />
  </div>
</div>


      {/* Programação */}
      <div className={styles.programacao}>
        <h2>Nossa Programação</h2>
        <div className={styles.botoesDias}>
          <Link href="/cultos" className={styles.dias}>Terça-feira</Link>
          <Link href="/cultos" className={styles.dias}>Quarta e quinta</Link>
          <Link href="/cultos" className={styles.dias}>Sexta-feira</Link>
          <Link href="/cultos" className={styles.dias}>Domingo</Link>
        </div>
      </div>



      {/* Projetos */}
      <div className={styles.projetos}>
        <h2>Projetos</h2>
        <Link className={styles.linkProjeto} href="/projeto">Ver mais</Link>
        <div className={styles.sobreProjetos}>
          <h3>Arrecadação de alimentos</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam
            mollitia illo quo nam doloribus quod sit, sequi qui id repellendus
            consectetur quidem. Pariatur explicabo nam fuga, laboriosam
            architecto magnam ut.
          </p>
        </div>
        <div className={styles.sobreProjetos}>
          <h3>Arrecadação de roupas</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam
            mollitia illo quo nam doloribus quod sit, sequi qui id repellendus
            consectetur quidem. Pariatur explicabo nam fuga, laboriosam
            architecto magnam ut.
          </p>
        </div>
      </div>



      {/* Galeria */}
      <div className={styles.galeria}>
        <h2>Galeria</h2>
        <Link href="/galeria">Ver mais</Link>
      </div>
    </>
  );
}
