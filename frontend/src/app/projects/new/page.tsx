'use client'

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Image from 'next/image';


export default function NewProject() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [category, setCategory] = useState('pages');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    active: true,
    imageFiles: [] as File[],
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
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('active', String(formData.active));
      data.append('icon', 'project');
      data.append('updatedBy', session?.user?.name || 'admin');
      data.append('createdAt', new Date().toISOString());
      data.append('updatedAt', new Date().toISOString());
  
      // Verifique se 'images' está undefined e substitua por um array vazio
      const images = formData.imageFiles.length > 0 ? formData.imageFiles : [];
      images.forEach((file) => {
        data.append('images', file); // O nome 'images' deve bater com o `@UploadedFiles()`
      });
  
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/projects`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${(session as any).accessToken}`,
        },
        body: data,
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Erro ao criar projeto:', res.status, errorText);
        throw new Error('Erro ao criar projeto');
      }
  
      const created = await res.json();
      console.log('Projeto criado com imagens:', created);
      router.push('/projects');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  
  // Atualize o handleUploadImage para receber o projectId:
  async function handleUploadImage(file: File, projectId: string, pageId: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
  
    const categoryWithId = `${category}/${pageId}/${projectId}`; // Exemplo: pages/abc123
  
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
    <>
      {/* Cabeçalho com botões de navegação */}
      <header className="mb-10 flex justify-center items-center px-4">
        <div className="flex gap-4">
          <Link href="/projects">
            <button className="flex items-left gap-2 bg-green-600 hover:bg-green-700 text-invert px-5 py-2 rounded-lg transition">
              <Image src="/images/seta-left.svg" alt="Voltar" width={16} height={16} />
            </button>
          </Link>
        </div>
      </header>
  
      {/* Formulário */}
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Nova Página</h1>
        <form onSubmit={handleAddProject} className="space-y-4">
          <div>
            <label className="block font-medium">Título</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
  
          <div>
            <label className="block font-medium">Conteúdo</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={5}
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
  
          <div>
            <label className="block font-medium">Imagem (opcional)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, imageFiles: Array.from(e.target.files || []) })}
            />

          </div>
  
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Criar Página'}
          </button>
        </form>
      </div>
    </>
  );
  
}
