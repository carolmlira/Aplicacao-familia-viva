'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import "@/style/projects.css";

interface PagesProject {
  id: string;
  title: string;
  content: string;
  icon: string;
  active: boolean;
  imageUrl?: string;
}

export default function ProjectsList() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [category] = useState('projects');
  const [projects, setProjects] = useState<PagesProject[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || (session.user as any)?.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    fetchProjects();
  }, [session, status, router]);

  async function fetchProjects() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/pages?category=${category}`);
      const data = await res.json();
      const rawProjects: PagesProject[] = Array.isArray(data.pages) ? data.pages : [];

      const projectsWithImages = await Promise.all(
        rawProjects.map(async (project) => {
          if (!project.id) return project;

          try {
            const imageRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/firebase/pages/${category}/files?pageId=${project.id}`
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
  
      fetchProjects();
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

          {(session?.user as any)?.role === 'ADMIN' && (
            <button
              onClick={() => router.push('/projects/new')}
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
              href={`/projects/id/items/${project.id}`}
              className="block"
            >
              <div className="projeto-card">
                <div className="projeto-img">
                  <img
                    src={project.imageUrl || 'images/placeholder.svg'}
                    alt={project.title}
                  />
                </div>
                <div className="projeto-texto">
                  <h2>{project.title}</h2>
                  <p>
                    {project.content?.slice(0, 150)}
                    {project.content?.length > 150 && '...'}
                  </p>

                  {(session?.user as any)?.role === 'ADMIN' && (
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