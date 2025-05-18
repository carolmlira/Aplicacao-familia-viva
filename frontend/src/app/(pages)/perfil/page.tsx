'use client'

import { useState, ChangeEvent, useEffect } from 'react'
import { FaCamera } from 'react-icons/fa'
import { useSession } from "next-auth/react";


export default function PerfilPage() {
  const { data: session, status } = useSession()
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [oldSenha, setOldSenha] = useState('')
  const [password, setPassword] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [whatsappNotificacao, setWhatsappNotificacao] = useState(false)
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [imgUserUrl, setImgUserUrl] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const id = session?.user?.id

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 1000)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!id) return // Se id não existe, não faz nada

    async function fetchUser() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
          credentials: 'include', // se usar cookie/session
        })
        if (!res.ok) throw new Error('Erro ao carregar dados do usuário')
        const user = await res.json()

        setName(user.name || '')
        setEmail(user.email || '')
        setTelefone(user.phone || '')
        setWhatsappNotificacao(!!user.whatsappOptIn)
        setFotoPreview(user.photo || null)
      } catch (err) {
        console.error(err)
        alert('Não foi possível carregar os dados do perfil')
      }
    }

    fetchUser()
  }, [id]) 

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/user/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.url) {
          // força o browser a baixar a imagem atualizada
          setImgUserUrl(`${data.url}?t=${Date.now()}`);
        }
      })
      .catch((err) => console.error("Erro ao carregar a imagem:", err));
  }, []);

  async function handleUploadOrUpdateImage(file: File) {
    if (!id) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/upload/user/${id}`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      // lidar com erro
      console.error('Erro no upload');
      return;
    }

    const data = await res.json();
    setImgUserUrl(data.url); // atualiza preview
    // aqui pode atualizar também o estado do usuário com o novo link, etc.
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    if (!id) {
      alert('Usuário não autenticado');
      return;
    }

    try {
      const body = {
      oldSenha: oldSenha,   
      password: password,    
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        let errorMessage = 'Erro ao alterar senha';
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      alert('Senha alterada com sucesso!');
      setOldSenha('');
      setPassword('');
      setConfirmarSenha('');
      setMostrarSenha(false);

    } catch (error: any) {
      alert(error.message || 'Erro desconhecido');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!id) {
      alert('Usuário não autenticado');
      return;
    }

    try {
      let fotoUrl = fotoPreview; 
      if (fotoFile) {
        const formDataFoto = new FormData();
        formDataFoto.append('file', fotoFile);
        
        const resUpload = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/upload/user/${id}`, {
          method: 'POST',
          body: formDataFoto,
          credentials: 'include',
        });
        
        if (!resUpload.ok) throw new Error('Erro ao fazer upload da foto');
        
        const dataUpload = await resUpload.json();
        fotoUrl = dataUpload.url;
      }

      const body = {
        name,
        email,
        telefone,
        photo: fotoUrl,
        whatsappNotificacao,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Erro ao atualizar perfil');

      alert("Perfil atualizado com sucesso!");
    } catch (error: any) {
      alert(error.message || 'Erro desconhecido');
    }
  }


  if (status === 'loading') {
    return <p style={{ textAlign:"center" }}>Carregando...</p>
  }

  if (!session) {
    return <p style={{ textAlign:"center" }}>Você precisa estar logado para acessar esta página.</p>
  }
  
  return (
  <>
    {isMobile ? (
      <div className="text-white p-4">
        <span className="inline-block text-2xl font-bold mb-4 bg-gradient-to-r from-[#FE3012] via-[#FD6B13] to-[#FEC31A] bg-clip-text text-transparent">
          Editar Perfil
        </span>

        {/* Foto de perfil mobile */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24">
            <img
              src={fotoPreview || '/images/icon-user.svg'}
              alt="Foto de perfil"
              className="w-full h-full rounded-full object-cover border border-gray-600"
            />
            <label
              htmlFor="foto"
              className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full cursor-pointer hover:bg-orange-600"
            >
              <FaCamera className="text-white" />
              <input
                id="foto"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  setFotoFile(file);
                  setFotoPreview(URL.createObjectURL(file));
                  handleUploadOrUpdateImage(file);
                }}
              />
            </label>
          </div>
        </div>

        {/* Formulário principal mobile */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm mb-1">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800 p-2 rounded border border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 p-2 rounded border border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Telefone</label>
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="w-full bg-gray-800 p-2 rounded border border-gray-600"
            />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={whatsappNotificacao}
              onChange={(e) => setWhatsappNotificacao(e.target.checked)}
              className="form-checkbox h-5 w-5 text-orange-500"
            />
            <label className="text-sm">Receber notificações no WhatsApp</label>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded w-full"
            >
              Salvar Alterações
            </button>
          </div>
        </form>

        {/* Botão para mostrar/ocultar campos de senha */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            className="mb-4 w-full bg-gray-700 hover:bg-gray-600 rounded text-white py-2"
          >
            {mostrarSenha ? 'Cancelar alteração de senha' : 'Alterar senha'}
          </button>

          {/* Formulário senha */}
          {mostrarSenha && (
            <form
              onSubmit={handleChangePassword}
              className="flex flex-col gap-4 bg-gray-800 p-4 rounded border border-gray-600"
            >
              <div>
                <label className="block text-sm mb-1">Senha Atual</label>
                <input
                  type="password"
                  value={oldSenha}
                  onChange={(e) => setOldSenha(e.target.value)}
                  className="w-full bg-gray-700 p-2 rounded border border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Nova Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700 p-2 rounded border border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Confirmar Senha</label>
                <input
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="w-full bg-gray-700 p-2 rounded border border-gray-600"
                />
              </div>

              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
              >
                Salvar Senha
              </button>
            </form>
          )}
        </div>
      </div>
    ) : (
      <div className="text-white p-8 max-w-6xl ml-12">
        <span className="inline-block text-3xl font-bold mb-6 bg-gradient-to-r from-[#FE3012] via-[#FD6B13] to-[#FEC31A] bg-clip-text text-transparent">
          Editar Perfil
        </span>

        <div className="flex gap-8">
          {/* Coluna principal: Foto + Formulário */}
          <div className="flex-1 flex gap-8">
            {/* Foto de perfil */}
            <div className="relative w-32 h-32">
              <img
                src={fotoPreview || '/images/icon-user.svg'}
                alt="Foto de perfil"
                className="w-full h-full rounded-full object-cover border border-gray-600"
              />
              <label
                htmlFor="foto"
                className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full cursor-pointer hover:bg-orange-600"
              >
                <FaCamera className="text-white" />
                <input
                  id="foto"
                  type="file"
                  accept="image/*"
                  className="hidden" // <- aqui esconde o input
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setFotoFile(file);
                    setFotoPreview(URL.createObjectURL(file));
                    handleUploadOrUpdateImage(file);
                  }}
                />
              </label>
            </div>

            {/* Formulário principal (sem campos de senha) */}
            <form onSubmit={handleSubmit} className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-800 p-2 rounded border border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-800 p-2 rounded border border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Telefone</label>
                <input
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full bg-gray-800 p-2 rounded border border-gray-600"
                />
              </div>

              <div className="flex items-center gap-2 col-span-full mt-2">
                <input
                  type="checkbox"
                  checked={whatsappNotificacao}
                  onChange={(e) => setWhatsappNotificacao(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-orange-500"
                />
                <label className="text-sm">Receber notificações no WhatsApp</label>
              </div>

              <div className="col-span-full mt-4">
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>

          {/* Coluna direita: botão para mostrar campos de senha e os campos (se ativado) */}
          <div className="w-72 self-start mt-6">
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="mb-4 w-full bg-gray-700 hover:bg-gray-600 rounded text-white py-2"
            >
              {mostrarSenha ? 'Cancelar alteração de senha' : 'Alterar senha'}
            </button>

            {/* Formulário senha */}
            {mostrarSenha && (
              <form
                onSubmit={handleChangePassword}
                className="flex flex-col gap-4 bg-gray-800 p-4 rounded border border-gray-600"
              >
                <div>
                  <label className="block text-sm mb-1">Senha Atual</label>
                  <input
                    type="password"
                    value={oldSenha}
                    onChange={(e) => setOldSenha(e.target.value)}
                    className="w-full bg-gray-700 p-2 rounded border border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Nova Senha</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-700 p-2 rounded border border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Confirmar Senha</label>
                  <input
                    type="password"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="w-full bg-gray-700 p-2 rounded border border-gray-600"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
                >
                  Salvar Senha
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    )}
  </>
  )


}
