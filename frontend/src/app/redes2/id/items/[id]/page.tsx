'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function Rede() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: session, status } = useSession();
  const [rede, setRede] = useState<any | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '', active: true });
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const fileInputs = useRef<HTMLInputElement[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const [category] = useState('pages');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false); 

  useEffect(() => {
    if (typeof id === 'string') {
      fetchRede(id);
      fetchRedeImage(id);
    }
  }, [id]);

  async function fetchRede(id: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/redes/${id}`);
      const data = await res.json();
      setRede(data);
      setFormData({ title: data.title, content: data.content, active: data.active === 'true' || data.active === true});
    } catch (err) {
      console.error("Erro ao buscar rede:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRedeImage(id: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/pages/redes/files?pageId=${id}`);
      const data = await res.json();
      if (Array.isArray(data.files)) {
        setImageUrls(data.files); 
      }
    } catch (err) {
      console.error("Erro ao buscar imagem desta rede:", err);
    }
  }

  async function uploadImage(file: File, pageId: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
  
    const categoryWithId = `pages/redes/${pageId}`;
  
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/firebase/upload?category=${encodeURIComponent(categoryWithId)}`,
      {
        method: 'POST',
        body: formData,
      }
    );
    if (!response.ok) throw new Error('Erro no upload da imagem');
    const data = await response.json();
    return data.url;
  }

  async function updateRede(id: string, redeData: any): Promise<void> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/redes/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(redeData),
    });
  
    console.log('Update response body:', await response.text());
  
    if (!response.ok) {
      throw new Error('Erro ao atualizar a rede');
    }
  }
  // Função para substituir a imagem no Firebase Storage (usando PUT)
  const updateImage = async (file: File, imageId: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const cleanImageId = imageId.replace(/\.png$/, '');
    const newName = `${uuidv4()}.png`;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/update?category=pages&subgrup=redes&filename=${cleanImageId}.png&newName=${newName}&pageId=${id}`,
      {
        method: 'PUT',
        body: formData,
      }
    );

    if (!response.ok) throw new Error('Erro ao atualizar a imagem');
    const data = await response.json();
    return data.url;
  };

  const deleteImage = async (category: string, pageId: string, imageId: string) => {
    const filename = `${imageId}.png`;
    const params = new URLSearchParams({
      category,      
      subgrup: 'redes',
      pageId,        
      filename,       
    });
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/delete?${params.toString()}`,
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
        return !url.includes(filename);
      }));
    } catch (err) {
      console.error('Erro ao deletar imagem:', err);
    }
  };

  // Função para salvar as imagens e os dados
  const handleSave = async () => {
    setLoading(true);

    try {
      const uploadedUrls: string[] = [];

      // Faz o upload das novas imagens se houverem
      for (const file of newImages) {
        const url = await uploadImage(file, id); 
        uploadedUrls.push(url);
      }

      await updateRede(id, {
        ...formData,
        active: String(formData.active),
        images: [...imageUrls, ...uploadedUrls],
      });

      // Atualiza o estado com as URLs de imagem
      setImageUrls((prev) => [...prev, ...uploadedUrls]);

      setNewImages([]);
      
      setEditing(false);
    } catch (err) {
      console.error("Erro ao atualizar rede:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (index: number) => {
    const inputElement = fileInputs.current[index];
    if (inputElement) {
      inputElement.click(); 
    } else {
      console.log("Input não encontrado no índice", index);
    }
  };
  
  // Função para substituir a imagem na interface
  const handleReplaceImage = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Se estivermos substituindo uma imagem existente, usaremos o `updateImage`
      const imageUrl = imageUrls[index];
      const imageId = imageUrl.split('/').pop()?.split('?')[0];
      let updatedUrl: string;

      if (imageId) {
        // Atualiza a imagem existente
        updatedUrl = await updateImage(file, imageId);
      } else {
        // Se não encontrarmos um ID, consideramos como nova imagem e fazemos upload
        updatedUrl = await uploadImage(file, id);
      }

      // Atualiza a URL da imagem no estado
      setImageUrls((prev) => {
        const updated = [...prev];
        updated[index] = `${updatedUrl}?t=${Date.now()}`
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
      const filename = filenameWithToken.split('?')[0]; 
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

  const handleRemovePreviewImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };
  
  // Função para mover a imagem para cima
  /*const moveImageUp = (index: number) => {
    if (index === 0) return; // Não mover se já estiver na primeira posição
    const newImageUrls = [...imageUrls];
    const temp = newImageUrls[index];
    newImageUrls[index] = newImageUrls[index - 1];
    newImageUrls[index - 1] = temp;
    setImageUrls(newImageUrls);
  };

  // Função para mover a imagem para baixo
  const moveImageDown = (index: number) => {
    if (index === imageUrls.length - 1) return; // Não mover se já estiver na última posição
    const newImageUrls = [...imageUrls];
    const temp = newImageUrls[index];
    newImageUrls[index] = newImageUrls[index + 1];
    newImageUrls[index + 1] = temp;
    setImageUrls(newImageUrls);
  };*/

  if (loading) return <div>Carregando...</div>;
  if (!rede) return <div>Rede não encontrado.</div>;

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
          <h1 className="text-xl font-bold">{rede.title}</h1>
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
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  const filesArray = Array.from(e.target.files);
                  setNewImages((prev) => [...prev, ...filesArray]);

                  // Gera previews
                  const previews = filesArray.map((file) => URL.createObjectURL(file));
                  setPreviewImages((prev) => [...prev, ...previews]);
                }
              }}
            />
            {previewImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-4">
                {previewImages.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Nova imagem ${index + 1}`}
                      className="w-full rounded shadow object-cover"
                    />
                    <button
                      onClick={() => handleRemovePreviewImage(index)}
                      className="absolute top-1 right-1 p-1 bg-white rounded-full shadow"
                    >
                      <img src="/images/x.svg" alt="Remover" className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
        <p className="mt-4">{rede.content}</p>
      )}
    </div>
  );
}
  