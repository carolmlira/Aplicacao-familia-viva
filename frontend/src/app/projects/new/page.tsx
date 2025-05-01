'use client'

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


export default function NewProject() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [category, setCategory] = useState('pages');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    active: true,
    imageFile: null as File | null, // Arquivo de imagem
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || (session.user as any).role !== 'ADMIN') {
      router.push('/');
    }
  }, [session, status, router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleAddProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
  
    try {
      // 1. Primeiro cria o projeto SEM a imagem
      const newProject = {
        title: formData.title,
        content: formData.content,
        active: formData.active,
        icon: 'project',
        updatedBy: session?.user?.name || 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
  
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/projects`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(session as any).accessToken}`,
        },
        body: JSON.stringify(newProject),
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Erro ao criar projeto:', res.status, errorText);
        throw new Error('Erro ao criar projeto');
      }
  
      const project = await res.json();
      console.log('Projeto criado:', project);
  
      // 2. Agora que tem o project.id, faz upload da imagem no caminho certo
      if (formData.imageFile) {
        const imageUrl = await handleUploadImage(formData.imageFile, project.id);
  
        // 3. Atualiza o projeto com a imagem
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/projects/${project.id}/image`, {
          method: 'PATCH',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(session as any).accessToken}`,
          },
          body: JSON.stringify({ imageUrl }),
        });
      }
  
      router.push('/projects');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  
  // Atualize o handleUploadImage para receber o projectId:
  async function handleUploadImage(file: File, projectId: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
  
    const categoryWithId = `${category}/${projectId}`; // Exemplo: pages/abc123
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/upload?category=${categoryWithId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${(session as any).accessToken}`,
      },
      body: formData,
    });
  
    if (!res.ok) {
      throw new Error('Erro ao fazer upload da imagem');
    }
  
    const data = await res.json();
    return data.url;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Novo Projeto</h1>

      <form onSubmit={handleAddProject} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">Título</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border text-black p-2 rounded"
              placeholder="Título do Projeto"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Imagem (arquivo)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFormData(prev => ({ ...prev, imageFile: file }));
                }
              }}
              className="w-full border text-black p-2 rounded"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-semibold">Conteúdo</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              className="w-full border text-black p-2 rounded"
              placeholder="Conteúdo do Projeto"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, active: e.target.checked }))
              }
              className="mr-2"
            />
            <label className="text-black font-medium">Ativo</label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {loading ? "Salvando..." : "Salvar Projeto"}
        </button>
      </form>
    </div>
  );
}
