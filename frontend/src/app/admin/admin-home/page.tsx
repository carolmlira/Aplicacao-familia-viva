import styles from "../admin-home/admin-home.module.css";
import { AiOutlineCaretLeft } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function Admin() {
  return (
    <>
      {/* Banner principal da home */}
      <FaRegEdit className={`${styles.iconEdit} ${styles.iconBanner}`} />
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
      <FaRegEdit className={`${styles.iconEdit} ${styles.iconSobre}`} />
        <h2>Quem somos?</h2>
        <div className={styles.conteudoSobre}>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industrys standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularized in the 1960s with
            the release of Letraset sheets containing Lorem Ipsum passages, and
            more recently with desktop publishing software like Aldus PageMaker
            including versions of Lorem Ipsum.
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
        <div className={styles.projetoCard}>
          <Image
            src="/projeto.svg"
            alt="Fotos do projeto"
            className={styles.fotoProjeto}
            width={200}
            height={200}
          />
          <div className={styles.projetoDescricao}>
            <h3>Arrecadação de alimentos</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam
              mollitia illo quo nam doloribus quod sit, sequi qui id repellendus
              consectetur quidem. Pariatur explicabo nam fuga, laboriosam
              architecto magnam ut.
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente maiores quo obcaecati exercitationem, repellendus dignissimos nobis deleniti aspernatur nemo vitae dolorem aliquid minima molestiae nisi? Porro, optio. Neque, cupiditate quae.
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam tenetur maiores corrupti vitae dicta nisi veniam rem mollitia nulla! Et commodi voluptatibus non sit debitis, laudantium veniam assumenda beatae nihil.
            </p>
          </div>
        </div>

        <div className={styles.projetoCard}>
          <Image
            src="/projeto.svg"
            alt="Fotos do projeto"
            className={styles.fotoProjeto}
            width={200}
            height={200}
          />
          <div className={styles.projetoDescricao}>
            <h3>Arrecadação de roupas</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam
              mollitia illo quo nam doloribus quod sit, sequi qui id repellendus
              consectetur quidem. Pariatur explicabo nam fuga, laboriosam
              architecto magnam ut.
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Adipisci non ratione quo accusantium, vitae fugit, ea nihil deleniti laboriosam ut dolorem, minus architecto dolorum consectetur magnam officiis enim dignissimos accusamus.
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui soluta, dignissimos recusandae pariatur corrupti reprehenderit repudiandae voluptatem numquam mollitia ad, provident eaque possimus? Provident repudiandae dolor rerum unde, quo recusandae?
            </p>
          </div>
        </div>
      </div>

      {/* Galeria */}
      <div className={styles.galeria}>
        <h2>Galeria</h2>
        <Link className={styles.linkGaleria} href="/galeria">Ver mais</Link>
        <div className={styles.cultosImages}>
        <AiOutlineCaretLeft className={styles.icon} />
          <Image src="/Culto_1.png" alt="Culto 1" width={300} height={200} />
          <Image src="/Culto_2.png" alt="Culto 2" width={300} height={200} />
          <Image src="/Culto_3.png" alt="Culto 3" width={300} height={200} />
          <Image src="/Culto_4.png" alt="Culto 3" width={300} height={200} />
          <AiOutlineCaretLeft className={`${styles.icon} ${styles.iconInvert}`} />
        </div>
      </div>
    </>
  );
} 