'use client'

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


export default function NewProject() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [category, setCategory] = useState('pages');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    active: true,
    imageFile: null as File | null, // Arquivo de imagem
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || (session.user as any).role !== 'ADMIN') {
      router.push('/');
    }
  }, [session, status, router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleAddProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
  
    try {
      // 1. Primeiro cria o projeto SEM a imagem
      const newProject = {
        title: formData.title,
        content: formData.content,
        active: formData.active,
        icon: 'project',
        updatedBy: session?.user?.name || 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
  
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/projects`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(session as any).accessToken}`,
        },
        body: JSON.stringify(newProject),
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Erro ao criar projeto:', res.status, errorText);
        throw new Error('Erro ao criar projeto');
      }
  
      const project = await res.json();
      console.log('Projeto criado:', project);
  
      // 2. Agora que tem o project.id, faz upload da imagem no caminho certo
      if (formData.imageFile) {
        const imageUrl = await handleUploadImage(formData.imageFile, project.id);
  
        // 3. Atualiza o projeto com a imagem
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/projects/${project.id}/image`, {
          method: 'PATCH',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(session as any).accessToken}`,
          },
          body: JSON.stringify({ imageUrl }),
        });
      }
  
      router.push('/projects');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  
  // Atualize o handleUploadImage para receber o projectId:
  async function handleUploadImage(file: File, projectId: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
  
    const categoryWithId = `${category}/${projectId}`; // Exemplo: pages/abc123
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/upload?category=${categoryWithId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${(session as any).accessToken}`,
      },
      body: formData,
    });
  
    if (!res.ok) {
      throw new Error('Erro ao fazer upload da imagem');
    }
  
    const data = await res.json();
    return data.url;
  }

  const projetos = [
    {
      id: 1,
      titulo: "Arrecadação de alimentos",
      descricao: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sit amet lacus vitae justo pulvinar blandit.",
      imagem: "/images/projeto1.jpg",
    },
    {
      id: 2,
      titulo: "Arrecadação de alimentos",
      descricao: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sit amet lacus vitae justo pulvinar blandit.",
      imagem: "/images/projeto1.jpg",
    },
    {
      id: 3,
      titulo: "Arrecadação de alimentos",
      descricao: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sit amet lacus vitae justo pulvinar blandit.",
      imagem: "/images/projeto1.jpg",
    },
  ];

  return (
    <div className="projetos-container">
      <div className="projetos-header">
        <h1>Projetos</h1>
      </div>

      <div className="projetos-content">
        {projetos.map((projeto) => (
          <div key={projeto.id} className="projeto-card">
            <div className="projeto-img">
              <img src={projeto.imagem} alt={projeto.titulo} />
            </div>
            <div className="projeto-texto">
              <h2>{projeto.titulo}</h2>
              <p>{projeto.descricao}</p>
            </div>
          </div>
        ))}
      </div>

      <footer className="projetos-footer">
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
