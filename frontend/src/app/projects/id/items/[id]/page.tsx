'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';


export default function Page() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: session, status } = useSession();
  const [project, setProject] = useState<any | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '', active: true });
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const fileInputs = useRef<HTMLInputElement[]>([]);

  const [category] = useState('pages');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false); 

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
      setFormData({ title: data.title, content: data.content, active: data.active === 'true' || data.active === true});
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
        setImageUrls(data.files); // Salva como array de URLs
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
  async function updateImage(file: File, imageId: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
  
    const newName = `${uuidv4()}.png`; // Corrigido: interpolação dentro de string template
  
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/firebase/update?category=pages&filename=${imageId}.png&newName=${newName}&pageId=${id}`,
      {
        method: 'PUT',
        body: formData,
      }
    );
  
    if (!response.ok) throw new Error('Erro ao atualizar a imagem');
    const data = await response.json();
    return data.url;
  }
  
  async function uploadNewImage(file: File): Promise<string> {
    const imageId = uuidv4();
    const formData = new FormData();
    formData.append('file', file);
  
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/upload?category=pages&filename=${imageId}.png&pageId=${id}`,
      {
        method: 'POST',
        body: formData,
      }
    );
  
    if (!response.ok) throw new Error('Erro no upload da nova imagem');
    const data = await response.json();
    return data.url;
  }

  const deleteImage = async (category: string, pageId: string, imageId: string) => {
    // Se o nome da imagem é o id + ".png", então:
    const filename = `${imageId}.png`;
  
    // Construa os parâmetros de consulta corretamente:
    const params = new URLSearchParams({
      category,       // "pages"
      pageId,         // O id da página
      filename,       // "8b8b6ed6-1ee5-4cff-84ff-dfac621eaf46.png"
    });
  
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/firebase/delete?${params.toString()}`,
        { method: 'DELETE' }
      );
  
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ao deletar imagem: ${errorText}`);
      }
  
      const data = await res.json();
      console.log('Imagem deletada com sucesso:', data);
  
      // Atualiza o estado para remover a imagem da lista
      setImageUrls((prev) => prev.filter((url, i) => {
        // Você pode comparar o filename que aparece na URL com o que foi deletado
        return !url.includes(filename);
      }));
    } catch (err) {
      console.error('Erro ao deletar imagem:', err);
    }
  };
  
  
  
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
  const handleDeleteImage = async (index: number) => {
    const imageUrl = imageUrls[index];
    if (!imageUrl) return;
  
    try {
      // Extrair o nome do arquivo da URL
      const urlParts = imageUrl.split('/');
      const filenameWithToken = urlParts[urlParts.length - 1];
      const filename = filenameWithToken.split('?')[0]; // Remove qualquer query string
      const filenameWithoutExtension = filename.split('.')[0]; // Remove extensão .png ou outra
      const confirmed = window.confirm('Tem certeza que deseja excluir esta imagem?');
      if (confirmed) {
        await deleteImage(category, id, filenameWithoutExtension);
      }
  
      // Atualizar estado removendo a imagem
      setImageUrls((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error('Erro ao deletar imagem:', err);
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
          <div className="mt-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setNewImages((prev) => [...prev, e.target.files![0]]);
                }
              }}
            />
          </div>
  
          {imageUrls && imageUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Imagem ${index + 1}`}
                    className="w-full rounded shadow object-cover cursor-pointer"
                    onClick={() => handleImageClick(index)}
                  />
                  
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={(el) => {
                      if (el) fileInputs.current[index] = el;
                    }}
                    onChange={(e) => handleReplaceImage(e, index)}
                  />
                  
                  <button
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                  >
                    ✕
                  </button>
                </div>
              ))}
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
  
