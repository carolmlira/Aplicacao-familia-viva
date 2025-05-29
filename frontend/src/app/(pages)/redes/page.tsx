"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "@/style/redes.css";

interface PagesRedes {
  id: string;
  title: string;
  content: string;
  icon: string;
  active: boolean;
  imageUrl?: string;
  imageUrls?: string[];
}

export default function RedesList() {
  const { data: session } = useSession();
  const router = useRouter();

  const category = "redes";
  const [redes, setRedes] = useState<PagesRedes[]>([]);
  const [loading, setLoading] = useState(false);


  async function fetchRedes() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pages?category=${category}`
      );
      const data = await res.json();

      const rawRedes: PagesRedes[] = Array.isArray(data.pages)
        ? data.pages
        : [];

      const redesWithImages = rawRedes.map((rede) => {
        // Usa a primeira imagem salva em imageUrls, se existir
        const imageUrl =
          Array.isArray(rede.imageUrls) && rede.imageUrls.length > 0
            ? rede.imageUrls[0]
            : undefined;

        return { ...rede, imageUrl };
      });

      setRedes(redesWithImages);
    } catch (error) {
      console.error("Erro ao buscar redes:", error);
    }
  }

  useEffect(() => {
    fetchRedes(); // <-- aqui chamamos a função ao montar
  }, [category]);

  async function deleteRede(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta rede?")) return;

    try {
      setLoading(true);

      // Deleta pasta de imagens no storage
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/firebase/delete-folder?category=pages&subgrup=redes&pageId=${id}`,
        {
          method: "DELETE",
        }
      );

      // Deleta a rede no banco
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pages/redes/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Erro ao deletar rede");

      fetchRedes();
    } catch (error) {
      console.error("Erro ao excluir rede:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="redes-container">
      <div className="redes-header">
        <div className="flex justify-between items-center mb-6 w-full">
          <h1 className="text-2xl font-bold text-left mr-4">
            <span className="bg-gradient-to-r from-[#FE3012] via-[#FE6116] via-[#FE8719] via-[#FEA819] to-[#FEC31A] bg-clip-text text-transparent">
              Redes
            </span>
          </h1>

          {(session?.user)?.role === "ADMIN" && (
            <button
              onClick={() => router.push("/redes/new")}
              className="ml-auto bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Nova Rede
            </button>
          )}
        </div>
      </div>

      {redes.length === 0 ? (
        <p className="text-gray-400 text-center">Nenhuma rede encontrada.</p>
      ) : (
        <div className="redes-content">
          {redes.map((rede) => (
            <Link
              key={rede.id}
              href={`/redes/id/items/${rede.id}`}
              className="block"
            >
              <div className="rede-card">
                <div className="rede-img">
                  <Image
                    src={rede.imageUrl || "images/placeholder.svg"}
                    alt={rede.title}
                    width={250}
                    height={250}
                  />
                </div>
                <div className="rede-texto">
                  <h2 style={{ color: "#FF8C00" }}>{rede.title}</h2>
                  <p>
                    {rede.content?.slice(0, 150)}
                    {rede.content?.length > 150 && "..."}
                  </p>

                  {(session?.user)?.role === "ADMIN" && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteRede(rede.id);
                      }}
                      className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      disabled={loading}
                    >
                      {loading ? "Excluindo..." : "Excluir"}
                    </button>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}