'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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

  const [category, setCategory] = useState('projects');
  const [projects, setProjects] = useState<PagesProject[]>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as any).role !== "ADMIN") {
      router.push("/");
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
            const imageRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/pages/files?pageId=${project.id}`);
            const imageData = await imageRes.json();
      
            // Usa a primeira imagem da lista, ou nenhuma se estiver vazia
            const imageUrl = Array.isArray(imageData.files) && imageData.files.length > 0
              ? imageData.files[0]
              : undefined;
      
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/projects/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Erro ao deletar projeto');

      // Atualizar a lista após deletar
      fetchProjects();
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projetos</h1>

        {/* Botão Novo Projeto - Apenas para ADMIN */}
        {(session?.user as any)?.role === 'ADMIN' && (
          <button
            onClick={() => router.push('/projects/new')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Novo Projeto
          </button>
        )}
      </div>
      {projects.length === 0 ? (
        <p className="text-gray-500">Nenhum projeto encontrado.</p>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="border rounded-lg p-4 hover:shadow-lg flex flex-col justify-between">
            <div>
              <Link href={`/projects/id/items/${project.id}`}>
                <img
                  src={project.imageUrl || '/placeholder.svg'}
                  alt={project.title}
                  className="w-full h-40 object-cover mb-4"
                />
                <h2 className="text-xl font-semibold">{project.title}</h2>
              </Link>
            </div>

            {/* Botão Excluir - Apenas para ADMIN */}
            {(session?.user as any)?.role === 'ADMIN' && (
              <button
                onClick={() => deleteProject(project.id)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                disabled={loading}
              >
                {loading ? 'Excluindo...' : 'Excluir'}
              </button>
            )}
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
