'use client'

import { useState, useEffect } from 'react'
import Calendar, { CalendarProps } from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

type Escala = {
  data: string
  hora: string
  culto: string
  pastor: string
  dirigente: string
  lideres: string
  diaconia: string
  louvor: string
  comunicacao: string
  danca: string
  redeKids: string
  redeMulheres: string
  redeFamilia: string
  plugger: string
  limpeza: string
}

export default function EscalaPublicaPage() {
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date())
  const [escalas, setEscalas] = useState<Escala[]>([])

  useEffect(() => {
    // Aqui a chamada para API 
    fetch('/api/escalas')
      .then((res) => res.json())
      .then((data) => setEscalas(data))
      .catch((err) => console.error('Erro ao buscar escalas:', err))
  }, [])

  const dataFormatada = dataSelecionada.toISOString().split('T')[0]
  const escalaDoDia = escalas.find((e) => e.data === dataFormatada)

  return (
    <>
      <div className="pl-8 pt-8 max-w-screen">
        <h1 className="text-4xl font-bold text-left" style={{ fontFamily: 'Poppins, sans-serif' }}>
          <span className="bg-gradient-to-r from-[#FE3012] via-[#FE8719] to-[#FEC31A] bg-clip-text text-transparent">
            Escala Semanal
          </span>
        </h1>
      </div>

      <div className="p-8 text-white max-w-4xl mx-auto mt-8">
        <Calendar
          {...({
            onChange: (value: Date | Date[]) => {
              if (value instanceof Date) setDataSelecionada(value)
            },
            value: dataSelecionada,
            className: 'bg-white rounded-lg p-4 text-black mx-auto',
            tileClassName: ({ date }) => {
              const data = date.toISOString().split('T')[0]
              return escalas.some((e) => e.data === data)
                ? 'bg-orange-500 text-black rounded-full'
                : ''
            },
          } as CalendarProps)}
        />

        <div className="mt-6">
          {escalaDoDia ? (
            <div className="bg-orange-600 p-4 rounded space-y-1">
              <p><strong>Data:</strong> {dataFormatada}</p>
              <p><strong>Hora:</strong> {escalaDoDia.hora}</p>
              <p><strong>Culto:</strong> {escalaDoDia.culto}</p>
              <p><strong>Pastor:</strong> {escalaDoDia.pastor}</p>
              <p><strong>Dirigente:</strong> {escalaDoDia.dirigente}</p>
              <p><strong>Líderes:</strong> {escalaDoDia.lideres}</p>
              <p><strong>Diaconia:</strong> {escalaDoDia.diaconia}</p>
              <p><strong>Louvor:</strong> {escalaDoDia.louvor}</p>
              <p><strong>Comunicação:</strong> {escalaDoDia.comunicacao}</p>
              <p><strong>Dança:</strong> {escalaDoDia.danca}</p>
              <p><strong>Rede Kids:</strong> {escalaDoDia.redeKids}</p>
              <p><strong>Rede Mulheres:</strong> {escalaDoDia.redeMulheres}</p>
              <p><strong>Rede Família:</strong> {escalaDoDia.redeFamilia}</p>
              <p><strong>Plugger:</strong> {escalaDoDia.plugger}</p>
              <p><strong>Limpeza:</strong> {escalaDoDia.limpeza}</p>
            </div>
          ) : (
            <p className="text-gray-400">Nenhuma escala para o dia selecionado.</p>
          )}
        </div>
      </div>
    </>
  )
}
