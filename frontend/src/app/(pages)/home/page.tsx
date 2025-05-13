"use client";

import styles from "../home/home.module.css";
import { AiOutlineCaretLeft } from "react-icons/ai";
import { useEffect, useState } from 'react';
import { PagesProject } from "@/app/types/PageProjects";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [projects, setProjects] = useState<PagesProject[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);
  
  async function fetchProjects() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/pages?category=projects`);
      const data = await res.json();
      console.log("Pages API response:", data);
      const rawProjects: PagesProject[] = Array.isArray(data.pages) ? data.pages : [];

      const projectsWithImages = await Promise.all(
        rawProjects.map(async (project) => {
          if (!project.id) return project;

          try {
            const imageRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/firebase/pages/projects/files?pageId=${project.id}`
            );
            const imageData = await imageRes.json();
            const imageUrl =
              Array.isArray(imageData.files) && imageData.files.length > 0 ? imageData.files[0] : undefined;

            return { ...project, imageUrl };
          } catch (err) {
            console.warn(`Erro ao buscar imagem de ${project.title}:`, err);
            return { ...project };
          }
        })
      );

      setProjects(projectsWithImages);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
    }
  }


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
          <div className={styles.tooltip}>
            <Link href="/programacao" className={styles.dias}>Terça-feira</Link>
            <div className={styles.tooltipText}>
              <p><strong>Culto de Ensino</strong></p>
              <p> 19h</p>
              <p>Igreja Família Viva</p>
            </div>
          </div>
          <div className={styles.tooltip}>
            <Link href="/programacao" className={styles.dias}>Quarta e quinta</Link>
            <div className={styles.tooltipText}>
              <p><strong>Programação:</strong></p>
              <p> Ensaio do grupo</p>
              <p> Reunião de liderança</p>
            </div>
          </div>
          <div className={styles.tooltip}>
            <Link href="/cultos" className={styles.dias}>Sexta-feira</Link>
            <div className={styles.tooltipText}>
              <p><strong>Culto da Juventude</strong></p>
              <p>Louvor jovem</p>
              <p>19h30</p>
            </div>
          </div>
          <div className={styles.tooltip}>
            <Link href="/cultos" className={styles.dias}>Domingo</Link>
            <div className={styles.tooltipText}>
              <p><strong>Culto da Família</strong></p>
              <p>Ministério Infantil</p>
              <p>18h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Projetos */}
      <div className={styles.projetos}>
        <div className={styles.projetosHeader}>
          <h1>Projetos</h1>
          <Link className={styles.linkProjeto} href="/projeto">Ver mais</Link>
        </div>

        {projects.length === 0 ? (
          <p className="text-gray-400 text-center">Nenhum projeto encontrado.</p>
        ) : (
          <div className={styles.projetosContent}>
            {projects.slice(0, 2).map((project) => (
              <Link
                key={project.id}
                href={`/projeto/${project.id}`}
                className={styles.projetoCard}
              >
                <div className={styles.projetoImg}>
                  <Image
                    src={project.imageUrl || '/images/placeholder.svg'}
                    alt={project.title}
                    width={200}
                    height={200}
                    className={styles.fotoProjeto}
                  />
                </div>
                  <div className={styles.projetoTexto}>
                    <h2>{project.title}</h2>
                    <p>
                      {project.content?.slice(0, 150)}
                      {project.content?.length > 150 && '...'}
                    </p>
                  </div>
              </Link>
            ))}
          </div>
        )}
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
          <Image src="/Culto_4.png" alt="Culto 4" width={300} height={200} />
          <AiOutlineCaretLeft className={`${styles.icon} ${styles.iconInvert}`} />
        </div>
      </div>
    </>
  );
}
