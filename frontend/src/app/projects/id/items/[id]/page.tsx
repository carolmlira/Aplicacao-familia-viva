'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false); // <-- modo de edição
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [newImage, setNewImage] = useState<File | null>(null);


  useEffect(() => {
    if (id) {
      fetchProject(id);
      fetchProjectImage(id);
    }
  }, [id]);

  async function fetchProject(id: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/projects/${id}`);
      const data = await res.json();
      setProject(data);
      setFormData({ title: data.title, content: data.content }); // pré-carrega os dados no form
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

  async function handleSave() {
    try {
      // Atualiza texto
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const updated = await res.json();
      setProject(updated);
  
      // Upload nova imagem
      if (newImage) {
        const newFilename = `${uuidv4()}-${newImage.name}`;
        const formData = new FormData();
        formData.append('file', newImage);
        formData.append('filename', newFilename);
  
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/upload?category=pages&pageId=${id}`, {
          method: 'POST',
          body: formData,
        });
  
        // Opcional: excluir imagem antiga
        if (imageUrl) {
          const oldFilename = imageUrl.split('/').pop()?.split('?')[0];
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/delete?category=pages&pageId=${id}&filename=${oldFilename}`, {
            method: 'DELETE',
          });
        }
  
        // Recarrega imagem atualizada
        await fetchProjectImage(id);
        setNewImage(null);
      }
  
      setEditing(false);
    } catch (err) {
      console.error("Erro ao atualizar projeto:", err);
    }
  }
  
  

  if (loading) return <div>Carregando...</div>;
  if (!project) return <div>Projeto não encontrado.</div>;

  return (
    <div className="p-4">
      <div className="flex items-center space-x-2">
        <img
          src="/pencil-square.svg"
          alt="Editar"
          className="w-5 h-5 invert cursor-pointer"
          onClick={() => setEditing(!editing)}
        />
        <h1 className="text-xl font-bold">{project.title}</h1>
      </div>

      {imageUrl && (
        <img
          src={imageUrl}
          alt={project.title}
          className="my-4 w-full max-w-md rounded shadow"
        />
      )}

      {editing ? (
        <div className="mt-4 space-y-2">
          <input
            type="text"
            className="border p-2 w-full"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Título"
          />
          <textarea
            className="border p-2 w-full"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Conteúdo"
            rows={6}
          />
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Salvar
          </button>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setNewImage(e.target.files[0]);
              }
            }}
            className="block mt-2"
          />

        </div>
      ) : (
        <p className="mt-4">{project.content}</p>
      )}
    </div>
  );
}
