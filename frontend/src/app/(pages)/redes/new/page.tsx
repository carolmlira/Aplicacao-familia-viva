'use client'

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


export default function NewRede() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [imageFiles, setImageFiles] = useState<{ id: string; file: File;previewUrl: string }[] >([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    active: true,
    imageFiles: [] as File[],
  });

  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      const role = (session.user)?.role;
      if (role !== "ADMIN") {
        router.push("/");
      }
    }

  }, [session, status, router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleAddRede(e: React.FormEvent<HTMLFormElement>) {
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
  
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/redes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: data,
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Erro ao criar rede:', res.status, errorText);
        throw new Error('Erro ao criar rede');
      }
  
      const created = await res.json();
      console.log('rede criado com imagens:', created);
      router.push('/redes');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  
  const handleRemovePreviewImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      {/* Formulário */}
      <div className="max-w-3xl mx-auto mt-10 p-6  rounded shadow">
        <h1 style={{ fontSize:"36px", color:"orangered", textAlign:"center"}} className="text-2xl font-bold mb-4">Nova Rede</h1>
        <form onSubmit={handleAddRede} className="space-y-4">
          <div>
            <label className="block font-medium">Título:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              placeholder='Digite o título'
              style={{ color:"black", background:"rgb(231, 226, 226)" }}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
  
          <div>
            <label className="block font-medium">Conteúdo:</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={12}
              required
              placeholder="Digite o conteúdo"
              style={{ color:"black", background:"rgb(231, 226, 226)" }}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
  
          <div>
            <label className="block font-medium">Imagem (opcional): </label>
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
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imageFiles.map(({ id, previewUrl }, index) => (
                  <div key={id} className="relative w-full h-[150px] overflow-hidden rounded shadow">
                    <Image
                      src={previewUrl}
                      alt={`Preview ${id}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePreviewImage(index)}
                      className="absolute top-1 right-1 bg-white rounded-full shadow p-1"
                    >
                      <Image src="/images/x.svg" alt="Remover" width={10} height={10} className="w-4 h-4" />
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
            {loading ? 'Salvando...' : 'Criar Rede'}
          </button>
        </form>
      </div>
    </>
  ); 
}