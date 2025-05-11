"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Link from "next/link";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Escala() {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <main className="w-full max-w-md p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Escala</h1>

        <div>
          <Calendar onChange={onChange} value={value} />
        </div>
      </main>

      <footer className="mt-8 text-sm text-gray-500">
        <Link href="/">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Voltar
          </button>
        </Link>
      </footer>
    </div>
  );
}
