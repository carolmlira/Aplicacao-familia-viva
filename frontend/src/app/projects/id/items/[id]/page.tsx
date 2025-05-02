'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import "@/style/lider.css";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false); // <-- modo de edição
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [newImage, setNewImage] = useState<File | null>(null);


  useEffect(() => {
    if (id) {
      fetchProject(id);
      fetchProjectImage(id);
    }
  }, [id]);

  async function fetchProject(id: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/projects/${id}`);
      const data = await res.json();
      setProject(data);
      setFormData({ title: data.title, content: data.content }); // pré-carrega os dados no form
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
      if (Array.isArray(data.files) && data.files.length > 0) {
        setImageUrl(data.files[0]);
      }
    } catch (err) {
      console.error("Erro ao buscar imagem do projeto:", err);
    }
  }

  async function handleSave() {
    try {
      // Atualiza texto
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const updated = await res.json();
      setProject(updated);
  
      // Upload nova imagem
      if (newImage) {
        const newFilename = `${uuidv4()}-${newImage.name}`;
        const formData = new FormData();
        formData.append('file', newImage);
        formData.append('filename', newFilename);
  
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/upload?category=pages&pageId=${id}`, {
          method: 'POST',
          body: formData,
        });
  
        // Opcional: excluir imagem antiga
        if (imageUrl) {
          const oldFilename = imageUrl.split('/').pop()?.split('?')[0];
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/delete?category=pages&pageId=${id}&filename=${oldFilename}`, {
            method: 'DELETE',
          });
        }
  
        // Recarrega imagem atualizada
        await fetchProjectImage(id);
        setNewImage(null);
      }
  
      setEditing(false);
    } catch (err) {
      console.error("Erro ao atualizar projeto:", err);
    }
  }
  
  

  if (loading) return <div>Carregando...</div>;
  if (!project) return <div>Projeto não encontrado.</div>;

  return (
    <div className="lider-container">
      <header className="lider-header">
        <h1>Arrecadação de alimentos</h1>
        <button className="editar-button">Editar</button>
      </header>

      <main className="lider-content">
        <section className="lider-section">
          <img src="/images/logo_viva.jpg" alt="Imagem principal" className="lider-img" />
          <p className="lider-texto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer blandit mauris non lorem
            feugiat, in tincidunt lorem tristique. Aenean fringilla magna sit amet lectus tincidunt,
            sed aliquam velit lacinia.
          </p>
        </section>

        <section className="lider-section">
          <p className="lider-texto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer blandit mauris non lorem
            feugiat, in tincidunt lorem tristique. Aenean fringilla magna sit amet lectus tincidunt,
            sed aliquam velit lacinia.
          </p>
          <img src="/images/logo_viva.jpg" alt="Imagem secundaria" className="lider-img" />
        </section>

        <section className="lider-section">
          <img src="/images/logo_viva.jpg" alt="Imagem secundaria" className="lider-img" />
          <p className="lider-texto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer blandit mauris non lorem
            feugiat, in tincidunt lorem tristique. Aenean fringilla magna sit amet lectus tincidunt,
            sed aliquam velit lacinia.
          </p>
        </section>
      </main>

      <footer className="lider-footer">
        <div className="footer-contato">
          <p>@familia_vivarecife</p>
        </div>
        <div className="footer-localizacao">
          <p>Av. Afonso Olindense, 1045 - Várzea, Recife - PE, 50810-000</p>
        </div>
      </footer>
    </div>
  );
}
