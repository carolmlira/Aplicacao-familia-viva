'use client'

import { useState, ChangeEvent } from 'react'
import { FaCamera } from 'react-icons/fa'

export default function PerfilPage() {
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [nascimento, setNascimento] = useState('')

  function handleFotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setFotoFile(file)
      const reader = new FileReader()
      reader.onload = () => setFotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="text-white p-8 max-w-4xl ml-12">

      <h1 className="text-3xl font-bold mb-6"></h1>

      <div className="flex items-start gap-8">
        {/* Foto de perfil*/}
        <div className="relative w-32 h-32">
          <img
            src={fotoPreview || '/images/icon-user.svg'}
            alt="Foto de perfil"
            className="w-full h-full rounded-full object-cover border border-gray-600"
          />
          <label htmlFor="foto" className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full cursor-pointer hover:bg-orange-600">
            <FaCamera className="text-white" />
            <input id="foto" type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
          </label>
        </div>

        {/* Edição */}
        <form className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
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

          <div>
            <label className="block text-sm mb-1">Data de Nascimento</label>
            <input
              type="date"
              value={nascimento}
              onChange={(e) => setNascimento(e.target.value)}
              className="w-full bg-gray-800 p-2 rounded border border-gray-600"
            />
          </div>

          <div className="col-span-full mt-4">
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded">
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
