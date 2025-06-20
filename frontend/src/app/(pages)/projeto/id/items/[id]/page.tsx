"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import "slick-carousel/slick/slick-theme.css";
import styles from "./projetoId.module.css";
import "slick-carousel/slick/slick.css";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import Slider from "react-slick";

export default function Projeto() {
  const rawParams = useParams();
  const id = typeof rawParams?.id === "string" ? rawParams.id : undefined;
  const { data: session } = useSession();
  const [project, setProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    active: true,
  });
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const fileInputs = useRef<HTMLInputElement[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const [category] = useState("pages");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  interface Project {
    id: string;
    title: string;
    content: string;
    images: string[]; // URLs das imagens
    active: boolean;
  }

  interface ProjectUpdate {
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
    if (typeof id === "string") {
      fetchProject(id);
    }
  }, [id]);

  async function fetchProject(id: string) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pages/projects/${id}`
      );
      const data = await res.json();
      setProject(data);
      setFormData({
        title: data.title,
        content: data.content,
        active: data.active === "true" || data.active === true,
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

  async function uploadImage(files: File[], pageId: string): Promise<string[]> {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const categoryWithId = `pages/projects/${pageId}`;

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/firebase/upload-gallery?category=${encodeURIComponent(
          categoryWithId
        )}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            "Erro no upload da imagem - Status: " + response.status
        );
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        return data.map((item: { url: string }) => item.url);
      }
      return [data.url];
    } catch (error) {
      console.error("Erro no uploadImage:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Falha ao fazer upload da imagem"
      );
    }
  }

  async function updateProject(
    id: string,
    projectData: ProjectUpdate
  ): Promise<void> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pages/projects/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(projectData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            "Erro ao atualizar projeto - Status: " + response.status
        );
      }
    } catch (error) {
      console.error("Erro no updateProject:", error);
      throw new Error(
        error instanceof Error ? error.message : "Falha ao atualizar o projeto"
      );
    }
  }
  // Função para substituir a imagem no Firebase Storage (usando PUT)
  const updateImage = async (
    files: File[],
    imageId: string
  ): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const cleanImageId = imageId.replace(/\.png$/, "");
        const newName = `${uuidv4()}.png`;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/firebase/update?category=pages&subgrup=projects&filename=${cleanImageId}.png&newName=${newName}&pageId=${id}`,
          {
            method: "PUT",
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              "Erro ao atualizar imagem - Status: " + response.status
          );
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
      }

      return uploadedUrls;
    } catch (error) {
      console.error("Erro no updateImage:", error);
      throw new Error(
        error instanceof Error ? error.message : "Falha ao atualizar a imagem"
      );
    }
  };

  const deleteImage = async (
    category: string,
    pageId: string,
    imageId: string
  ) => {
    const filename = `${imageId}.png`;
    const params = new URLSearchParams({
      category,
      subgrup: "projects",
      pageId,
      filename,
    });

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/firebase/delete?${params.toString()}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ao deletar imagem: ${errorText}`);
      }

      const data = await res.json();
      console.log("Imagem deletada com sucesso:", data);

      // Atualiza o estado para remover a imagem da lista
      setImageUrls((prev) =>
        prev.filter((url) => {
          return !url.includes(filename);
        })
      );
    } catch (err) {
      console.error("Erro ao deletar imagem:", err);
    }
  };

  // Função para salvar as imagens e os dados
  const handleSave = async () => {
    if (!id) {
      console.error("ID do projeto está indefinido.");
      return;
    }
    setLoading(true);

    try {
      let uploadedUrls: string[] = [];

      if (newImages.length > 0) {
        // Faz upload de todas as imagens de uma vez
        uploadedUrls = await uploadImage(newImages, id);
      }

      // Prepara os dados para atualização
      const updateData: ProjectUpdate = {
        title: formData.title,
        content: formData.content,
        images: [...imageUrls, ...uploadedUrls],
        active: formData.active,
      };

      console.log("Enviando para atualização:", updateData); // Para debug

      await updateProject(id, updateData);

      // Atualiza estados locais
      setImageUrls((prev) => [...prev, ...uploadedUrls]);
      setNewImages([]);
      setPreviewImages([]);
      setEditing(false);
    } catch (err) {
      console.error("Erro ao atualizar projeto:", err);
      // Adicione feedback visual para o usuário
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
  const handleReplaceImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const fileArray = Array.from(files);
      const imageUrl = imageUrls[index];
      const imageId = imageUrl.split("/").pop()?.split("?")[0];

      if (!id) {
        console.error("ID do projeto está indefinido.");
        return;
      }

      let updatedUrl: string;

      if (imageId) {
        // Atualiza a imagem existente - updateImage retorna string[]
        const [firstUrl] = await updateImage(fileArray, imageId); // Pega a primeira URL do array
        updatedUrl = firstUrl;
      } else {
        // Faz upload como nova imagem - uploadImage retorna string[]
        const [firstUrl] = await uploadImage(fileArray, id); // Pega a primeira URL do array
        updatedUrl = firstUrl;
      }

      // Atualiza a URL da imagem no estado
      setImageUrls((prev) => {
        const updated = [...prev];
        updated[index] = `${updatedUrl}?t=${Date.now()}`;
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
      const urlParts = imageUrl.split("/");
      const filenameWithToken = urlParts[urlParts.length - 1];
      const filename = filenameWithToken.split("?")[0];
      const filenameWithoutExtension = filename.split(".")[0]; // Remove extensão .png ou outra
      const confirmed = window.confirm(
        "Tem certeza que deseja excluir esta imagem?"
      );

      if (!id) {
        console.error("ID do projeto está indefinido.");
        return;
      }
      if (confirmed) {
        await deleteImage(category, id, filenameWithoutExtension);
      }

      // Atualizar estado removendo a imagem
      setImageUrls((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Erro ao deletar imagem:", err);
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
  if (!project)
    return <div style={{ textAlign: "center" }}>Projeto não encontrado.</div>;

  return (
    <div
      className={`${
        editing ? "bg-neutral-800 my-8 mx-4 md:mx-32 p-4 rounded" : "p-4"
      }`}
    >
      {session?.user?.role === "ADMIN" && (
        <div>
          <div
            className={styles.botaoEditar}
            onClick={() => setEditing(!editing)}
          >
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

      {/* VISUALIZAÇÃO */}
      {!editing && (
        <div className="my-4 space-y-4">
          <span className="text-3xl font-bold bg-gradient-to-r from-[#FE3012] via-[#FE6116] via-[#FE8719] via-[#FEA819] to-[#FEC31A] bg-clip-text text-transparent mt-8">
            {project.title}
          </span>

          {/* Imagem principal (primeira da lista) */}
          {imageUrls.length > 0 && (
            <div className={styles.logoContainer}>
              <Image
                src={imageUrls[0]}
                alt="Imagem principal do projeto"
                className={styles.logoImage}
                width={250}
                height={250}
              />
            </div>
          )}

          {/* Texto com parágrafos */}
          <div className="p-4 mx-auto text-justify max-w-5xl">
            {project.content
              .split("\n")
              .filter((paragraph: string) => paragraph.trim() !== "")
              .map((paragraph: string, index: number) => (
                <p key={index} className="mb-4 indent-8">
                  {paragraph}
                </p>
              ))}
          </div>

          {/* Carrossel com imagens adicionais */}
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
                      width={250}
                      height={250}
                    />
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </div>
      )}

      {/* EDIÇÃO */}
      {editing && (
        <div className="mt-4 space-y-2">
          <h1
            style={{
              color: "orange",
              fontWeight: "bold",
              fontSize: "32px",
              textAlign: "center",
            }}
          >
            Edição do Projeto:
          </h1>
          <label>Título:</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={formData.title}
            style={{ color: "black" }}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Título"
          />
          <label className="block my-2">Conteúdo:</label>
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

          {/* Upload de novas imagens */}
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
                  const previews = filesArray.map((file) =>
                    URL.createObjectURL(file)
                  );
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
                          className="h-[200px] flex justify-center items-center overflow-hidden rounded shadow bg-black-100"
                          style={{ width: 200, height: 200 }}
                        >
                          <Image
                            src={url}
                            alt={`Nova imagem ${index + 1}`}
                            className="object-contain w-full h-full"
                            width={250}
                            height={250}
                          />
                          <button
                            onClick={() => handleRemovePreviewImage(index)}
                            className="absolute top-1 right-1 p-1 bg-white rounded-full shadow"
                            aria-label="Remover imagem"
                          >
                            <Image
                              src="/images/x.svg"
                              alt="Remover"
                              className="w-4 h-4"
                              width={10}
                              height={10}
                            />
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
                        className="relative rounded shadow bg-black-100 overflow-hidden"
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
                          <Image
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
            )}
          </div>

          {/* Imagens existentes */}
          {imageUrls &&
            imageUrls.length > 0 &&
            (isMobile ? (
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
                        style={{ display: "none" }}
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
                              style={{ filter: "invert(1)" }}
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
                              style={{ filter: "invert(1)" }}
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
                        <Image
                          src="/images/x.svg"
                          alt="Remover"
                          className="w-4 h-4"
                        />
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
                      style={{ display: "none" }}
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
                            style={{ filter: "invert(1)" }}
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
                            style={{ filter: "invert(1)" }}
                            width={400}
                            height={400}
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
                      <Image
                        src="/images/x.svg"
                        alt="Remover"
                        className="w-4 h-4"
                      />
                    </button>
                  </div>
                ))}
              </div>
            ))}

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
      )}
    </div>
  );
}
