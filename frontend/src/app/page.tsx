"use client";

import styles from "@/app/home.module.css";
import { AiOutlineCaretLeft } from "react-icons/ai";
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { PagesProject } from "@/app/types/pageProjects";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const [projects, setProjects] = useState<PagesProject[]>([]);

  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showModalProgramacaoAdd, setShowModalProgramacaoAdd] = useState(false);
  const [showModalProgramacaoEdit, setShowModalProgramacaoEdit] = useState(false);
  const [formEdit, setFormEdit] = useState({ title: "", description: "", time: "", days: [] as string[] });

  const [files, setFiles] = useState<string[]>([]);

  const [showModalEditSobre, setShowModalEditSobre] = useState(false);
  const [sobreList, setSobreList] = useState<Sobre[]>([]);
  const [sobreImageFile, setSobreImageFile] = useState<File | null>(null);
  const [imgTimestamp, setImgTimestamp] = useState("");
  
  const baseUrl = `${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BASE}`;
  const [currentIndex, setCurrentIndex] = useState(0);

  const [banner, setBanner] = useState<BannerType | null>(null);
  const [showModalBanner, setShowModalBanner] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);
  const [bannerText, setBannerText] = useState('');



  useEffect(() => {
    // quando `sobreList` for atualizado, mude o timestamp
    setImgTimestamp(Date.now().toString());
  }, [sobreList]);


  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    days: "",
    time: "",
  });

  const [editSobre, setEditSobre] = useState({
    id: "",
    titulo: "",
    content: "",
    imagem: "",
  });

  type Sobre = {
    id: string;
    titulo: string;
    content: string;
    imagem?: string;
  };

  type BannerType = {
    id: string;
    imagemLogo?: string;
    imagemBanner?: string;
    frase?: string;
    imagemLogoFile?: File;
    imagemBannerFile?: File;
  };  
  const imagesPerPage = 4;
  const visibleFiles = files.slice(currentIndex, currentIndex + imagesPerPage);

  useEffect(() => {
    fetchProjects();
    fetchFiles('gallery');
    fetchEvents();
    fetchSobre();
    fetchBanner();
  }, []);
  
  async function fetchProjects() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/pages?category=projects`);
      const data = await res.json();
      console.log("Pages API response:", data);
      const rawProjects: PagesProject[] = Array.isArray(data.pages) ? data.pages : [];

      const projectsWithImages = await Promise.all(
        rawProjects.map(async (project) => {
          if (!project.id) return project;

          try {
            const imageRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/firebase/pages/projects/files?pageId=${project.id}`
            );
            const imageData = await imageRes.json();
            const imageUrl =
              Array.isArray(imageData.files) && imageData.files.length > 0 ? imageData.files[0] : undefined;

            return { ...project, imageUrl };
          } catch (err) {
            console.warn(`Erro ao buscar imagem de ${project.title}:`, err);
            return { ...project };
          }
        })
      );

      setProjects(projectsWithImages);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
    }
  }
  
  async function fetchFiles(category: string) {
    if (!category) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/list?category=${category}`);
      const data = await res.json();
      console.log('Arquivos recebidos:', data.files);

      // Aqui você ajusta os caminhos, gerando a URL completa
      const fileUrls = data.files.map((filePath: string) => {
        return `${baseUrl}${encodeURIComponent(filePath)}?alt=media`;
      });
      console.log("filrurl: ", fileUrls);

      setFiles(fileUrls || []);
    } catch (error) {
      console.error('Erro ao listar arquivos:', error);
    }
  }

  async function fetchEvents() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`);
      if (!res.ok) throw new Error("Erro ao buscar eventos");
      const data = await res.json();
      setEvents(data); // data deve ser um array de eventos
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    }
  }

  async function fetchSobre() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sobre`);
      if (!res.ok) {
        throw new Error("Erro ao buscar dados do Sobre");
      }
      const data = await res.json();
      setSobreList(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchBanner() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banner`);
      if (!res.ok) throw new Error("Erro ao buscar dados do Banner");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setBanner(data[0]); // pega só o primeiro
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function createEvent(eventData: {
    title: string;
    description?: string;
    days: string[];
    time: string;
  }) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!res.ok) {
        throw new Error("Erro ao criar evento");
      }

      const created = await res.json();
      console.log("Evento criado:", created);
      return created;
    } catch (error) {
      console.error("Erro ao criar evento:", error);
    }
  }

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.days || !newEvent.time) {
      alert("Preencha todos os campos obrigatórios: título, dias e horário.");
      return;
    }

    const eventData = {
      title: newEvent.title,
      description: newEvent.description || "",
      days: newEvent.days.split(',').map(day => day.trim()),
      time: newEvent.time,
    };

    const created = await createEvent(eventData);
    if (created) {
      alert("Evento criado com sucesso!");
      setNewEvent({ title: "", description: "", days: "", time: "" });
      setShowModalProgramacaoAdd(false);
      fetchEvents(); // Atualiza a lista de eventos na tela
    }
  };

  async function handleUpdateEvent(eventId:any, updatedData:any) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        console.log("Evento atualizado com sucesso:", updatedEvent);

        // Se estiver usando React, você pode atualizar o estado local aqui
        // Exemplo: atualizar o estado com o evento atualizado
        setEvents(prevEvents => prevEvents.map(event => event.id === updatedEvent.id ? updatedEvent : event));

        // Ou redirecionar ou fazer algo com o evento atualizado
      } else {
        // Caso o backend retorne um erro
        console.error("Erro ao atualizar o evento:", await response.text());
      }
    } catch (error) {
      console.error("Erro ao enviar a atualização:", error);
    }
  }

  async function handleDeleteEvent(eventId: string) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir evento');
      }

      // Atualiza o estado de eventos para refletir a exclusão
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));

      console.log('Evento excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
    }
  }

  async function handleSaveSobre(id: string) {
    try {
      let imageUrl = editSobre.imagem;

      if (sobreImageFile) {
        const url = await uploadSobreImage(sobreImageFile);
        console.log("data image: ", url)
        if (url) imageUrl = url;
      }

      const updatedData = {
        titulo: editSobre.titulo,
        content: editSobre.content,
        imagem: imageUrl,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sobre/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Erro ao atualizar dados do Sobre");

      const updatedSobre = await res.json();

      // Atualiza a lista no estado
      setSobreList((prev) =>
        prev.map((item) => (item.id === id ? updatedSobre : item))
      );

      setShowModalEditSobre(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar dados da seção Sobre");
    }
  }

  async function uploadSobreImage(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file); // nome do campo esperado no backend

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/upload/sobre`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Erro ao fazer upload da imagem do Sobre");
    }

    const data = await res.json();
    console.log("data ",data.url)
    return data.url; // supondo que o backend retorna { url: string }
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => {
      const maxIndex = files.length - 4;
      return Math.min(prev + 1, maxIndex);
    });
  };

  function openEditModal(event:any) {
    setSelectedEvent(event);
    setFormEdit({
      title: event.title || "",
      description: event.description || "",
      time: event.time || "",
      days: event.days || [],
    });
    setShowModalProgramacaoEdit(true);
  }

  async function handleSubmitUpdate() {
    if (!selectedEvent) return;

    await handleUpdateEvent(selectedEvent.id, formEdit);
    setShowModalProgramacaoEdit(false);
  }

  function formatarDias(dias: string[]): string {
    if (dias.length === 0) return "";
    if (dias.length === 1) return dias[0];
    if (dias.length === 2) return `${dias[0]} e ${dias[1]}`;
    
    const todosMenosUltimo = dias.slice(0, -1).join(", ");
    const ultimo = dias[dias.length - 1];
    return `${todosMenosUltimo} e ${ultimo}`;
  }

  function handleSobreImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSobreImageFile(file);
    }
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setBanner(prev => {
        if (!prev) return prev; 
        return {
          ...prev,
          imagemLogo: URL.createObjectURL(file),
          imagemLogoFile: file,
        };
      });
    }
  }

  function handleBackgroundChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setBanner(prev => {
        if (!prev) return prev;

        return {
          ...prev,
          imagemBanner: URL.createObjectURL(file),
          imagemBannerFile: file,
        };
      });
    }
  }

  async function handleSaveBanner() {
    try {
      const formData = new FormData();
      if (banner?.imagemLogoFile) formData.append('imagemLogo', banner.imagemLogoFile);
      if (banner?.imagemBannerFile) formData.append('imagemBanner', banner.imagemBannerFile);
      if (banner?.frase) formData.append('frase', banner.frase);
      if (!banner) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banner/${banner.id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (!res.ok) throw new Error('Erro ao atualizar o banner');

      await fetchBanner();
      setShowModalBanner(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      {/* Banner principal da home */}
      {isAdmin && (
        <div className="container">
          <button className={styles.botaoEditar} onClick={() => setShowModalBanner(true)}>
            <Image
              src="/images/pen.svg"
              alt="Editar"
              width={20}
              height={20}
              className={styles.iconeEditar}
            />
            <span>Editar</span>
          </button>
        </div>
      )}
      {showModalBanner && (
        <div className={styles.modalOverlayBanner}>
          <div className={styles.modalContentBanner}>

            <h2 style={{ fontWeight: "bold", color: "orangered"}}>Editar Banner</h2>

            {/* Upload da Logo */}
            <div className={styles.modalSectionBanner}>
              <label htmlFor="logoUpload">Imagem da logo:</label>
              <input style={{ marginTop: "10px",boxShadow: "0 4px 4px -2px rgba(0, 0, 0, 0.3)" }} type="file" id="logoUpload" accept="image/*" onChange={handleLogoChange} />
              {logoPreview ? (
                <Image src={logoPreview} alt="Logo preview" width={300} height={100} />
              ) : banner?.imagemLogo ? (
                <Image src={banner.imagemLogo} alt="Logo atual" width={300} height={100} />
              ) : null}
            </div>

            {/* Upload da Imagem de Fundo */}
            <div className={styles.modalSectionBanner}>
              <label htmlFor="backgroundUpload">Imagem de fundo:</label>
              <input style={{ marginTop: "10px",boxShadow: "0 4px 4px -2px rgba(0, 0, 0, 0.3)" }} type="file" id="backgroundUpload" accept="image/*" onChange={handleBackgroundChange} />
              {backgroundPreview ? (
                <Image src={backgroundPreview} alt="Background preview" width={200} height={200} />
              ) : banner?.imagemBanner ? (
                <Image src={banner.imagemBanner} alt="Background atual" width={200} height={200} />
              ) : null}
            </div>

            {/* Frase editável */}
            <div className={styles.modalSectionBanner}>
              <label htmlFor="bannerText">Frase:</label>
              <input
                type="text"
                id="bannerText"
                value={banner?.frase || ''}
                onChange={(e) =>
                  setBanner((prev) =>
                    prev ? { ...prev, frase: e.target.value } : prev
                  )
                }
                placeholder="Digite a frase do banner"
                className={styles.inputText}
              />
            </div>

            <div className={styles.modalActionsBanner}>
              <button style={{ backgroundColor: "green", padding: "8px 12px", borderRadius: "8px"}} onClick={handleSaveBanner}>Salvar</button>
              <button style={{ backgroundColor: "red", padding: "8px 12px", borderRadius: "8px"}} onClick={() => setShowModalBanner(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {banner?.imagemBanner && banner?.imagemLogo && (
        <div className="relative w-full h-[500px] overflow-hidden">
          <Image
            src={banner.imagemBanner}
            alt="Banner de fundo"
            fill
            className={styles.banner}
          />
          <div className={styles.logoPrincipal}>
            <Image
              src={banner.imagemLogo}
              alt="Logo principal"
              width={700}
              height={200}
            />
            <h1>{banner.frase || 'Um Lugar de Adoração ao Deus Vivo'}</h1>
          </div>
        </div>
      )}

      {/* Sobre a igreja */}
      {isAdmin && sobreList.length > 0 && (
        <div className="container-sobre">
          <button
            className={styles.botaoEditarSobre}
            onClick={() => {
              setEditSobre({ ...sobreList[0], imagem: sobreList[0].imagem || "" });
              setShowModalEditSobre(true);
            }}
          >
            <Image
              src="/images/pen.svg"
              alt="Editar"
              width={20}
              height={20}
              className={styles.iconeEditar}
            />
            <span>Editar</span>
          </button>
        </div>
      )}

      {/* Sobre Modal Editar */}
      {showModalEditSobre && editSobre && (
        <div className={styles.modalOverlaySobre}>
          <div className={styles.modalContentSobre}>
            <h2 style={{ fontWeight: "bold", color: "orangered"}}>Editar Seção: </h2>

            <label>Título:</label>
            <input
              type="text"
              style={{ boxShadow: "0 4px 4px -2px rgba(0, 0, 0, 0.3)" }} 
              value={editSobre.titulo}
              onChange={(e) =>
                setEditSobre({ ...editSobre, titulo: e.target.value })
              }
            />

            <label>Conteúdo:</label>
            <textarea 
              style={{ boxShadow: "0 4px 4px -2px rgba(0, 0, 0, 0.3)" }} 
              value={editSobre.content}
              onChange={(e) =>
                setEditSobre({ ...editSobre, content: e.target.value })
              }
            />
            <label>Imagem:</label>
            <input style={{ boxShadow: "0 4px 4px -2px rgba(0, 0, 0, 0.3)" }}  type="file" onChange={handleSobreImageChange} />
            {editSobre.imagem && (
              <Image               src={
                  editSobre.imagem?.startsWith("http")
                    ? `${editSobre.imagem}?t=${imgTimestamp}`
                    : "/images/Placeholder.svg"
                } alt="Preview" width={200} height={200} style={{ border: "2px solid orange", margin: "0 auto", borderRadius: "8px" }} />
            )}
            <div className={styles.modalActionsBanner}>
              <button style={{ backgroundColor: "green", padding: "8px 12px", borderRadius: "8px"}} onClick={() => handleSaveSobre(editSobre.id)}>Salvar</button>
              <button style={{ backgroundColor: "red", padding: "8px 12px", borderRadius: "8px"}} onClick={() => setShowModalEditSobre(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Sobre a igreja layout */}
      <div className={styles.sobre} id="sobre">
        {sobreList.map((sobre) => (
          <div key={sobre.id} className={styles.conteudoSobre}>
            <div className={styles.textContainer}>
              <h2 className="bg-gradient-to-r from-[#FE3012] via-[#FE6116] via-[#FE8719] via-[#FEA819] to-[#FEC31A] bg-clip-text text-transparent">
                {sobre.titulo || "Quem somos?"}
              </h2>
              {sobre.content
                .split('\n') // Quebra por linhas
                .filter((paragraph) => paragraph.trim() !== '') // Remove vazios
                .map((paragraph, index) => (
                  <p key={index} className="mb-4 text-justify">
                    {paragraph}
                  </p>
                ))}
            </div>
            <div className={styles.imageContainer}>
              <Image
                src={
                  sobre.imagem?.startsWith("http")
                    ? `${sobre.imagem}?t=${imgTimestamp}`
                    : "/images/Placeholder.svg"
                }
                alt="Sobre a igreja"
                className={styles.sobreImagem}
                width={600}
                height={200}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Programação Button Add */}
      {isAdmin && (
        <div className="container-programacao-add">
          <button className={styles.botaoAdd} onClick={() => setShowModalProgramacaoAdd(true)}>
            <Image
              src="/images/plus-circle.svg"
              alt="Adicionar programação"
              width={20}
              height={20}
              className={styles.iconeAdd}
            />
            <span>Adicionar</span>
          </button>
        </div>
      )}

      {/* Programação Modal Add */}
      {showModalProgramacaoAdd && (
        <div className={styles.modalOverlayEvent}>
          <div className={styles.modalContentEvent}>
  
            <h2 style={{ fontWeight: 'bold', color: "orangered" }}>Novo Evento</h2>

            <div className={styles.modalSectionEvent}>
              <label htmlFor="eventTitle">Título:</label>
              <input
                id="eventTitle"
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Ex: Culto de Domingo"
                className={styles.inputText}
              />
            </div>

            <div className={styles.modalSectionEvent}>
              <label htmlFor="eventDescription">Descrição:</label>
              <textarea
                id="eventDescription"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Ex: Culto com louvor e palavra"
                className={styles.inputText}
              />
            </div>

            <div className={styles.modalSectionEvent}>
              <label htmlFor="eventDays">Dias (separados por vírgula):</label>
              <input
                id="eventDays"
                type="text"
                value={newEvent.days}
                onChange={(e) => setNewEvent({ ...newEvent, days: e.target.value })}
                placeholder="Ex: domingo, quarta"
                className={styles.inputText}
              />
            </div>

            <div className={styles.modalSectionEvent}>
              <label htmlFor="eventTime">Horário:</label>
              <input
                id="eventTime"
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                className={styles.inputText}
              />
            </div>

            <div className={styles.modalActionsBanner}>
              <button style={{ backgroundColor: 'green', borderRadius: '5px', padding: '8px 12px' }} onClick={handleCreateEvent}>Salvar</button>
              <button style={{ backgroundColor: 'red', borderRadius: '5px', padding: '8px 12px' }} onClick={() => setShowModalProgramacaoAdd(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Programação Modal Edit */}
      {showModalProgramacaoEdit && (
        <div className={styles.modalOverlaySobre}>
          <div className={styles.modalContentSobre}>
            <h3 style={{ fontWeight: 'bold', color: "orangered"}}>Editar Evento</h3>

            <label>Título</label>
            <input
              type="text"
              value={formEdit.title}
              style={{ boxShadow: "0 4px 4px -2px rgba(0, 0, 0, 0.3)" }}
              onChange={(e) => setFormEdit({ ...formEdit, title: e.target.value })}
            />

            <label>Descrição</label>
            <textarea
              value={formEdit.description}
              style={{ boxShadow: "0 4px 4px -2px rgba(0, 0, 0, 0.3)" }}
              onChange={(e) => setFormEdit({ ...formEdit, description: e.target.value })}
            />

            <label>Horário</label>
            <input
              type="text"
              value={formEdit.time}
              style={{ boxShadow: "0 4px 4px -2px rgba(0, 0, 0, 0.3)" }}
              onChange={(e) => setFormEdit({ ...formEdit, time: e.target.value })}
            />

            <label>Dias (separados por vírgula)</label>
            <input
              type="text"
              value={formEdit.days.join(", ")}
              style={{ boxShadow: "0 4px 4px -2px rgba(0, 0, 0, 0.3)" }}
              onChange={(e) =>
                setFormEdit({
                  ...formEdit,
                  days: e.target.value.split(",").map((d) => d.trim()),
                })
              }
            />

            <div className={styles.modalActionsBanner}>
              <button style={{ backgroundColor: 'green', borderRadius: '5px', padding: '8px 12px' }} onClick={handleSubmitUpdate}>Salvar</button>
              <button style={{ backgroundColor: 'red', borderRadius: '5px', padding: '8px 12px' }} onClick={() => setShowModalProgramacaoEdit(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {/* Programação layout */}
      <div className={styles.programacao}>
        <div className="w-full text-center">
          <h2 className="text-4xl font-bold w-full bg-gradient-to-r from-[#FE3012] via-[#FE3011] via-[#FE6116] via-[#FE8719] via-[#FEA819] to-[#FEC31A] bg-clip-text text-transparent">
            Nossa Programação
          </h2>
        </div>

        <div className={styles.botoesDias}>
          {events.length === 0 ? (
            <p>Nenhum evento encontrado.</p>
          ) : (
            events.map((evt) => (
              <div key={evt.id} className={styles.tooltip}>
                <span className={styles.dias}>{formatarDias(evt.days)}</span>
                <div className={styles.tooltipText}>
                  <p><strong>{evt.title}</strong></p>
                  {evt.description && <p>{evt.description}</p>}
                  <p>{evt.time}</p>
                  {isAdmin && (
                      <div className={styles.botoesLinha}>
                        <button
                          className={styles.botaoEditarProgramacao}
                          onClick={() => openEditModal(evt)}
                        >
                          <Image
                            src="/images/pen.svg"
                            alt="Editar"
                            width={20}
                            height={20}
                            className={styles.iconeEditar}
                          />
                          <span>Editar</span>
                        </button>

                        <button
                          onClick={() => handleDeleteEvent(evt.id)}
                          className={styles.botaoExcluirEvento}
                        >
                          <Image
                            src="/images/trash.svg"
                            alt="Excluir"
                            width={20}
                            height={20}
                            className={styles.iconeExcluir}
                          />
                          <span>Excluir</span>
                        </button>
                      </div>
                    )}
                  </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Projetos layout */}
      <div className={styles.projetos}>
        <div className={styles.projetosHeader}>
          <h1>Projetos</h1>
          <Link className={styles.linkProjeto} href="/projeto">Ver mais</Link>
        </div>

        {projects.length === 0 ? (
          <p className="text-gray-400 text-center">Nenhum projeto encontrado.</p>
        ) : (
          <div className={styles.projetosContent}>
            {projects.slice(0, 2).map((project) => (
              <Link
                key={project.id}
                href={`/projeto/id/items/${project.id}`}
                className={styles.projetoCard}
              >
                <div className={styles.projetoImg}>
                  <Image
                    src={project.imageUrl || '/images/placeholder.svg'}
                    alt={project.title}
                    width={200}
                    height={200}
                    className={styles.fotoProjeto}
                  />
                </div>
                  <div className={styles.projetoTexto}>
                    <h2>{project.title}</h2>
                    <p>
                      {project.content?.slice(0, 150)}
                      {project.content?.length > 150 && '...'}
                    </p>
                  </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Galeria layout */}
      <div className={styles.galeria}>
        <div className={styles.galeriaHeader}>
          <h2>Galeria</h2>
          <Link className={styles.linkGaleria} href="/galeria">Ver mais</Link>
        </div>

        <div className={styles.carouselWrapper}>
          <AiOutlineCaretLeft className={styles.iconLeft} onClick={goToPrevious} />

          <div className={styles.carouselContainer}>
            <div
              className={styles.carouselTrack}
                style={{
                  transform: `translateX(-${currentIndex * 250}px)`,
                }}
            >
              {files.map((file, index) => (
                <div key={index} className={styles.carouselItem}>
                  {file && file.startsWith("http") ? (
                    <Image
                      src={file}
                      alt={`Imagem ${index + 1}`}
                      width={250}
                      height={250}
                      className={styles.fotoGaleria}
                    />
                  ) : (
                    <Image
                      src="/images/placeholder.svg"
                      alt="Imagem não disponível"
                      width={250}
                      height={250}
                      className={styles.fotoGaleria}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <AiOutlineCaretLeft className={styles.iconRight} onClick={goToNext} />
        </div>

      </div>

    </>
  );
}
