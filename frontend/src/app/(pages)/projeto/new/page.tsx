'use client'

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


export default function NewProject() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [imageFiles, setImageFiles] = useState<{ id: string; file: File;previewUrl: string }[] >([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [category, setCategory] = useState('pages');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    active: true,
    imageFiles: [] as File[],
  });

  useEffect(() => {
    if (status === "loading") return;

    // Se o usuário estiver logado, mas não tiver permissão, redireciona
    if (session) {
      const role = (session.user as any)?.role;
      if (role !== "ADMIN") {
        router.push("/");
      }
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
  
      const images = imageFiles.length > 0 ? imageFiles : [];
      images.forEach(({ file }) => {
        data.append('images', file);
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
      router.push('/projeto');
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
  const handleRemovePreviewImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
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
              onChange={(e) => {
                const files = Array.from(e.target.files || []);

                const filesWithIds = files.map(file => ({
                  id: crypto.randomUUID(),
                  file,
                  previewUrl: URL.createObjectURL(file),
                }));

                setImageFiles(prev => [...prev, ...filesWithIds]);
              }}
            />
            {imageFiles.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {imageFiles.map(({ id, previewUrl }, index) => (
                  <div key={id} className="relative">
                    <Image
                      src={previewUrl}
                      alt={`Preview ${id}`}
                      width={150}
                      height={150}
                      className="object-cover rounded shadow"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePreviewImage(index)}
                      className="absolute top-1 right-1 bg-white rounded-full shadow p-1"
                    >
                      <img src="/images/x.svg" alt="Remover" className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>           
            )}
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
