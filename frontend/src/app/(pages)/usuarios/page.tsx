"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  level: string;
  active: boolean;
  phone?: string;
  photo?: string;
  ministryId: string;
  resetToken?: null;
  resetExpires?: null;
  oldSenha?: string;
}

interface ValidationErrors {
  [key: string]: string | undefined;
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  photo?: string;
  general?: string;
}

export default function Usuarios() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState<ValidationErrors>({});
  const [editFormErrors, setEditFormErrors] = useState<ValidationErrors>({});
  const accessToken = session?.accessToken;
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // Estado para o modal de editar

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    oldSenha: "",
    phone: "",
    photo: "",
    level: "VOLUNT",
    photoURL: "",
    active: true,
    ministryId: "",
    resetToken: null,
    resetExpires: null,
  });

  const [editUser, setEditUser] = useState<User | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") {
      router.push("/");
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken || ""}`,
          },
        });

        if (!res.ok) {
          // If the response is not OK (e.g., 4xx or 5xx status)
          const errorData = await res.json(); // Try to parse the error message
          console.error("Failed to fetch users:", res.status, errorData);
          // Optionally, set an error message in state to display to the user
          // setErrorMessage("Erro ao carregar dados dos usuários.");
          setUsers([]); // Ensure users is always an empty array on error
          setLoading(false);
          return; // Stop execution here
        }

        const data = await res.json();
        // Validate if the data received is actually an array
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("API returned non-array data for users:", data);
          // Handle unexpected data format, e.g., set to empty array
          // setErrorMessage("Formato de dados inesperado ao carregar usuários.");
          setUsers([]); // Ensure users is an empty array if data is not an array
        }
        setLoading(false);
      } catch (error) {
        // Handle network errors or issues during JSON parsing
        console.error("Error during fetchUsers:", error);
        // setErrorMessage("Erro de rede ao carregar dados dos usuários.");
        setUsers([]); // Ensure users is an empty array on network error
        setLoading(false);
      }
    };

    fetchUsers();
  }, [session, status, router, accessToken]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      const resApi = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken || ""}`,
          },
        }
      );
      console.log("Access token para delete:", accessToken);

      if (!resApi.ok)
        throw new Error("Erro ao deletar o usuário na API principal.");

      const resFirebase = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/firebase/delete/user/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!resFirebase.ok) {
        console.warn(
          "Usuário excluído da API, mas houve erro ao deletar do Firebase."
        );
        // Aqui você pode notificar o usuário ou registrar para correção posterior.
      }

      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      alert("Ocorreu um erro ao excluir o usuário. Tente novamente.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === "radio" ? value === "true" : value;
    setNewUser({ ...newUser, [name]: val });
  };

  const parseValidationErrors = (messages: string[]): ValidationErrors => {
    const errors: ValidationErrors = {}; // Tipagem correta
    messages.forEach((msg) => {
      const fieldMatch = msg.match(/'(.+?)'/);
      const field = fieldMatch ? fieldMatch[1] : null;

      if (field) {
        errors[field] = msg;
      } else if (msg.toLowerCase().includes("email")) {
        errors.email = msg;
      } else if (msg.toLowerCase().includes("senha")) {
        errors.password = msg;
      } else if (msg.toLowerCase().includes("telefone")) {
        errors.phone = msg;
      } else if (msg.toLowerCase().includes("nome")) {
        errors.name = msg;
      } else {
        errors.general = msg;
      }
    });
    return errors;
  };

  const handleAddUser = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken || ""}`,
        },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();

      if (!res.ok) {
        // Tratamento específico para erro de conflito
        if (res.status === 409) {
          setFormErrors({
            ...formErrors,
            email: "Este e-mail já está em uso",
          });
          return;
        }

        // Validação de erros genéricos
        if (res.status === 400 && Array.isArray(data.message)) {
          const errors = parseValidationErrors(data.message);
          setFormErrors(errors);
        } else {
          alert("Erro ao adicionar usuário.");
        }
        return;
      }

      setUsers([...users, data]);
      setShowModal(false);
      setNewUser({
        name: "",
        email: "",
        password: "",
        oldSenha: "",
        phone: "",
        photo: "",
        photoURL: "",
        level: "VOLUNT",
        active: true,
        ministryId: "",
        resetToken: null,
        resetExpires: null,
      });
      setFormErrors({});
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      alert("Erro de conexão");
    }
  };

  const parseEditValidationErrors = (messages: string[]): ValidationErrors => {
    const errors: ValidationErrors = {};
    messages.forEach((msg) => {
      const fieldMatch = msg.match(/'(.+?)'/);
      const field = fieldMatch ? fieldMatch[1] : null;

      if (field) {
        errors[field] = msg;
      } else if (msg.toLowerCase().includes("email")) {
        errors.email = msg;
      } else if (
        msg.toLowerCase().includes("senha") ||
        msg.toLowerCase().includes("password")
      ) {
        errors.password = msg;
      } else if (
        msg.toLowerCase().includes("telefone") ||
        msg.toLowerCase().includes("phone")
      ) {
        errors.phone = msg;
      } else if (
        msg.toLowerCase().includes("nome") ||
        msg.toLowerCase().includes("name")
      ) {
        errors.name = msg;
      } else {
        errors.general = msg;
      }
    });
    return errors;
  };

  const handleEditUser = async () => {
    if (editUser) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${editUser.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken || ""}`,
          },

          body: JSON.stringify(
            Object.fromEntries(
              Object.entries(editUser).filter(
                ([value]) =>
                  value !== "" && value !== null && value !== undefined
              )
            )
          ),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        const messages = errorData.message || [
          errorData.error || "Erro desconhecido",
        ];
        const errors = parseEditValidationErrors(
          Array.isArray(messages) ? messages : [messages]
        );
        setEditFormErrors(errors);
        return;
      }

      const updatedUser = await res.json();
      setUsers(
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      setShowEditModal(false);
      setEditFormErrors({}); // limpar erros ao fechar
    }
  };

  const handleEditClick = (user: User) => {
    setEditUser(user);
    setEditFormErrors({});
    setShowEditModal(true);
  };

  if (status === "loading" || !session || session.user.role !== "ADMIN") {
    return <p className="text-center mt-10">Carregando...</p>;
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

        {/*Tabela para amostrar usuarios*/}
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-gray-600 text-sm uppercase">
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Telefone</th>
                <th className="px-4 py-3">Nível</th>
                <th className="px-4 py-3">Ativo</th>
                <th className="px-4 py-3">Ministerio</th>
                <th className="px-4 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {currentUsers.map((user, index) => (
                <tr
                  key={user.id || index}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.phone || "-"}</td>
                  <td className="px-4 py-3">{user.level}</td>
                  <td className="px-4 py-3">{user.active ? "Sim" : "Não"}</td>
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

          <p className="text-sm text-gray-500 mt-2 mb-4 ml-4">
            {currentUsers.length} Usuarios
          </p>

          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Anterior
            </button>
            <span className="flex items-center px-4 py-2 text-gray-700 font-medium">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Próxima
            </button>
          </div>
        </div>
      </main>

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

            <h2 className="text-2xl text-black font-bold mb-4">
              Adicionar Novo Usuário
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                value={newUser.name || ""}
                maxLength={100}
                onChange={handleInputChange}
                className="border text-black p-2 rounded"
                placeholder="Nome"
              />
              {formErrors.name && (
                <p className="text-red-600 text-sm">{formErrors.name}</p>
              )}
              <input
                name="email"
                value={newUser.email || ""}
                maxLength={256}
                onChange={handleInputChange}
                className="border text-black p-2 rounded"
                placeholder="Email"
              />
              {formErrors.email && (
                <p className="text-red-600 text-sm">{formErrors.email}</p>
              )}
              <input
                name="password"
                type="password"
                value={newUser.password || ""}
                minLength={6}
                maxLength={64}
                onChange={handleInputChange}
                className="border text-black p-2 rounded"
                placeholder="Senha"
              />
              {formErrors.password && (
                <p className="text-red-600 text-sm">{formErrors.password}</p>
              )}
              <input
                name="phone"
                value={newUser.phone || ""}
                onChange={handleInputChange}
                className="border text-black p-2 rounded"
                placeholder="Telefone"
              />
              {formErrors.phone && (
                <p className="text-red-600 text-sm">{formErrors.phone}</p>
              )}
              <input
                name="ministryId"
                value={newUser.ministryId || ""}
                onChange={handleInputChange}
                className="border text-black p-2 rounded"
                placeholder="Ministério"
              />
              <select
                name="level"
                value={newUser.level}
                onChange={handleInputChange}
                className="border p-2 text-black rounded"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="LIDER">Líder</option>
                <option value="VOLUNT">Voluntário</option>
                <option value="COMUNIC">Comunicação</option>
              </select>

              <div>
                <label className="block text-black font-medium">Ativo</label>
                <input
                  type="checkbox"
                  name="active"
                  checked={newUser.active}
                  onChange={(e) =>
                    setNewUser({ ...newUser, active: e.target.checked })
                  }
                />
              </div>
            </div>

            <button
              onClick={handleAddUser}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg mt-6"
            >
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

            <h2 className="text-2xl text-black font-bold mb-4">
              Editar Usuário
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                value={editUser.name || ""}
                onChange={(e) =>
                  setEditUser({ ...editUser, name: e.target.value })
                }
                maxLength={100}
                className="border text-black p-2 rounded"
                placeholder="Nome"
              />
              {editFormErrors.name && (
                <p className="text-red-600 text-sm">{editFormErrors.name}</p>
              )}
              <input
                name="email"
                value={editUser.email || ""}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
                maxLength={256}
                className="border text-black p-2 rounded"
                placeholder="Email"
              />
              {editFormErrors.email && (
                <p className="text-red-600 text-sm">{editFormErrors.email}</p>
              )}

              <input
                name="password"
                type="password"
                onChange={(e) =>
                  setEditUser({ ...editUser, password: e.target.value })
                }
                minLength={6}
                maxLength={64}
                className="border text-black p-2 rounded"
                placeholder="password"
              />

              <input
                name="oldSenha"
                type="password"
                onChange={(e) =>
                  setEditUser({ ...editUser, oldSenha: e.target.value })
                }
                minLength={6}
                maxLength={64}
                className="border text-black p-2 rounded"
                placeholder="Senha Atual"
              />

              {editFormErrors.password && (
                <p className="text-red-600 text-sm">
                  {editFormErrors.password}
                </p>
              )}
              <input
                name="phone"
                value={editUser.phone || ""}
                onChange={(e) =>
                  setEditUser({ ...editUser, phone: e.target.value })
                }
                maxLength={100}
                className="border text-black p-2 rounded"
                placeholder="Telefone"
              />
              {editFormErrors.phone && (
                <p className="text-red-600 text-sm">{editFormErrors.phone}</p>
              )}
              <input
                name="ministryId"
                value={editUser.ministryId}
                onChange={(e) =>
                  setEditUser({ ...editUser, ministryId: e.target.value })
                }
                maxLength={100}
                className="border text-black p-2 rounded"
                placeholder="Ministério"
              />
              <select
                name="level"
                value={editUser.level || ""}
                onChange={(e) =>
                  setEditUser({ ...editUser, level: e.target.value })
                }
                className="border p-2 text-black rounded"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="LIDER">Líder</option>
                <option value="VOLUNT">Voluntario</option>
                <option value="COMUNIC">Comunicação</option>
              </select>

              <div>
                <label className="block text-black font-medium">Ativo</label>
                <input
                  type="checkbox"
                  name="active"
                  checked={editUser.active}
                  onChange={(e) =>
                    setEditUser({ ...editUser, active: e.target.checked })
                  }
                />
              </div>
            </div>

            <button
              onClick={handleEditUser}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg mt-6"
            >
              Atualizar Usuário
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
