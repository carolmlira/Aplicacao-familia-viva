'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {  useParams } from 'next/navigation';
import "slick-carousel/slick/slick-theme.css";
import styles from './redeId.module.css';
import "slick-carousel/slick/slick.css";
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import Slider from "react-slick";

export default function Rede() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const [rede, setRede] = useState<Rede | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '', active: true });
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const fileInputs = useRef<HTMLInputElement[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const [category] = useState('pages');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false); 
  const [isMobile, setIsMobile] = useState(false);

  interface Rede {
    id: string;
    title: string;
    content: string;
    images: string[]; // URLs das imagens
    active: boolean;
  }
  interface RedeUpdate {
    title: string;
    content: string;
    images: string[]; // URLs das imagens
    active: boolean;
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };

    handleResize(); // define ao montar
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (typeof id === 'string') {
      fetchRede(id);
    }
  }, [id]);

  async function fetchRede(id: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/redes/${id}`);
      const data = await res.json();
      setRede(data);
      setFormData({ 
        title: data.title, 
        content: data.content, 
        active: data.active === 'true' || data.active === true,

      });

      // Se imagens não vierem do Firestore, usa o fallback do Storage
      if (Array.isArray(data.imageUrls) && data.imageUrls.length > 0) {
        setImageUrls(data.imageUrls);
      } 

    } catch (err) {
      console.error("Erro ao buscar rede:", err);
    } finally {
      setLoading(false);
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

  async function updateRede(id: string, redeData: RedeUpdate): Promise<void> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/redes/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(redeData, imageUrls),
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
      setImageUrls((prev) => prev.filter((url) => {
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

      for (const file of newImages) {
        const url = await uploadImage(file, id);
        uploadedUrls.push(url);
      }

      await updateRede(id, {
        ...formData,
        images: [...imageUrls, ...uploadedUrls],
        active: !!formData.active, 
      });

      // Atualiza imagens exibidas (não é enviado para backend)
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
  
  function moveImage(fromIndex: number, toIndex: number) {
    setImageUrls((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  }


  if (loading) return <div style={{ textAlign:"center" }}>Carregando...</div>;
  if (!rede) return <div style={{ textAlign: "center" }} >Rede não encontrado.</div>;

  return (
    <div className={`${editing ? "bg-neutral-800 my-8 mx-4 md:mx-32 p-4 rounded" : "p-4"}`}>
      {(session?.user)?.role === 'ADMIN' && (
        <div>
          <div className={styles.botaoEditar} onClick={() => setEditing(!editing)}>
            <Image
              src="/images/pen.svg"
              alt="Editar"
              width={20}
              height={20}
              className={styles.iconeEditar}
            />
            <span>Editar</span>
          </div>
        </div>
      )}
  
      {!editing && (
        <div className="my-4 space-y-4">
          <span className="text-3xl font-bold bg-gradient-to-r from-[#FE3012] via-[#FE6116] via-[#FE8719] via-[#FEA819] to-[#FEC31A] bg-clip-text text-transparent mt-8">
            {rede.title}
          </span>

          {/* LOGO (só se tiver imagem) */}
          {imageUrls.length > 0 && (
            <div className={styles.logoContainer}>
              <Image
                src={imageUrls[0]}
                alt="Logo da Rede"
                className={styles.logoImage}
              />
            </div>
          )}

          <div className="p-4 mx-auto text-justify max-w-5xl">
            {rede.content
              .split('\n')
              .filter((paragraph: string) => paragraph.trim() !== '')
              .map((paragraph: string, index: number) => (
                <p key={index} className="mb-4 indent-8">
                  {paragraph}
                </p>
              ))}
          </div>

          {/* CARROSSEL (se tiver + de uma imagem) */}
          {imageUrls.length > 1 && (
            <Slider
              dots={true}
              infinite={true}
              speed={500}
              slidesToShow={5}
              slidesToScroll={1}
              className={styles.carousel}
              responsive={[
                { breakpoint: 1024, settings: { slidesToShow: 2 } },
                { breakpoint: 640, settings: { slidesToShow: 1 } },
              ]}
            >
              {imageUrls.slice(1).map((url, index) => (
                <div key={index} className="px-2">
                  <div className="h-[200px] flex justify-center items-center overflow-hidden rounded shadow">
                    <Image
                      src={url}
                      alt={`Imagem ${index + 2}`}
                      className="object-cover w-full h-full rounded"
                    />
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </div>
      )}

      {editing ? (
        <div className={editing ? "bg-neutral-800 my-8 mx-4 md:mx-8 p-4 rounded" : "p-4"}>
          <h1 style={{ color:"orange", fontWeight:"bold", fontSize:"32px", textAlign:"center" }}>Edição da Rede:</h1>
          <label>Título:</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={formData.title}
            style={{ color:"black" }}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Título"
          />
          <label className='block my-2'>Conteúdo:</label>  
            <textarea
              className="w-full rounded-md border p-2"
              rows={10}
              style={{ color: "black" }}
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
            />
          <label style={{ display: "none" }}>
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
            <label className="block font-medium mb-1">Adicionar Imagens:</label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="mb-2"
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
              <div className="bg-neutral-900 p-4 rounded">
                {isMobile ? (
                  <Slider
                    dots
                    infinite
                    speed={500}
                    slidesToShow={1}
                    slidesToScroll={1}
                    className="my-4"
                  >
                    {previewImages.map((url, index) => (
                      <div key={index} className="px-2">
                        <div
                          className="h-[200px] flex justify-center items-center overflow-hidden rounded shadow"
                          style={{ width: 200, height: 200 }}
                        >
                          <Image
                            src={url}
                            alt={`Nova imagem ${index + 1}`}
                            className="object-contain w-full h-full"
                          />
                          <button
                            onClick={() => handleRemovePreviewImage(index)}
                            className="absolute top-1 right-1 p-1 bg-white rounded-full shadow"
                            aria-label="Remover imagem"
                          >
                            <Image src="/images/x.svg" alt="Remover" className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
                    {previewImages.map((url, index) => (
                      <div
                        key={index}
                        className="relative rounded shadow overflow-hidden"
                        style={{ width: 200, height: 200 }}
                      >
                        <Image
                          src={url}
                          alt={`Nova imagem ${index + 1}`}
                          className="w-full h-full object-contain"
                        />
                        <button
                          onClick={() => handleRemovePreviewImage(index)}
                          className="absolute top-1 right-1 p-1 bg-white rounded-full shadow"
                          aria-label="Remover imagem"
                        >
                          <Image src="/images/x.svg" alt="Remover" className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}


          </div>
          {imageUrls && imageUrls.length > 0 && (
            isMobile ? (
              <Slider
                dots
                infinite
                speed={500}
                slidesToShow={1}
                slidesToScroll={1}
                className="my-4"
              >
                {imageUrls.map((url, index) => (
                  <div key={index} className="px-2">
                    <div className="h-[200px] flex justify-center items-center overflow-hidden rounded shadow">
                      <Image
                        src={url}
                        alt={`Imagem ${index + 1}`}
                        className="object-contain w-full h-full rounded"
                        onClick={() => handleImageClick(index)}
                      />

                      {/* Substituir imagem */}
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        ref={(el) => {
                          if (el) fileInputs.current[index] = el;
                        }}
                        onChange={(e) => handleReplaceImage(e, index)}
                      />

                      {/* Botões de reorder */}
                      <div className="absolute bottom-1 left-1 flex gap-1">
                        {index > 0 && (
                          <button
                            onClick={() => moveImage(index, index - 1)}
                            className="p-1 rounded shadow bg-black"
                          >
                            <Image
                              src="/images/arrow-left-circle-fill.svg"
                              alt="Mover para esquerda"
                              className="w-6 h-6"
                              style={{ filter: 'invert(1)' }}
                            />
                          </button>
                        )}
                        {index < imageUrls.length - 1 && (
                          <button
                            onClick={() => moveImage(index, index + 1)}
                            className="p-1 rounded shadow bg-black"
                          >
                            <Image
                              src="/images/arrow-right-circle-fill.svg"
                              alt="Mover para direita"
                              className="w-6 h-6"
                              style={{ filter: 'invert(1)' }}
                            />
                          </button>
                        )}
                      </div>

                      {/* Remover imagem */}
                      <button
                        onClick={() => handleDeleteImage(index)}
                        className="absolute top-1 right-1 bg-red-600 p-1 rounded-full shadow"
                        aria-label="Remover imagem"
                      >
                        <Image src="/images/x.svg" alt="Remover" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 my-4">
                {imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative group rounded shadow bg-black-100 overflow-hidden"
                    style={{ width: 200, height: 200 }}
                  >
                    <Image
                      src={url}
                      alt={`Imagem ${index + 1}`}
                      className="w-full h-full object-contain cursor-pointer"
                      onClick={() => handleImageClick(index)}
                    />

                    {/* Substituir imagem */}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      ref={(el) => {
                        if (el) fileInputs.current[index] = el;
                      }}
                      onChange={(e) => handleReplaceImage(e, index)}
                    />

                    {/* Botões de reorder */}
                    <div className="absolute bottom-1 left-1 flex gap-1">
                      {index > 0 && (
                        <button
                          onClick={() => moveImage(index, index - 1)}
                          className="p-1 rounded shadow bg-black"
                        >
                          <Image
                            src="/images/arrow-left-circle-fill.svg"
                            alt="Mover para esquerda"
                            className="w-6 h-6"
                            style={{ filter: 'invert(1)' }}
                          />
                        </button>
                      )}
                      {index < imageUrls.length - 1 && (
                        <button
                          onClick={() => moveImage(index, index + 1)}
                          className="p-1 rounded shadow bg-black"
                        >
                          <Image
                            src="/images/arrow-right-circle-fill.svg"
                            alt="Mover para direita"
                            className="w-6 h-6"
                            style={{ filter: 'invert(1)' }}
                          />
                        </button>
                      )}
                    </div>

                    {/* Remover imagem */}
                    <button
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-1 right-1 bg-red-600 p-1 rounded-full shadow"
                      aria-label="Remover imagem"
                    >
                      <Image src="/images/x.svg" alt="Remover" className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )
          )}


          <button
            onClick={handleSave}
            className="bg-blue-600 text-white my-8 px-6 py-3 rounded hover:bg-blue-700"
          >
            Salvar
          </button>

          <button
            style={{ marginLeft: "10px" }}
            onClick={() => setEditing(false)}
            className="bg-red-600 text-white my-8 px-6 py-3 rounded hover:bg-red-700"
          >
            Cancelar
          </button>
        </div>
      ) : ( null)}
    </div>
    
  );
}
  