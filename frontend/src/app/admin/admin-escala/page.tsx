'use client'

import { useState } from 'react'

export default function EscalaPage() {
  const [escalas, setEscalas] = useState([
    { 
      dia: 'Domingo', hora: '19h', culto: 'Culto da Família', dirigente: 'João', pastor: 'Carlos',
      lideres: 'Ana', diaconia: 'Pedro', louvor: 'Maria', comunicacao: 'Lucas', danca: 'Carla',
      redeKids: 'Joana', redeMulheres: 'Fernanda', redeFamilia: 'Paulo', plugger: 'Rafael', limpeza: 'Sônia'
    },
    { 
      dia: 'Quarta-feira', hora: '19h30', culto: 'Culto de Ensino', dirigente: 'Maria', pastor: 'Pedro',
      lideres: 'Ricardo', diaconia: 'Luana', louvor: 'Felipe', comunicacao: 'Sandra', danca: 'Bruno',
      redeKids: 'Bárbara', redeMulheres: 'Patrícia', redeFamilia: 'Eduardo', plugger: 'Marcos', limpeza: 'Lívia'
    },
  ])

  const [novaEscala, setNovaEscala] = useState({
    dia: '',
    hora: '',
    culto: '',
    dirigente: '',
    pastor: '',
    lideres: '',
    diaconia: '',
    louvor: '',
    comunicacao: '',
    danca: '',
    redeKids: '',
    redeMulheres: '',
    redeFamilia: '',
    plugger: '',
    limpeza: '',
  })

  function adicionarEscala(e: React.FormEvent) {
    e.preventDefault()
    setEscalas([...escalas, novaEscala])
    setNovaEscala({
      dia: '', hora: '', culto: '', dirigente: '', pastor: '',
      lideres: '', diaconia: '', louvor: '', comunicacao: '', danca: '',
      redeKids: '', redeMulheres: '', redeFamilia: '', plugger: '', limpeza: '',
    })
  }

  function removerEscala(index: number) {
    const novaLista = [...escalas]
    novaLista.splice(index, 1)
    setEscalas(novaLista)
  }

  function editarEscala(index: number) {
    const escalaSelecionada = escalas[index]
    setNovaEscala(escalaSelecionada)
    removerEscala(index)
  }

  return (
    <>
      <div className="pl-6 pt-8"> 
        <h1
          className="text-4xl font-bold text-left"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          <span className="bg-gradient-to-r from-[#FE3012] via-[#FE8719] to-[#FEC31A] bg-clip-text text-transparent">
            Escala
          </span>
        </h1>
      </div>

      <div className="p-8 text-white max-w-6xl mx-auto">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-700 text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-900 whitespace-nowrap">
                <th className="px-2 py-2 border border-gray-700">Dia</th>
                <th className="px-2 py-2 border border-gray-700">Hora</th>
                <th className="px-2 py-2 border border-gray-700">Culto</th>
                <th className="px-2 py-2 border border-gray-700">Dirigente</th>
                <th className="px-2 py-2 border border-gray-700">Pastor</th>
                <th className="px-2 py-2 border border-gray-700">Líderes</th>
                <th className="px-2 py-2 border border-gray-700">Diaconia</th>
                <th className="px-2 py-2 border border-gray-700">Louvor</th>
                <th className="px-2 py-2 border border-gray-700">Comunicação</th>
                <th className="px-2 py-2 border border-gray-700">Dança</th>
                <th className="px-2 py-2 border border-gray-700">Rede Kids</th>
                <th className="px-2 py-2 border border-gray-700">Rede Mulheres</th>
                <th className="px-2 py-2 border border-gray-700">Rede Família</th>
                <th className="px-2 py-2 border border-gray-700">Plugger</th>
                <th className="px-2 py-2 border border-gray-700">Limpeza</th>
                <th className="px-2 py-2 border border-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {escalas.map((escala, index) => (
                <tr key={index} className="hover:bg-gray-800 whitespace-nowrap text-xs md:text-sm">
                  <td className="px-2 py-1 border border-gray-700">{escala.dia}</td>
                  <td className="px-2 py-1 border border-gray-700">{escala.hora}</td>
                  <td className="px-2 py-1 border border-gray-700">{escala.culto}</td>
                  <td className="px-2 py-1 border border-gray-700">{escala.dirigente}</td>
                  <td className="px-2 py-1 border border-gray-700">{escala.pastor}</td>
                  <td className="px-2 py-1 border border-gray-700">{escala.lideres}</td>
                  <td className="px-2 py-1 border border-gray-700">{escala.diaconia}</td>
                  <td className="px-2 py-1 border border-gray-700">{escala.louvor}</td>
                  <td className="px-2 py-1 border border-gray-700">{escala.comunicacao}</td>
                  <td className="px-2 py-1 border border-gray-700">{escala.danca}</td>
                  <td className="px-2 py-1 border border-gray-700">{escala.redeKids}</td>
                  <td className="px-2 py-1 border border-gray-700">{escala.redeMulheres}</td>
                  <td className="px-2 py-1 border border-gray-700">{escala.redeFamilia}</td>
                  <td className="px-2 py-1 border border-gray-700">{escala.plugger}</td>
                  <td className="px-2 py-1 border border-gray-700">{escala.limpeza}</td>
                  <td className="px-2 py-1 border border-gray-700 flex gap-2 justify-center">
                    <button
                      onClick={() => editarEscala(index)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => removerEscala(index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Formulário de nova escala */}
        <form onSubmit={adicionarEscala} className="mt-8 grid md:grid-cols-5 gap-4">
  {[
    { label: "Dia", key: "dia", placeholder: "" },
    { label: "Hora", key: "hora", placeholder: "" },
    { label: "Culto", key: "culto", placeholder: "" },
    { label: "Dirigente", key: "dirigente", placeholder: "" },
    { label: "Pastor", key: "pastor", placeholder: "" },
    { label: "Líderes", key: "lideres", placeholder: "" },
    { label: "Diaconia", key: "diaconia", placeholder: "" },
    { label: "Louvor", key: "louvor", placeholder: "" },
    { label: "Comunicação", key: "comunicacao", placeholder: "" },
    { label: "Dança", key: "danca", placeholder: "" },
    { label: "Rede Kids", key: "redeKids", placeholder: "" },
    { label: "Rede Mulheres", key: "redeMulheres", placeholder: "" },
    { label: "Rede Família", key: "redeFamilia", placeholder: "" },
    { label: "Plugger", key: "plugger", placeholder: "" },
    { label: "Limpeza", key: "limpeza", placeholder: "" },
  ].map(({ label, key, placeholder }) => (
    <div key={key} className="flex flex-col">
      <label className="block text-white text-xs md:text-sm font-semibold mb-1">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={novaEscala[key as keyof typeof novaEscala]}
        onChange={(e) => setNovaEscala({ ...novaEscala, [key]: e.target.value })}
        className="bg-gray-800 text-white p-2 rounded border border-gray-600 w-full"
        required
      />
    </div>
  ))}

  <button
    type="submit"
    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded col-span-full md:col-span-2"
  >
    {novaEscala.dia ? 'Salvar Alterações' : 'Adicionar'}
  </button>
</form>

      </div>
    </>
  )
}
