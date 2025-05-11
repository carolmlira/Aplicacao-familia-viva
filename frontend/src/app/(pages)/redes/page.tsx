"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "../redes/rede.module.css";

export default function Redes() {
  return (
    <div className={styles.redes}>
      <h2>Redes</h2>

      {/* Rede Kids */}
      <div className={styles.redesCard}>
        <Image
          src="/rede-kids.png"
          alt="Fotos das redes"
          className={styles.fotoRede}
          width={200}
          height={200}
        />
        <div className={styles.redesDescricao}>
          <h3>Rede Kids</h3>
          <Link className={styles.linkRede} href="/redes/rede-kids">Ver mais</Link>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam
            mollitia illo quo nam doloribus quod sit, sequi qui id repellendus
            consectetur quidem. Pariatur explicabo nam fuga, laboriosam
            architecto magnam ut. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Sapiente maiores quo obcaecati exercitationem,
            repellendus dignissimos nobis deleniti aspernatur nemo vitae dolorem
            aliquid minima molestiae nisi? Porro, optio. Neque, cupiditate quae.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam tenetur
            maiores corrupti vitae dicta nisi veniam rem mollitia nulla! Et
            commodi voluptatibus non sit debitis, laudantium veniam assumenda
            beatae nihil.
          </p>
        </div>
      </div>

      {/* Rede Jovem */}
      <div className={styles.redesCard}>
        <Image
          src="/rede-jovem.png"
          alt="Fotos das redes"
          className={styles.fotoRedes}
          width={300}
          height={300}
        />
        <div className={styles.redesDescricao}>
          <h3>Rede Jovem</h3>
          <Link className={styles.linkRede} href="/redes/rede-jovem">Ver mais</Link>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam
            mollitia illo quo nam doloribus quod sit, sequi qui id repellendus
            consectetur quidem. Pariatur explicabo nam fuga, laboriosam
            architecto magnam ut. Lorem ipsum dolor sit amet consectetur,
            adipisicing elit. Adipisci non ratione quo accusantium, vitae fugit,
            ea nihil deleniti laboriosam ut dolorem, minus architecto dolorum
            consectetur magnam officiis enim dignissimos accusamus. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Qui soluta, dignissimos
            recusandae pariatur corrupti reprehenderit repudiandae voluptatem
            numquam mollitia ad, provident eaque possimus? Provident repudiandae
            dolor rerum unde, quo recusandae?
          </p>
        </div>
      </div>

      {/* Rede Mulheres */}
      <div className={styles.redesCard}>
        <Image
          src="/rede-mulheres.png"
          alt="Fotos das redes"
          className={styles.fotoRedes}
          width={250}
          height={200}
        />
        <div className={styles.redesDescricao}>
          <h3>Rede Mulheres</h3>
          <Link className={styles.linkRede} href="/redes/rede-mulheres">Ver mais</Link>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam
            mollitia illo quo nam doloribus quod sit, sequi qui id repellendus
            consectetur quidem. Pariatur explicabo nam fuga, laboriosam
            architecto magnam ut. Lorem ipsum dolor sit amet consectetur,
            adipisicing elit. Adipisci non ratione quo accusantium, vitae fugit,
            ea nihil deleniti laboriosam ut dolorem, minus architecto dolorum
            consectetur magnam officiis enim dignissimos accusamus. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Qui soluta, dignissimos
            recusandae pariatur corrupti reprehenderit repudiandae voluptatem
            numquam mollitia ad, provident eaque possimus? Provident repudiandae
            dolor rerum unde, quo recusandae?
          </p>
        </div>
      </div>
    </div>
  );
}
