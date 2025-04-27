"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  password?:string;
  level: string;
  active: boolean;
  phone?: string;
  photo?: string;
  whatsappOptIn: boolean;
  ministryId: string;
}

export default function Usuarios() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // Estado para o modal de editar

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    photo: "",
    level: "VOLUNT",
    active: true,
    whatsappOptIn: false,
    ministryId: "Ministerio Viv",
  });

  const [editUser, setEditUser] = useState<User | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as any).role !== "ADMIN") {
      router.push("/");
      return;
    }

    const fetchUsers = async () => {
      const res = await fetch("http://localhost:3000/users", {
        headers: {
          Authorization: `Bearer ${(session as any).accessToken}`,
        },
      });
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    };

    fetchUsers();
  }, [session, status, router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    await fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${(session as any).accessToken}`,
      },
    });

    setUsers(users.filter((user) => user.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "radio" ? value === "true" : value;
    setNewUser({ ...newUser, [name]: val });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewUser({ ...newUser, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddUser = async () => {
    const res = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${(session as any).accessToken}`,
      },
      body: JSON.stringify(newUser),
    });

    const user = await res.json();
    setUsers([...users, user]);
    setShowModal(false);
    setNewUser({
      name: "",
      email: "",
      password: "",
      phone: "",
      photo: "",
      level: "VOLUNT",
      active: true,
      whatsappOptIn: false,
      ministryId: "Ministerio Viv",
    });
  };

  const handleEditUser = async () => {
    if (editUser) {
      const res = await fetch(`http://localhost:3000/users/${editUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(session as any).accessToken}`,
        },
        body: JSON.stringify(editUser),
      });

      const updatedUser = await res.json();
      setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
      setShowEditModal(false);
    }
  };

  const handleEditClick = (user: User) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  if (status === "loading" || !session || (session.user as any).role !== "ADMIN") {
    return <p className="text-center mt-10">404 Not Found, Voltando para Página inicial...</p>;
  }

  return (
    <div className="min-h-screen bg-black py-10 px-6">
      <main className="max-w-7xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Usuários</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
          >
            + Adicionar Usuário
          </button>
        </div>
         {/*Tabela para amostrar usuarios*/ }
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-gray-600 text-sm uppercase">
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Telefone</th>
                <th className="px-4 py-3">Nível</th>
                <th className="px-4 py-3">Ativo</th>
                <th className="px-4 py-3">WhatsApp</th>
                <th className="px-4 py-3">Ministerio</th>
                <th className="px-4 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {users.map((user, index) => (
                <tr key={user.id || index} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.phone || "-"}</td>
                  <td className="px-4 py-3">{user.level}</td>
                  <td className="px-4 py-3">{user.active ? "Sim" : "Não"}</td>
                  <td className="px-4 py-3">{user.whatsappOptIn ? "Sim" : "Não"}</td>
                  <td className="px-4 py-3">{user.ministryId}</td>
                  <td className="px-4 py-3 flex justify-center gap-3">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1.5 rounded-lg transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
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

      {/* POP-UP de Adicionar Usuário */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-xl relative">
            <button
              className="absolute top-4 right-4 text-xl font-bold text-gray-700"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>

            <h2 className="text-2xl text-black font-bold mb-4">Adicionar Novo Usuário</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" value={newUser.name} onChange={handleInputChange} className="border text-black p-2 rounded" placeholder="Nome" />
              <input name="email" value={newUser.email} onChange={handleInputChange} className="border text-black p-2 rounded" placeholder="Email" />
              <input name="password" type="password" value={newUser.password} onChange={handleInputChange} className="border text-black p-2 rounded" placeholder="Senha" />
              <input name="phone" value={newUser.phone} onChange={handleInputChange} className="border text-black p-2 rounded" placeholder="Telefone" />
              <input name="ministryId" value={newUser.ministryId} onChange={handleInputChange} className="border text-black p-2 rounded" placeholder="ID do Ministério" />
              <input
               name="photo"
               type="text"
               value={newUser.photo}
               onChange={handleInputChange}
               className="border text-black p-2 rounded"
               placeholder="URL da Foto"
              />
              <select name="level" value={newUser.level} onChange={handleInputChange} className="border p-2 text-black rounded">
                <option value="ADMIN">ADMIN</option>
                <option value="VOLUNT">VOLUNT</option>
                <option value="COMUNIC">COMUNIC</option>
              </select>

              <div>
                <label className="block text-black font-medium">Ativo</label>
                <input
                  type="checkbox"
                  name="active"
                  checked={newUser.active}
                  onChange={(e) => setNewUser({ ...newUser, active: e.target.checked })}
                />
              </div>
            </div>

            <div>
          <label className="block text-black font-medium">Whatsapp Ativo?</label>
          <input
            type="checkbox"
            name="whatsappOptIn"
            checked={newUser.whatsappOptIn}
            onChange={(e) => setNewUser({ ...newUser, whatsappOptIn: e.target.checked })}
          />
        </div>
            

            <button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg mt-6">
              Adicionar Usuário
            </button>
          </div>
        </div>
      )}

      {/* POP-UP de Editar Usuário */}
{showEditModal && editUser && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-2xl p-8 w-full max-w-xl relative">
      <button
        className="absolute top-4 right-4 text-xl font-bold text-gray-700"
        onClick={() => setShowEditModal(false)}
      >
        ×
      </button>

      <h2 className="text-2xl text-black font-bold mb-4">Editar Usuário</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          value={editUser.name}
          onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
          className="border text-black p-2 rounded"
          placeholder="Nome"
        />
        <input
          name="email"
          value={editUser.email}
          onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
          className="border text-black p-2 rounded"
          placeholder="Email"
        />

        <input
          name="password"
          type="password"
          value={editUser.password}
          onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
          className="border text-black p-2 rounded"
          placeholder="password"
        />

        <input
          name="phone"
          value={editUser.phone || ""}
          onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
          className="border text-black p-2 rounded"
          placeholder="Telefone"
        />
        <input
          name="ministryId"
          value={editUser.ministryId}
          onChange={(e) => setEditUser({ ...editUser, ministryId: e.target.value })}
          className="border text-black p-2 rounded"
          placeholder="ID do Ministério"
        />
        <input
          name="photo"
          value={editUser.photo || ""}
          onChange={(e) => setEditUser({ ...editUser, photo: e.target.value })}
          className="border text-black p-2 rounded"
          placeholder="URL da Foto"
        />
        <select
          name="level"
          value={editUser.level}
          onChange={(e) => setEditUser({ ...editUser, level: e.target.value })}
          className="border p-2 text-black rounded"
        >
          <option value="ADMIN">ADMIN</option>
          <option value="VOLUNT">VOLUNT</option>
          <option value="COMUNIC">COMUNIC</option>
        </select>

        <div>
          <label className="block text-black font-medium">Ativo</label>
          <input
            type="checkbox"
            name="active"
            checked={editUser.active}
            onChange={(e) => setEditUser({ ...editUser, active: e.target.checked })}
          />
        </div>

        {/* Campo WhatsappOptIn */}
        <div>
          <label className="block text-black font-medium">Whatsapp Ativo?</label>
          <input
            type="checkbox"
            name="whatsappOptIn"
            checked={editUser.whatsappOptIn}
            onChange={(e) => setEditUser({ ...editUser, whatsappOptIn: e.target.checked })}
          />
        </div>
      </div>

      <button onClick={handleEditUser} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg mt-6">
        Atualizar Usuário
      </button>
    </div>
  </div>
)}
    </div>
  );
}
