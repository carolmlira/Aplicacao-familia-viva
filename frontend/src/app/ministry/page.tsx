'use client'
import { useSession } from "next-auth/react"; // Pega a sessão atual (quem está logado e suas permissões).
import { useEffect, useState } from 'react' // Para redirecionar o usuário se ele não for admin.
import { useRouter } from "next/navigation"; // Para redirecionamento
import Link from "next/link"; // Para criar navegação sem recarregar a página.

interface Ministry {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

export default function Ministries() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const accessToken = (session as { accessToken?: string })?.accessToken;
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newMinistry, setNewMinistry] = useState({
    name: "",
    description: "",
    active: true, //Por enquanto
  });

  const [editMinistry, setEditMinistry] = useState<Ministry | null>(null);


  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user).role !== "ADMIN") {
      router.push("/");
      return;
    }

    const fetchMinistries = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ministries`, {
          headers: {
            Authorization: `Bearer ${accessToken || ''}`,
          },
        });
        const data = await res.json();
        setMinistries(data);
      } catch (error) {
        console.error("Erro ao buscar ministérios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMinistries();
  }, [session, status, router, accessToken]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este ministério?")) return;
  
    try {
      await fetch(`http://localhost:3000/ministries/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken || ''}`,
        },
      });
  
      setMinistries((prevMinistries) => prevMinistries.filter((ministry) => ministry.id !== id));
    } catch (error) {
      console.error("Erro ao deletar ministério:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === "radio" ? value === "true" : value;
    setNewMinistry({ ...newMinistry, [name]: val });
  };
  
  const handleAddMinistry = async () => {
    const res = await fetch("http://localhost:3000/ministries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken || ''}`,
      },
      body: JSON.stringify(newMinistry),
    });

    const ministry = await res.json();
    setMinistries([...ministries, ministry]);
    setShowModal(false);
    setNewMinistry({
      name: "",
      description: "",
      active: true,
    });
  };

  const handleEditMinistry = async () => {
    if (editMinistry) {
      const res = await fetch(`http://localhost:3000/ministries/${editMinistry.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken || ''}`,
        },
        body: JSON.stringify(editMinistry),
      });
  
      const updatedMinistry = await res.json();
      setMinistries(ministries.map(ministry => ministry.id === updatedMinistry.id ? updatedMinistry : ministry));
      setShowEditModal(false);
    }
  };

  const handleEditClick = (ministry: Ministry) => {
    setEditMinistry(ministry);
    setShowEditModal(true);
  };
  
  if (status === "loading" || !session || (session.user).role !== "ADMIN") {
    return <p className="text-center mt-10">404 Not Found, Voltando para Página inicial...</p>;
  }

  return (
    <div className="min-h-screen bg-black py-10 px-6">
      <main className="max-w-7xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Ministérios</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
          >
            + Adicionar Ministério
          </button>
        </div>

        {/* Tabela para mostrar ministérios */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-gray-600 text-sm uppercase">
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Descrição</th>
                <th className="px-4 py-3">Ativo</th>
                <th className="px-4 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {ministries.map((ministry, index) => (
                <tr key={ministry.id || index} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{ministry.name}</td>
                  <td className="px-4 py-3">{ministry.description}</td>
                  <td className="px-4 py-3">{ministry.active ? "Sim" : "Não"}</td>
                  <td className="px-4 py-3 flex justify-center gap-3">
                    <button
                      onClick={() => handleEditClick(ministry)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1.5 rounded-lg transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(ministry.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg transition"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <footer className="mt-10 text-center">
  <Link href="/">
    <button className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-lg transition">
      Voltar
    </button>
  </Link>
</footer>

{/* POP-UP de Adicionar Ministério */}
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-2xl p-8 w-full max-w-xl relative">
      <button
        className="absolute top-4 right-4 text-xl font-bold text-gray-700"
        onClick={() => setShowModal(false)}
      >
        ×
      </button>

      <h2 className="text-2xl text-black font-bold mb-4">Adicionar Novo Ministério</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          value={newMinistry.name}
          onChange={handleInputChange}
          className="border text-black p-2 rounded"
          placeholder="Nome do Ministério"
        />
        <input
          name="description"
          value={newMinistry.description}
          onChange={handleInputChange}
          className="border text-black p-2 rounded"
          placeholder="Descrição"
        />
        <div>
          <label className="block text-black font-medium">Ativo</label>
          <input
            type="checkbox"
            name="active"
            checked={newMinistry.active}
            onChange={(e) => setNewMinistry({ ...newMinistry, active: e.target.checked })}
          />
        </div>
      </div>

      <button onClick={handleAddMinistry} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg mt-6">
        Adicionar Ministério
      </button>
    </div>
  </div>
)}

{/* POP-UP de Editar Ministério */}
{showEditModal && editMinistry && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-2xl p-8 w-full max-w-xl relative">
      <button
        className="absolute top-4 right-4 text-xl font-bold text-gray-700"
        onClick={() => setShowEditModal(false)}
      >
        ×
      </button>

      <h2 className="text-2xl text-black font-bold mb-4">Editar Ministério</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          value={editMinistry.name}
          onChange={(e) => setEditMinistry({ ...editMinistry, name: e.target.value })}
          className="border text-black p-2 rounded"
          placeholder="Nome do Ministério"
        />
        <input
          name="description"
          value={editMinistry.description}
          onChange={(e) => setEditMinistry({ ...editMinistry, description: e.target.value })}
          className="border text-black p-2 rounded"
          placeholder="Descrição"
        />
        <div>
          <label className="block text-black font-medium">Ativo</label>
          <input
            type="checkbox"
            name="active"
            checked={editMinistry.active}
            onChange={(e) => setEditMinistry({ ...editMinistry, active: e.target.checked })}
          />
        </div>
      </div>

      <button onClick={handleEditMinistry} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg mt-6">
        Atualizar Ministério
      </button>
    </div>
  </div>
)}
    </div>
  ); 
}

