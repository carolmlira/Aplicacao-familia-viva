'use client'

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      console.log("Buscando projeto com ID:", id);
      fetchProject(id);
      fetchProjectImage(id); // ⬅️ Adicionamos essa chamada
    }
  }, [id]);

  async function fetchProject(id: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/projects/${id}`);
      const data = await res.json();
      console.log("Projeto carregado:", data);
      setProject(data);
    } catch (err) {
      console.error("Erro ao buscar projeto:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProjectImage(id: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/pages/files?pageId=${id}`);
      const data = await res.json();

      if (Array.isArray(data.files) && data.files.length > 0) {
        setImageUrl(data.files[0]);
      }
    } catch (err) {
      console.error("Erro ao buscar imagem do projeto:", err);
    }
  }

  if (loading) return <div>Carregando...</div>;
  if (!project) return <div>Projeto não encontrado.</div>;

  return (
    <div className="p-4">
      <div className="flex items-center space-x-2">
        <img src="/pencil-square.svg" alt="Editar" className="w-5 h-5 invert" />
        <h1 className="text-xl font-bold">{project.title}</h1>
      </div>

      {imageUrl && (
        <img
          src={imageUrl}
          alt={project.title}
          className="my-4 w-full max-w-md rounded shadow"
        />
      )}

      <p>{project.content}</p>
    </div>
  );
}
