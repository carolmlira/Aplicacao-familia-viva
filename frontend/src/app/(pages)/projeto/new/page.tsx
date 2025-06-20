"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NewProjeto() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [imageFiles, setImageFiles] = useState<
    { id: string; file: File; previewUrl: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    active: true,
    imageFiles: [] as File[],
  });

  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      const role = session.user?.role;
      if (role !== "ADMIN") {
        router.push("/");
      }
    }
  }, [session, status, router]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleAddProjeto(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      let body: FormData | string;
      const headers: Record<string, string> = {};
      const token = session?.accessToken || ""; // ajuste conforme onde seu token está

      if (imageFiles.length > 0) {
        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("content", formData.content);
        formDataToSend.append("active", String(formData.active));
        formDataToSend.append("icon", "project");
        formDataToSend.append("updatedBy", session?.user?.name || "admin");
        formDataToSend.append("createdAt", new Date().toISOString());
        formDataToSend.append("updatedAt", new Date().toISOString());

        imageFiles.forEach(({ file }) => {
          formDataToSend.append("images", file);
        });

        body = formDataToSend;
        // Authorization deve ser incluído mesmo sem Content-Type
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        body = JSON.stringify({
          title: formData.title,
          content: formData.content,
          active: formData.active,
          icon: "project",
          updatedBy: session?.user?.name || "admin",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        headers["Content-Type"] = "application/json";
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pages/projects`,
        {
          method: "POST",
          headers: Object.keys(headers).length > 0 ? headers : undefined,
          body,
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Erro ao criar projeto:", res.status, errorText);
        throw new Error("Erro ao criar projeto");
      }

      router.push("/projeto");
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
      <div className="max-w-3xl mx-auto mt-10 p-6  rounded shadow">
        <h1
          style={{ color: "orangered", textAlign: "center", fontSize: "36px" }}
          className="text-2xl font-bold mb-4"
        >
          Novo Projeto
        </h1>
        <form onSubmit={handleAddProjeto} className="space-y-4">
          <div>
            <label className="block font-medium">Título:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              placeholder="Digite o título"
              style={{ color: "black", background: "rgb(231, 226, 226)" }}
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
              placeholder="Digite o conteúdo"
              style={{ color: "black", background: "rgb(231, 226, 226)" }}
              onChange={handleChange}
              rows={12}
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Imagem (opcional):</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                const filesWithIds = files.map((file) => ({
                  id: crypto.randomUUID(),
                  file,
                  previewUrl: URL.createObjectURL(file),
                }));
                setImageFiles((prev) => [...prev, ...filesWithIds]);
              }}
            />
            {imageFiles.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imageFiles.map(({ id, previewUrl }, index) => (
                  <div
                    key={id}
                    className="relative w-full h-[150px] overflow-hidden rounded shadow"
                  >
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
                      <Image
                        width={10}
                        height={10}
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

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Criar Projeto"}
          </button>
        </form>
      </div>
    </>
  );
}
