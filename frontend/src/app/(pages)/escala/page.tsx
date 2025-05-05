"use client";

import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { useSession } from "next-auth/react";
import "react-calendar/dist/Calendar.css";
import { ptBR } from "date-fns/locale";
import { parseISO } from "date-fns";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

type Schedule = {
  id: string;
  date: string;
  description: string;
  available: boolean;
  confirmed?: boolean;
  userId: string;
  ministryId: string;
  userName?: string;
};

export default function Escala() {
  const { data: session, status } = useSession();
  const [value, onChange] = useState<Value>(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]); // Confirmadas
  const [adminSchedules, setAdminSchedules] = useState<Schedule[]>([]);
  const [pendingSchedules, setPendingSchedules] = useState<Schedule[]>([]); // Pendentes
  const [description, setDescription] = useState("");
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(
    null
  );
  const [selectedUserName, setSelectedUserName] = useState("");
  const [confirmedSchedules, setConfirmedSchedules] = useState<Schedule[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [availablecurrentPage, setAvailableCurrentPage] = useState(1);
  const [scheduleConfirmedCurrentPage, setScheduleConfirmedCurrentPage] =
    useState(1);
  const [confirmedCurrentPage, setConfirmedCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false); // Controle do modal
  const [showDescriptionTextArea, setShowDescriptionTextArea] = useState(false); // Controle do Modal de Text Area abaixo da tabela Disponibilidades
  const [newDate, setNewDate] = useState<string>("");
  const itemsPerPage = 5;
  const router = useRouter();
  const role = session?.user?.role;
  const userId = session?.user?.id;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // ou outra rota pública
    }

    if (role === "ADMIN") {
      fetchSchedulesByDate();
      fetchConfirmedSchedules();
    } else {
      fetchSchedulesByUser(); // Confirmadas
      fetchSchedulesByUserPeding(); // Pendentes
    }
  }, [role, session?.user?.id, status, router]);

  const fetchConfirmedSchedules = async () => {
    const res = await fetch(`http://localhost:3000/schedules/confirmed/all`);
    const data = await res.json();

    if (Array.isArray(data)) {
      const schedulesWithUserNames = await Promise.all(
        data.map(async (schedule: Schedule) => {
          const userRes = await fetch(
            `http://localhost:3000/users/${schedule.userId}`
          );
          return { ...schedule, userName: (await userRes.json()).name };
        })
      );
      setConfirmedSchedules(schedulesWithUserNames);
    } else {
      setConfirmedSchedules([]);
    }
  };

  const fetchSchedulesByDate = async () => {
    const res = await fetch(`http://localhost:3000/schedules/available/all`);
    const data = await res.json();

    if (Array.isArray(data)) {
      const schedulesWithUserNames = await Promise.all(
        data.map(async (schedule: Schedule) => {
          const userRes = await fetch(
            `http://localhost:3000/users/${schedule.userId}`
          );
          return { ...schedule, userName: (await userRes.json()).name };
        })
      );
      setAdminSchedules(schedulesWithUserNames);
    } else {
      setAdminSchedules([]);
    }
  };

  const fetchSchedulesByUser = async () => {
    const res = await fetch(`http://localhost:3000/schedules/user/${userId}`);
    const data = await res.json();
    setSchedules(Array.isArray(data) ? data : []);
  };

  const fetchSchedulesByUserPeding = async () => {
    const res = await fetch(
      `http://localhost:3000/schedules/user/${userId}/pending`
    );
    const data = await res.json();
    setPendingSchedules(Array.isArray(data) ? data : []);
  };

  const handleDateClick = async (date: Date) => {
    if (role === "ADMIN") return;

    const formattedDate = new Date(date).toISOString().split("T")[0];

    const isConfirmed = window.confirm(
      `Você deseja disponibilizar a data: ${formattedDate}?`
    );

    if (!isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:3000/schedules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: formattedDate,
          description: "",
          available: true,
          confirmed: false,
          ministryId: session?.user?.ministryId ?? "",
          userId: userId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erro ao enviar disponibilidade");
      }

      alert("Disponibilidade enviada!");
      fetchSchedulesByUser();
      fetchSchedulesByUserPeding();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Função para atualizar a escala
  const handleUpdateSchedule = async () => {
    if (!selectedScheduleId) return;
    const schedulee =
      schedules.find((s) => s.id === selectedScheduleId) ||
      confirmedSchedules.find((s) => s.id === selectedScheduleId);

    if (!schedulee) {
      alert(`Escala não encontrada. ${selectedScheduleId}`);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/schedules/${selectedScheduleId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description,
            date: newDate.split("T")[0],
            available: schedulee.available, // Garantir que a disponibilidade seja mantida
            confirmed: schedulee.confirmed, // Garantir que o status de confirmado seja mantido
            ministryId: schedulee.ministryId, // Garantir que o ministryId seja mantido
            userId: schedulee.userId,
          }),
        }
      );

      if (!res.ok) {
        alert("Erro ao atualizar escala");
        return;
      }

      alert("Escala atualizada com sucesso!");
      setDescription("");
      setSelectedScheduleId(null);
      setShowModal(false);
      fetchSchedulesByDate();
      fetchConfirmedSchedules();
    } catch (error) {
      alert("Erro ao atualizar escala");
    }
  };

  const handleConfirm = async () => {
    if (!selectedScheduleId) return;
    const schedule = schedules.find((s) => s.id === selectedScheduleId);
    if (!schedule) return;

    try {
      const res = await fetch(
        `http://localhost:3000/schedules/${selectedScheduleId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: schedule.userId,
            date: schedule.date,
            available: schedule.available,
            description: description,
            confirmed: true,
            ministryId: schedule.ministryId,
          }),
        }
      );

      if (!res.ok) {
        alert("Erro ao confirmar escala");
        return;
      }

      alert("Escala confirmada com sucesso!");
      setDescription("");
      setSelectedScheduleId(null);
      fetchSchedulesByDate();
      fetchSchedulesByUserPeding();
      fetchConfirmedSchedules();
    } catch (error) {
      alert("Erro ao confirmar escala");
    }
  };

  const handleDelete = async (scheduleId: string) => {
    if (!confirm("Tem certeza que deseja excluir essa escala?")) return;

    try {
      const res = await fetch(`http://localhost:3000/schedules/${scheduleId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Erro ao excluir escala");
        return;
      }

      alert("Escala excluída com sucesso!");
      fetchSchedulesByDate();
      fetchSchedulesByUserPeding();
      fetchSchedulesByUser();
      fetchConfirmedSchedules();
    } catch (error) {
      alert("Erro ao excluir escala");
    }
  };

  // 4. Função para editar um horário confirmado
  const handleEditConfirmed = (schedule: Schedule) => {
    setSelectedScheduleId(schedule.id);
    setDescription(schedule.description || "");
    setSelectedUserName(schedule.userName || "");
    setNewDate(schedule.date);
    setShowModal(true); // Exibe o modal
  };

  // 5. Função para deletar um horário confirmado
  const handleDeleteConfirmed = async (scheduleId: string) => {
    if (!confirm("Tem certeza que deseja excluir essa escala confirmada?"))
      return;

    try {
      const res = await fetch(`http://localhost:3000/schedules/${scheduleId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Erro ao excluir escala confirmada");
        return;
      }

      alert("Escala confirmada excluída com sucesso!");
      fetchConfirmedSchedules();
    } catch (error) {
      alert("Erro ao excluir escala confirmada");
    }
  };

  if (status === "loading") {
    return <p>Carregando...</p>; // Você pode estilizar ou usar um spinner
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-10">
      <h1 className="text-2xl font-bold mb-6">Escala</h1>

      <div className="flex flex-col lg:flex-row gap-8 w-full justify-center">
        {/* Calendário */}
        <div className="flex justify-center w-full max-w-md">
          <div className="w-full  p-2 min-h-[330px] flex items-center justify-center">
            <Calendar
              onChange={(date) => {
                onChange(date);
                if (date instanceof Date) {
                  handleDateClick(date);
                }
              }}
              value={value}
              minDate={new Date()}
              locale="pt-BR"
              className="w-full" // Para forçar o calendário a pegar toda largura
            />
          </div>
        </div>

        {/* Tabela de Escalas Confirmadas */}
        {role === "ADMIN" && (
          <div className="w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Escalas Confirmadas
            </h2>
            <table className="w-full border text-sm min-h-[330px]">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Dia</th>
                  <th className="p-2 border">Nome</th>
                  <th className="p-2 border">Ações</th>
                </tr>
              </thead>
              <tbody>
                {confirmedSchedules
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((schedule) => (
                    <tr key={schedule.id} className="border">
                      <td className="p-2">
                        {format(
                          parseISO(schedule.date),
                          "dd 'de' MMMM 'de' yyyy",
                          {
                            locale: ptBR,
                          }
                        )}
                      </td>
                      <td className="p-2">{schedule.userName}</td>
                      <td className="p-2 flex gap-2">
                        <button
                          onClick={() =>
                            alert(
                              `Descrição do ${schedule.userName}: ${schedule.description}`
                            )
                          }
                          className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                        >
                          Descrição
                        </button>

                        <button
                          onClick={() => handleEditConfirmed(schedule)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteConfirmed(schedule.id)}
                          className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}

                {/* Preencher até 5 linhas */}
                {Array.from({
                  length: Math.max(
                    0,
                    itemsPerPage -
                      confirmedSchedules.slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      ).length
                  ),
                }).map((_, idx) => (
                  <tr key={`empty-${idx}`}>
                    <td className="p-2 border h-10" colSpan={3}></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Modal de Edição */}
            {showModal && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded shadow-md relative w-full max-w-md">
                  <button
                    onClick={handleCloseModal}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                  >
                    x
                  </button>
                  <h2 className="text-xl font-semibold mb-4">Editar Escala</h2>
                  <div>
                    <label htmlFor="date" className="block mb-2">
                      Data
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full border p-2 rounded mb-4"
                    />
                    <label htmlFor="description" className="block mb-2">
                      Descrição
                    </label>
                    <div className="relative">
                      <textarea
                        id="description"
                        placeholder="Descrição do dia"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={1000}
                        className="w-full border rounded p-2 mb-4 pr-10 resize-none h-32"
                      />
                      <span className="absolute bottom-2 right-3 text-xs text-gray-500">
                        {description.length}/1000
                      </span>
                    </div>
                    <button
                      onClick={handleUpdateSchedule}
                      className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                    >
                      Atualizar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Paginação */}
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-300 rounded "
              >
                Anterior
              </button>

              <span>Página {currentPage}</span>

              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={
                  currentPage * itemsPerPage >= confirmedSchedules.length
                }
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tabela de Disponibilidades dos usuarios abaixo */}
      {role === "ADMIN" && (
        <div className="mt-12 w-full max-w-3xl">
          <h2 className="text-xl font-semibold mb-4">Disponibilidades</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Dia</th>
                <th className="p-2 border">Nome do Usuário</th>
                <th className="p-2 border">Ação</th>
              </tr>
            </thead>
            <tbody>
              {adminSchedules
                .slice(
                  (availablecurrentPage - 1) * itemsPerPage,
                  availablecurrentPage * itemsPerPage
                )
                .map((schedule) => (
                  <tr key={schedule.id} className="border">
                    <td className="p-2">
                      {format(
                        parseISO(schedule.date),
                        "dd 'de' MMMM 'de' yyyy",
                        {
                          locale: ptBR,
                        }
                      )}
                    </td>
                    <td className="p-2">{schedule.userName}</td>
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedScheduleId(schedule.id);
                          setSelectedUserName(schedule.userName || "");
                          setShowDescriptionTextArea(true);
                        }}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Aceitar
                      </button>
                      <button
                        onClick={() => handleDelete(schedule.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}

              {/* Preencher até 5 linhas */}
              {Array.from({
                length: Math.max(
                  0,
                  itemsPerPage -
                    adminSchedules.slice(
                      (availablecurrentPage - 1) * itemsPerPage,
                      availablecurrentPage * itemsPerPage
                    ).length
                ),
              }).map((_, idx) => (
                <tr key={`empty-${idx}`}>
                  <td className="p-2 border h-10" colSpan={3}></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginação */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              onClick={() =>
                setAvailableCurrentPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={availablecurrentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded "
            >
              Anterior
            </button>

            <span>Página {availablecurrentPage}</span>

            <button
              onClick={() => setAvailableCurrentPage((prev) => prev + 1)}
              disabled={availablecurrentPage * itemsPerPage >= schedules.length}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Próxima
            </button>
          </div>

          {selectedScheduleId && showDescriptionTextArea && (
            <div className="mt-4">
              <p>Escala de {selectedUserName}</p>
              <div className="relative">
                <textarea
                  id="description"
                  placeholder="Descrição do dia"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={1000}
                  className="w-full border rounded p-2 mb-4 pr-10 resize-none h-32"
                />
                <span className="absolute bottom-2 right-3 text-xs text-gray-500">
                  {description.length}/1000
                </span>
              </div>
              <button
                onClick={handleConfirm}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Confirmar
              </button>
            </div>
          )}
        </div>
      )}

      {/* tabela para usuarios verem Minhas Escalas Confirmadas (não Admin) */}
      {role !== "ADMIN" && (
        <>
          <div className="mt-8 w-full max-w-3xl">
            <h2 className="text-xl font-semibold mb-4">
              Minhas Escalas Confirmadas
            </h2>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Dia</th>
                  <th className="p-2 border">Ação</th>
                </tr>
              </thead>
              <tbody>
                {schedules
                  .slice(
                    (scheduleConfirmedCurrentPage - 1) * itemsPerPage,
                    scheduleConfirmedCurrentPage * itemsPerPage
                  )
                  .map((schedule) => (
                    <tr key={schedule.id} className="border">
                      <td className="p-2">
                        {format(
                          parseISO(schedule.date),
                          "dd 'de' MMMM 'de' yyyy",
                          {
                            locale: ptBR,
                          }
                        )}
                      </td>
                      <td className="p-2">
                        <button
                          onClick={() =>
                            alert(`Descrição: ${schedule.description}`)
                          }
                          className="bg-blue-600 text-white px-4 py-1 rounded"
                        >
                          Descrição
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Paginação */}
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() =>
                  setScheduleConfirmedCurrentPage((prev) =>
                    Math.max(prev - 1, 1)
                  )
                }
                disabled={scheduleConfirmedCurrentPage === 1}
                className="px-3 py-1 bg-gray-300 rounded "
              >
                Anterior
              </button>

              <span>Página {currentPage}</span>

              <button
                onClick={() =>
                  setScheduleConfirmedCurrentPage((prev) => prev + 1)
                }
                disabled={
                  scheduleConfirmedCurrentPage * itemsPerPage >=
                  schedules.length
                }
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Próxima
              </button>
            </div>
          </div>

          {/*Tabela disponibilidades pendentes*/}
          <div className="mt-8 w-full max-w-3xl">
            <h2 className="text-xl font-semibold mb-4">
              Minhas Disponibilidades Pendentes
            </h2>

            <table className="w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Dia</th>
                  <th className="p-2 border">Ação</th>
                </tr>
              </thead>
              <tbody>
                {pendingSchedules
                  .slice(
                    (confirmedCurrentPage - 1) * itemsPerPage,
                    confirmedCurrentPage * itemsPerPage
                  )
                  .map((schedule) => (
                    <tr key={schedule.id} className="border">
                      <td className="p-2">
                        {format(
                          parseISO(schedule.date),
                          "dd 'de' MMMM 'de' yyyy",
                          {
                            locale: ptBR,
                          }
                        )}
                      </td>
                      <td className="p-2">
                        <button
                          onClick={() => handleDelete(schedule.id)}
                          className="bg-red-600 text-white px-4 py-1 rounded"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Paginação */}
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() =>
                  setConfirmedCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={confirmedCurrentPage === 1}
                className="px-3 py-1 bg-gray-300 rounded "
              >
                Anterior
              </button>

              <span>Página {confirmedCurrentPage}</span>

              <button
                onClick={() => setConfirmedCurrentPage((prev) => prev + 1)}
                disabled={
                  confirmedCurrentPage * itemsPerPage >= pendingSchedules.length
                }
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Próxima
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
