'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';


export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false); 
  const [formData, setFormData] = useState({ title: '', content: '', active: true });
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const fileInputs = useRef<HTMLInputElement[]>([]);

  const [category] = useState('pages');

  
  useEffect(() => {
    if (typeof id === 'string') {
      fetchProject(id);
      fetchProjectImage(id);
    }
  }, [id]);

  async function fetchProject(id: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/projects/${id}`);
      const data = await res.json();
      setProject(data);
      setFormData({ title: data.title, content: data.content, active: data.active === 'true' || data.active === true}); // pré-carrega os dados no form
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
      if (Array.isArray(data.files)) {
        setImageUrls(data.files); // Agora salva como array de URLs
      }
    } catch (err) {
      console.error("Erro ao buscar imagem do projeto:", err);
    }
  }

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
  
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/upload?pageId=${id}&category=${category}`, {
      method: 'POST',
      body: formData,
    });
  
    if (!response.ok) throw new Error('Erro no upload da imagem');
    const data = await response.json();
    return data.url;
  }
  

  async function updateProject(id: string, projectData: any): Promise<void> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/projects/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
  
    console.log('Update response body:', await response.text());
  
    if (!response.ok) {
      throw new Error('Erro ao atualizar o projeto');
    }
  }
  
  
  const handleSave = async () => {
    setLoading(true);
  
    try {
      const uploadedUrls: string[] = [];
  
      for (const file of newImages) {
        const url = await uploadImage(file); // função que retorna a URL do Firebase
        uploadedUrls.push(url);
      }
  
      await updateProject(id, {
        ...formData,
        images: [...imageUrls, ...uploadedUrls],
      });
  
      setImageUrls((prev) => [...prev, ...uploadedUrls]);
      setNewImages([]);
      setEditing(false);
    } catch (err) {
      console.error("Erro ao atualizar projeto:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (index: number) => {
    console.log("Clicou na imagem", index);
    const inputElement = fileInputs.current[index];
    if (inputElement) {
      inputElement.click(); // Isso deve abrir o seletor
    } else {
      console.log("Input não encontrado no índice", index);
    }
  };
  
  
  const handleReplaceImage = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    try {
      const url = await uploadImage(file);
      setImageUrls((prev) => {
        const updated = [...prev];
        updated[index] = url; // Substitui a URL da imagem na posição correta
        return updated;
      });
    } catch (err) {
      console.error("Erro ao substituir imagem:", err);
    }
  };
  

  if (loading) return <div>Carregando...</div>;
  if (!project) return <div>Projeto não encontrado.</div>;

return (
    <div className="p-4">
      {(session?.user as any)?.role === 'ADMIN' && (
        <div className="flex items-center space-x-2">
          <img
            src="/images/pencil-square.svg"
            alt="Editar"
            className="w-5 h-5 invert cursor-pointer"
            onClick={() => setEditing(!editing)}
          />
          <h1 className="text-xl font-bold">{project.title}</h1>
        </div>
      )}
  
      {!editing && (
        <>
          {imageUrls && imageUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-4">
              {imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Imagem ${index + 1}`}
                  className="w-full rounded shadow object-cover"
                />
              ))}
            </div>
          )}
        </>
      )}
  
      {editing ? (
        <div className="mt-4 space-y-2">
          <input
            type="text"
            className="border p-2 w-full"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Título"
          />
  
          <textarea
            className="border p-2 w-full"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            placeholder="Conteúdo"
            rows={6}
          />
          <label>
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) =>
                setFormData({ ...formData, active: e.target.checked })
              }
            />
            Página ativa
          </label>
  
          {imageUrls && imageUrls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-4">
            {(() => { fileInputs.current = []; return null })()} {/* <- Limpa os refs */}


            {imageUrls.map((url, index) => {
              const imageId = url.split('/').pop()?.split('.')[0];
              return (
                <div key={imageId} className="relative group">
                  <img
                    src={url}
                    alt={`Imagem ${index + 1}`}
                    className="w-full rounded shadow object-cover cursor-pointer"
                    onClick={() => handleImageClick(index)} // chama o input click
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={(el) => {
                      if (el) fileInputs.current[index] = el;
                    }}
                    
                    onChange={(e) => handleReplaceImage(e, index)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm pointer-events-none">
                    Clique para substituir
                  </div>

                </div>
              );
            })}
          </div>
        )}

          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      ) : (
        <p className="mt-4">{project.content}</p>
      )}
    </div>
  );
}
  
