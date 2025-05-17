'use client';

import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import styles from './projetoId.module.css';
import { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const [project, setProject] = useState<any | null>(null);
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
      fetchProjeto(id);
      //fetchProjectImage(id);
    }
  }, [id]);

  async function fetchProjeto(id: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/projetos/${id}`);
      const data = await res.json();
      setProject(data);
      setFormData({ 
        title: data.title, 
        content: data.content, 
        active: data.active === 'true' || data.active === true 
      });

      // Se as imagens vierem do Firestore (array de URLs)
      if (Array.isArray(data.imageUrls) && data.imageUrls.length > 0) {
        setImageUrls(data.imageUrls);
      }

    } catch (err) {
      console.error("Erro ao buscar projeto:", err);
    } finally {
      setLoading(false);
    }
  }

  async function uploadImage(file: File, pageId: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
  
    const categoryWithId = `pages/projetos/${pageId}`;
  
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

  async function updateProjeto(id: string, projetoData: any): Promise<void> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/projetos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projetoData),
    });
  
    if (!response.ok) {
      throw new Error('Erro ao atualizar o projeto');
    }
  }

  const updateImage = async (file: File, imageId: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const cleanImageId = imageId.replace(/\.png$/, '');
    const newName = `${uuidv4()}.png`;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/update?category=pages&subgrup=projetos&filename=${cleanImageId}.png&newName=${newName}&pageId=${id}`,
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
      subgrup: 'projetos',
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

      setImageUrls((prev) => prev.filter((url, i) => {
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
        const url = await uploadImage(file, id); 
        uploadedUrls.push(url);
      }

      const updatedImageUrls = [...imageUrls, ...uploadedUrls];

      await updateProjeto(id, {
        ...formData,
        active: String(formData.active),
        images: [...imageUrls, ...uploadedUrls],
      });

      setImageUrls(updatedImageUrls);
      setNewImages([]);
      setEditing(false);

    } catch (err) {
      console.error("Erro ao atualizar projeto:", err);
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

  const handleReplaceImage = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = imageUrls[index];
      const imageId = imageUrl.split('/').pop()?.split('?')[0];
      let updatedUrl: string;

      if (imageId) {
        updatedUrl = await updateImage(file, imageId);
      } else {
        updatedUrl = await uploadImage(file, id);
      }

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
      const urlParts = imageUrl.split('/');
      const filenameWithToken = urlParts[urlParts.length - 1];
      const filename = filenameWithToken.split('?')[0]; 
      const filenameWithoutExtension = filename.split('.')[0];
      const confirmed = window.confirm('Tem certeza que deseja excluir esta imagem?');
      if (confirmed) {
        await deleteImage(category, id, filenameWithoutExtension);
      }

      setImageUrls((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error('Erro ao deletar imagem:', err);
    }
  };

  const handleRemovePreviewImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };
  
  function moveImage(fromIndex: number, toIndex: number) {
    setImageUrls((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  }

  if (loading) return <div style={{ textAlign: "center" }}>Carregando...</div>;
  if (!project) return <div>Projeto não encontrado.</div>;

  return (
    <div className="p-4">
      {/* Título e botão de edição para ADMIN */}
      {(session?.user as any)?.role === 'ADMIN' ? (
       <div>
          <div className={styles.botaoEditar} onClick={() => setEditing(!editing)}>
            <img
              src="/images/pen.svg"
              alt="Editar"
              width={20}
              height={20}
              className={styles.iconeEditar}
            />
            <span>Editar</span>
          </div>
        </div>
      ) : (
        <h1 className="text-xl font-bold">{project.title}</h1>
      )}

      {/* Conteúdo modo visualização */}
      {!editing && (
        <>
          {imageUrls?.length > 0 && (
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

          <div className="p-4 mx-auto text-justify max-w-5xl">
            {project.content
              .split('\n')
              .filter((paragraph: string) => paragraph.trim() !== '')
              .map((paragraph: string, index: number) => (
                <p key={index} className="mb-4 indent-8">
                  {paragraph}
                </p>
              ))}
          </div>
        </>
      )}

      {/* Conteúdo modo edição */}
      {editing && (
        <div className="mt-4 space-y-4">
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
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            placeholder="Conteúdo"
            rows={6}
          />

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) =>
                setFormData({ ...formData, active: e.target.checked })
              }
            />
            <span>Página ativa</span>
          </label>

          {/* Upload de novas imagens */}
          <div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  const filesArray = Array.from(e.target.files);
                  setNewImages((prev) => [...prev, ...filesArray]);
                  const previews = filesArray.map((file) =>
                    URL.createObjectURL(file)
                  );
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
                      alt={`Preview ${index + 1}`}
                      className="w-full rounded shadow object-cover"
                    />
                    <button
                      onClick={() => handleRemovePreviewImage(index)}
                      className="absolute top-1 right-1 p-1 bg-white rounded-full shadow"
                    >
                      <img
                        src="/images/x.svg"
                        alt="Remover"
                        className="w-4 h-4"
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Imagens existentes com botões de mover, substituir e deletar */}
          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Imagem ${index + 1}`}
                    className="w-full rounded shadow object-cover cursor-pointer"
                    onClick={() => handleImageClick(index)}
                  />

                  <div className="flex justify-between mt-1">
                    <button
                      disabled={index === 0}
                      onClick={() => moveImage(index, index - 1)}
                      className="px-2 py-1 bg-gray-300 rounded disabled:opacity-50"
                    >
                      ←
                    </button>
                    <button
                      disabled={index === imageUrls.length - 1}
                      onClick={() => moveImage(index, index + 1)}
                      className="px-2 py-1 bg-gray-300 rounded disabled:opacity-50"
                    >
                      →
                    </button>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    hidden
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
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
          >
            Salvar
          </button>
        </div>
      )}
    </div>
  );
}
