'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import "@/style/projects.css";

interface PagesProject {
  id: string;
  title: string;
  content: string;
  icon: string;
  active: boolean;
  imageUrl?: string;
  imageUrls?: string[];
}

export default function ProjectsList() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const category = 'pages';
  const [projects, setProjects] = useState<PagesProject[]>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (status === "loading") return;

    // Se o usuário estiver logado, mas não tiver permissão, redireciona
    if (session) {
      const role = (session.user)?.role;
      if (role !== "ADMIN") {
        router.push("/");
      }
    }
  }, [session, status, router]);

  useEffect(() => {
    async function fetchProjects() {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/pages?category=projects`);
          const data = await res.json();
          const rawProjects: PagesProject[] = Array.isArray(data.pages) ? data.pages : [];

          const projectsWithImages = rawProjects.map((project) => {
            const imageUrl =
              Array.isArray(project.imageUrls) && project.imageUrls.length > 0
                ? project.imageUrls[0]
                : undefined;

            return { ...project, imageUrl };
          });

          setProjects(projectsWithImages);
        } catch (error) {
          console.error('Erro ao buscar projetos:', error);
        }
      }

    fetchProjects(); // <-- aqui chamamos a função ao montar
  }, [category]);


  async function deleteProject(id: string) {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;
  
    try {
      setLoading(true);
  
      // Deleta pasta de imagens no storage
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/delete-folder?category=pages&subgrup=projects&pageId=${id}`, {
        method: 'DELETE',
      });
  
      // Deleta o projeto no banco
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/projects/${id}`, {
        method: 'DELETE',
      });
  
      if (!res.ok) throw new Error('Erro ao deletar projeto');
  
      } catch (error) {
      console.error('Erro ao excluir projeto:', error);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="projetos-container">
      <div className="projetos-header">
        <div className="flex justify-between items-center mb-6 w-full">
          <h1 className="text-2xl font-bold text-left mr-4">
            <span className="bg-gradient-to-r from-[#FE3012] via-[#FE6116] via-[#FE8719] via-[#FEA819] to-[#FEC31A] bg-clip-text text-transparent">
              Projetos
            </span>
          </h1>

          {(session?.user)?.role === 'ADMIN' && (
            <button
              onClick={() => router.push('/projeto/new')}
              className="ml-auto bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Novo Projeto
            </button>
          )}
        </div>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-400 text-center">Nenhum projeto encontrado.</p>
      ) : (
        <div className="projetos-content">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projeto/id/items/${project.id}`}
              className="block"
            >
              <div className="projeto-card">
                <div className="projeto-img">
                  <Image
                    src={project.imageUrl || 'images/placeholder.svg'}
                    alt={project.title}
                    width={250}
                    height={250}
                  />
                </div>
                <div className="projeto-texto">
                  <h2 style={{ color:"#FFA500" }}>{project.title}</h2>
                  <p>
                    {project.content?.slice(0, 150)}
                    {project.content?.length > 150 && '...'}
                  </p>

                  {(session?.user)?.role === 'ADMIN' && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteProject(project.id);
                      }}
                      className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      disabled={loading}
                    >
                      {loading ? 'Excluindo...' : 'Excluir'}
                    </button>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>

  );
}