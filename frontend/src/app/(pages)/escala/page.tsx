"use client";

import { useState, useEffect, useCallback } from "react";
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
  time?: Date;
};

export default function Escala() {
  const { data: session, status } = useSession();

  const [value, onChange] = useState<Value>(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]); // Confirmadas
  const [adminSchedules, setAdminSchedules] = useState<Schedule[]>([]);
  const [pendingSchedules, setPendingSchedules] = useState<Schedule[]>([]); // Pendentes

  const [confirmedDescription, setConfirmedDescription] = useState("");
  const [availableDescription, setAvailableDescription] = useState("");
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<string>("");

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
  const [addDate, setAddDate] = useState<string>(selectedDate || "");
  const [addDescription, setAddDescription] = useState<string>("");
  const [addTime, setAddTime] = useState<string>(""); // novo estado para a hora

  const [, setDescription] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const itemsPerPage = 5;
  const router = useRouter();
  const role = session?.user?.role;
  const userId = session?.user?.id;

  useEffect(() => {
    setAddDate(selectedDate);
  }, [selectedDate]);

  const fetchConfirmedSchedules = useCallback(async (token: string) => {
    console.log(token);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/schedules/confirmed/all`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();

    if (Array.isArray(data)) {
      const schedulesWithUserNames = await Promise.all(
        data.map(async (schedule: Schedule) => {
          const userRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/${schedule.userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token || ""}`,
              },
            }
          );
          return { ...schedule, userName: (await userRes.json()).name };
        })
      );
      schedulesWithUserNames.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setConfirmedSchedules(schedulesWithUserNames);
    } else {
      setConfirmedSchedules([]);
    }
  }, []);

  /*const fetchConfirmedLiderSchedules = useCallback( async (token: string) => {
    console.log("token ")
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/schedules/confirmed/my-ministry`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );

    if (!res.ok) {
      console.error(`Erro ao buscar escalas confirmadas: status ${res.status}`);
      setConfirmedLiderSchedules([]);
      return;
    }

    const data = await res.json();

    if (Array.isArray(data)) {
      const schedulesWithUserNames = await Promise.all(
        data.map(async (schedule: Schedule) => {
          const userRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/${schedule.userId}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
            }
          );

          const userData = await userRes.json();

          return {
            ...schedule,
            userName: userData.name,
          };
        })
      );

      schedulesWithUserNames.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setConfirmedLiderSchedules(schedulesWithUserNames);
    } else {
      setConfirmedLiderSchedules([]);
    }
  }, []); */

  const fetchSchedulesByDate = useCallback(async (token: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/schedules/available/all`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();

    if (Array.isArray(data)) {
      const schedulesWithUserNames = await Promise.all(
        data.map(async (schedule: Schedule) => {
          const userRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/${schedule.userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token || ""}`,
              },
            }
          );
          return { ...schedule, userName: (await userRes.json()).name };
        })
      );

      schedulesWithUserNames.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setAdminSchedules(schedulesWithUserNames);
    } else {
      setAdminSchedules([]);
    }
  }, []);

  /*  const //fetchSchedulesByDateByMinistry = useCallback( async (token: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/schedules/available/my-ministry`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();

    if (Array.isArray(data)) {
      const schedulesWithUserNames = await Promise.all(
        data.map(async (schedule: Schedule) => {
          const userRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/${schedule.userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return { ...schedule, userName: (await userRes.json()).name };
        })
      );
      schedulesWithUserNames.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setLiderSchedules(schedulesWithUserNames);
    } else {
      setLiderSchedules([]);
    }
  }, []); */

  const fetchSchedulesByUser = useCallback(
    async (token: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/schedules/user/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (Array.isArray(data)) {
        const sortedData = data.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setSchedules(sortedData);
      } else {
        setSchedules([]);
      }
    },
    [userId]
  );

  const fetchSchedulesByUserPeding = useCallback(
    async (token: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/schedules/user/${userId}/pending`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (Array.isArray(data)) {
        const sortedData = data.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setPendingSchedules(sortedData);
      } else {
        setPendingSchedules([]);
      }
    },
    [userId]
  );

  const handleDateClick = async (date: Date) => {
    if (role !== "ADMIN" && role !== "LIDER") return;

    const userRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );
    await userRes.json();

    // Converte a data para o formato 'YYYY-MM-DD'
    const formattedDate = date.toISOString().split("T")[0];

    setSelectedDate(formattedDate);
    setAddDate(formattedDate);
    setShowAddModal(true);
  };

  const handleConfirmAvailability = async () => {
    if (!addDate) return;

    try {
      const userRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      const user = await userRes.json();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/schedules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          date: addDate,
          time: addTime, // <- talvez isso esteja causando erro
          description: addDescription,
          available: true,
          confirmed: false,
          ministryId: user.ministryId,
          userId: userId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erro ao enviar disponibilidade");
      }

      alert("Disponibilidade enviada!");
      setShowAddModal(false);
      setDescription("");

      if (session?.accessToken) {
        await fetchSchedulesByDate(session.accessToken);
        await fetchSchedulesByUser(session.accessToken);
        await fetchSchedulesByUserPeding(session.accessToken);
        // await fetchSchedulesByDateByMinistry(session.accessToken);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Ocorreu um erro inesperado.");
      }
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
        `${process.env.NEXT_PUBLIC_API_URL}/schedules/${selectedScheduleId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`, // <=== Faltava isso!
          },
          body: JSON.stringify({
            description: confirmedDescription,
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
      setConfirmedDescription("");
      setSelectedScheduleId(null);
      setShowModal(false);

      if (session?.accessToken) {
        await fetchSchedulesByDate(session.accessToken);
        await fetchConfirmedSchedules(session.accessToken);
        await fetchSchedulesByUser(session.accessToken);
        await fetchSchedulesByUserPeding(session.accessToken);
        // await fetchConfirmedLiderSchedules(session.accessToken);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Erro ao atualizar escala: ${error.message}`);
      } else {
        alert("Erro ao atualizar escala.");
      }
    }
  };

  const handleConfirm = async () => {
    if (!selectedScheduleId) return;
    const schedule =
      schedules.find((s) => s.id === selectedScheduleId) ||
      adminSchedules.find((s) => s.id === selectedScheduleId);
    if (!schedule) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/schedules/${selectedScheduleId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify({
            userId: schedule.userId,
            date: schedule.date,
            available: schedule.available,
            description: availableDescription,
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
      setAvailableDescription("");
      setSelectedScheduleId(null);

      if (session?.accessToken) {
        await fetchSchedulesByUser(session.accessToken);
        await fetchSchedulesByDate(session.accessToken);
        await fetchSchedulesByUserPeding(session.accessToken);
        await fetchConfirmedSchedules(session.accessToken);
        //  await fetchConfirmedLiderSchedules(session.accessToken);
        // await fetchSchedulesByDateByMinistry(session.accessToken);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Erro ao atualizar escala: ${error.message}`);
      } else {
        alert("Erro ao atualizar escala.");
      }
    }
  };

  const handleDelete = async (scheduleId: string) => {
    if (!confirm("Tem certeza que deseja excluir essa escala?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/schedules/${scheduleId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      if (!res.ok) {
        alert("Erro ao excluir escala");
        return;
      }

      alert("Escala excluída com sucesso!");

      if (session?.accessToken) {
        await fetchSchedulesByDate(session.accessToken);
        await fetchSchedulesByUserPeding(session.accessToken);
        await fetchSchedulesByUser(session.accessToken);
        await fetchConfirmedSchedules(session.accessToken);
        // await fetchConfirmedLiderSchedules(session.accessToken);
        // await fetchSchedulesByDateByMinistry(session.accessToken);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Erro ao atualizar escala: ${error.message}`);
      } else {
        alert("Erro ao atualizar escala.");
      }
    }
  };

  // 4. Função para editar um horário confirmado
  const handleEditConfirmed = (schedule: Schedule) => {
    setSelectedScheduleId(schedule.id);
    setConfirmedDescription(schedule.description || "");
    setNewDate(schedule.date);
    setShowModal(true); // Exibe o modal
  };

  // 5. Função para deletar um horário confirmado
  const handleDeleteConfirmed = async (scheduleId: string) => {
    if (!confirm("Tem certeza que deseja excluir essa escala confirmada?"))
      return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/schedules/${scheduleId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      if (!res.ok) {
        alert("Erro ao excluir escala confirmada");
        return;
      }

      alert("Escala confirmada excluída com sucesso!");

      if (session?.accessToken) {
        await fetchConfirmedSchedules(session.accessToken);
        await fetchSchedulesByUser(session.accessToken);
        //  await fetchConfirmedLiderSchedules(session.accessToken);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Erro ao atualizar escala: ${error.message}`);
      } else {
        alert("Erro ao atualizar escala.");
      }
    }
  };

  useEffect(() => {
    if (!session || !session.accessToken || !session.user?.id || !role) return;

    const token = session.accessToken;

    if (role === "ADMIN") {
      fetchConfirmedSchedules(token);
      fetchSchedulesByDate(token);
    } else if (role === "LIDER") {
      // fetchConfirmedLiderSchedules(token);
      //fetchSchedulesByDateByMinistry(token);
    }

    fetchSchedulesByUser(token);
    fetchSchedulesByUserPeding(token);
  }, [
    session,
    session?.accessToken,
    session?.user?.id,
    role,
    fetchConfirmedSchedules,
    fetchSchedulesByDate,
    // fetchConfirmedLiderSchedules,
    //fetchSchedulesByDateByMinistry,
    fetchSchedulesByUser,
    fetchSchedulesByUserPeding,
  ]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // ou outra rota pública
    }

    if (!session?.accessToken) return;

    if (role === "COMUNIC" || role === "VOLUNT") {
      fetchSchedulesByDate(session.accessToken);
      fetchConfirmedSchedules(session.accessToken);
      fetchSchedulesByUser(session.accessToken);
      fetchSchedulesByUserPeding(session.accessToken);
    } else if (role === "LIDER" || role === "ADMIN") {
      //  fetchConfirmedLiderSchedules(session.accessToken);
      fetchSchedulesByUser(session.accessToken);
      fetchSchedulesByUserPeding(session.accessToken);
      fetchSchedulesByDate(session.accessToken);
      //fetchSchedulesByDateByMinistry(session.accessToken);
    } else {
      fetchSchedulesByUser(session.accessToken); // Confirmadas
      fetchSchedulesByUserPeding(session.accessToken); // Pendentes
    }
  }, [
    role,
    session,
    session?.user?.id,
    session?.accessToken,
    status,
    router,
    fetchSchedulesByDate,
    fetchConfirmedSchedules,
    fetchSchedulesByUser,
    fetchSchedulesByUserPeding,
    //fetchConfirmedLiderSchedules,
    //fetchSchedulesByDateByMinistry,
  ]);

  if (status === "loading") {
    return <p style={{ textAlign: "center" }}>Carregando...</p>; // Você pode estilizar ou usar um spinner
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <div className="pl-8 pt-8 max-w-screen">
        <h1
          className="text-4xl font-bold text-left"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          <span className="bg-gradient-to-r from-[#FE3012] via-[#FE8719] to-[#FEC31A] bg-clip-text text-transparent">
            Escala
          </span>
        </h1>
      </div>

      <div className="min-h-screen flex flex-col items-center p-10">
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
                className="bg-white rounded-lg p-4 text-black mx-auto  w-full" // Para forçar o calendário a pegar toda largura
                tileClassName={({ date, view }) => {
                  if (view === "month") {
                    return schedules.some((schedule) => {
                      const [year, month, day] = schedule.date
                        .split("-")
                        .map(Number);
                      const scheduleDate = new Date(year, month - 1, day);

                      // Zerar horas para comparar com o clique
                      const calendarDate = new Date(date);
                      scheduleDate.setHours(0, 0, 0, 0);
                      calendarDate.setHours(0, 0, 0, 0);

                      return scheduleDate.getTime() === calendarDate.getTime();
                    })
                      ? "highlight-date"
                      : null;
                  }
                  return null;
                }}
              />
            </div>
          </div>

          {/* Tabela de ADMIN Escalas Confirmadas */}
          {(role === "ADMIN" || role === "LIDER") && (
            <div className="w-full overflow-x-auto">
              <div className="w-full max-w-full min-w-[900px]">
                <h2 className="text-xl font-semibold mb-4 text-center">
                  Escalas Confirmadas
                </h2>
                <table className="w-full border text-sm min-h-[330px] text-white">
                  <thead>
                    <tr className="bg-gray-200 text-black">
                      <th className="p-2 border">Dia</th>
                      <th className="p-2 border">Hora</th>
                      <th className="p-2 border">Nome</th>
                      <th className="p-2 border">Ministerio</th>
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
                          <td className="p-2">
                            {schedule.date && schedule.time
                              ? (() => {
                                  const isoString = `${schedule.date}T${schedule.time}`; // Exemplo: "2025-05-25T14:30"
                                  const datetime = new Date(isoString);
                                  return isNaN(datetime.getTime())
                                    ? "Hora inválida"
                                    : format(datetime, "HH:mm", {
                                        locale: ptBR,
                                      });
                                })()
                              : "—"}
                          </td>
                          <td className="p-2">{schedule.userName}</td>
                          <td className="p-2">{schedule.ministryId}</td>
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
                        <td className="p-2 border h-10" colSpan={4}></td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Janela de edição de descrição e data do usuario , update*/}
                {showModal && (
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center text-black">
                    <div className="bg-white p-6 rounded shadow-md relative w-full max-w-md text-black">
                      <button
                        onClick={handleCloseModal}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                      >
                        x
                      </button>
                      <h2 className="text-xl font-semibold mb-4 text-black">
                        Editar Escala
                      </h2>
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
                        <label
                          htmlFor="description"
                          className="block mb-2 text-black"
                        >
                          Descrição
                        </label>
                        <div className="relative text-black">
                          <textarea
                            id="description"
                            placeholder="Descrição do dia"
                            value={confirmedDescription}
                            onChange={(e) =>
                              setConfirmedDescription(e.target.value)
                            }
                            style={{ color: "black" }}
                            maxLength={1000}
                            className="w-full border rounded p-2 mb-4 pr-10 resize-none h-32 text-black"
                          />
                          <span className="absolute bottom-2 right-3 text-xs text-black-500">
                            {confirmedDescription.length}/1000
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
                <p className="text-sm text-gray-500 mb-4">
                  {confirmedSchedules.length} Escalas Confirmadas
                </p>
                {/* Paginação botão anterior e próximo */}
                <div className="flex justify-center items-center gap-4 mt-4 ">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-300 rounded text-black "
                  >
                    Anterior
                  </button>

                  <span>Página {currentPage}</span>

                  <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={
                      currentPage * itemsPerPage >= confirmedSchedules.length
                    }
                    className="px-3 py-1 bg-gray-300 rounded text-black"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            </div>
          )}

          {/*} {(role === "LIDER" || role === "ADMIN" )&& (
            <div className="w-full max-w-md overflow-x-auto">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Escalas Confirmadas Lider
              </h2>
              <table className="w-full border text-sm min-h-[330px]">
                <thead>
                  <tr className="bg-gray-200 text-black">
                    <th className="p-2 border">Dia</th>
                    <th className="p-2 border">Hora</th>
                    <th className="p-2 border">Nome</th>
                    <th className="p-2 border">Ministerio</th>
                    <th className="p-2 border">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {confirmedLiderSchedules
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
                        <td className="p-2">
                          {schedule.date && schedule.time
                            ? (() => {
                                const isoString = `${schedule.date}T${schedule.time}`; // Exemplo: "2025-05-25T14:30"
                                const datetime = new Date(isoString);
                                return isNaN(datetime.getTime())
                                  ? "Hora inválida"
                                  : format(datetime, "HH:mm", { locale: ptBR });
                              })()
                            : "—"}
                        </td>
                        <td className="p-2">{schedule.userName}</td>
                        <td className="p-2">{schedule.ministryId}</td>
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

                  {Array.from({
                    length: Math.max(
                      0,
                      itemsPerPage -
                        confirmedLiderSchedules.slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage
                        ).length
                    ),
                  }).map((_, idx) => (
                    <tr key={`empty-${idx}`}>
                      <td className="p-2 border h-10" colSpan={4}></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              /* Janela de edição de descrição e data do usuario 
              {showModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-4 text-black">
                  <div className="bg-white p-6 rounded shadow-md relative w-full max-w-md sm:max-w-md md:max-w-lg">
                    <button
                      onClick={handleCloseModal}
                      className="absolute top-2 right-2 text-gray-500 hover:text-black-700 text-xl font-bold"
                    >
                      x
                    </button>
                    <h2 className="text-xl font-semibold mb-4 text-center sm:text-left text-black">
                      Editar Escala
                    </h2>
                    <div>
                      <label htmlFor="date" className="block mb-2 text-black text-sm sm:text-base">
                        Data
                      </label>
                      <input
                        type="date"
                        id="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full text-black border p-2 rounded mb-4 text-sm sm:text-base"
                      />
                      <label htmlFor="description" className="block mb-2 text-sm sm:text-base text-black">
                        Descrição
                      </label>
                      <div className="relative">
                        <textarea
                          id="description"
                          placeholder="Descrição do dia"
                          value={confirmedDescription}
                          onChange={(e) => setConfirmedDescription(e.target.value)}
                          maxLength={1000}
                          className="w-full border rounded p-2 mb-4 pr-10 resize-none h-24 sm:h-32 text-sm sm:text-base"
                        />
                        <span className="absolute bottom-2 right-3 text-xs text-black-500">
                          {confirmedDescription.length}/1000
                        </span>
                      </div>
                      <button
                        onClick={handleUpdateSchedule}
                        className="bg-blue-600 text-black px-4 py-2 rounded w-full text-sm sm:text-base"
                      >
                        Atualizar
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <p className="text-sm text-gray-500 mb-4">
                {confirmedLiderSchedules.length} Escalas Confirmadas
              </p>
              {/* Paginação botão anterior e próximo /}
              <div className="flex justify-center items-center gap-4 mt-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-300 rounded text-black"
                >
                  Anterior
                </button>

                <span>Página {currentPage}</span>

                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={
                    currentPage * itemsPerPage >= confirmedLiderSchedules.length
                  }
                  className="px-3 py-1 bg-gray-300 rounded text-black"
                >
                  Próxima
                </button>
              </div>
            </div>
            
          )}
            */}
        </div>

        {/* Tabela de Disponibilidades dos usuarios para o Lider aceitar apenas o do mesmo ministerio e colocar descrição 
        {(role === "LIDER" || role === "ADMIN" )&& (
          <div className="w-full max-w-md overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4">Disponibilidades lider</h2>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-200 text-black">
                  <th className="p-2 border">Dia</th>
                  <th className="p-2 border">Hora</th>
                  <th className="p-2 border">Nome</th>
                  <th className="p-2 border">Ministerio</th>
                  <th className="p-2 border">Ações</th>
                </tr>
              </thead>
              <tbody>
                {LiderSchedules.slice(
                  (availablecurrentPage - 1) * itemsPerPage,
                  availablecurrentPage * itemsPerPage
                ).map((schedule) => (
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
                      {schedule.date && schedule.time
                        ? (() => {
                            const isoString = `${schedule.date}T${schedule.time}`; // Exemplo: "2025-05-25T14:30"
                            const datetime = new Date(isoString);
                            return isNaN(datetime.getTime())
                              ? "Hora inválida"
                              : format(datetime, "HH:mm", { locale: ptBR });
                          })()
                        : "—"}
                    </td>
                    <td className="p-2">{schedule.userName}</td>
                    <td className="p-2">{schedule.ministryId}</td>
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

                {/* Preencher até 5 linhas 
                {Array.from({
                  length: Math.max(
                    0,
                    itemsPerPage -
                      LiderSchedules.slice(
                        (availablecurrentPage - 1) * itemsPerPage,
                        availablecurrentPage * itemsPerPage
                      ).length
                  ),
                }).map((_, idx) => (
                  <tr key={`empty-${idx}`}>
                    <td className="p-2 border h-10" colSpan={4}></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="text-sm text-gray-500 mb-4">
              {LiderSchedules.length} Disponibilidades
            </p>

            {/* Paginação 
            <div className="flex justify-center items-center gap-4 mt-4 ">
              <button
                onClick={() =>
                  setAvailableCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={availablecurrentPage === 1}
                className="px-3 py-1 bg-gray-300 rounded text-black"
              >
                Anterior
              </button>

              <span>Página {availablecurrentPage}</span>

              <button
                onClick={() => setAvailableCurrentPage((prev) => prev + 1)}
                disabled={
                  availablecurrentPage * itemsPerPage >= LiderSchedules.length
                }
                className="px-3 py-1 bg-gray-300 rounded text-black"
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
                    value={availableDescription}
                    onChange={(e) => setAvailableDescription(e.target.value)}
                    maxLength={1000}
                    className="w-full border rounded p-2 mb-4 pr-10 resize-none h-32"
                  />
                  <span className="absolute bottom-2 right-3 text-xs text-gray-500">
                    {availableDescription.length}/1000
                  </span>
                </div>
                <div className=" flex gap-2">
                  <button
                    onClick={handleConfirm}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => {
                      setShowDescriptionTextArea(false);
                    }}
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded "
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </div>
        )} */}

        {/* Tabela de Disponibilidades dos usuarios para o ADMIN aceitar e colocar descrição */}
        {(role === "ADMIN" || role === "LIDER") && (
          <div className="w-full max-w-md mt-8 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-6 mt-4">
              Disponibilidades
            </h2>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-200 text-black">
                  <th className="p-2 border">Dia</th>
                  <th className="p-2 border">Hora</th>
                  <th className="p-2 border">Nome</th>
                  <th className="p-2 border">Ministerio</th>
                  <th className="p-2 border">Ações</th>
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
                      <td className="p-2">
                        {schedule.date && schedule.time
                          ? (() => {
                              const isoString = `${schedule.date}T${schedule.time}`; // Exemplo: "2025-05-25T14:30"
                              const datetime = new Date(isoString);
                              return isNaN(datetime.getTime())
                                ? "Hora inválida"
                                : format(datetime, "HH:mm", { locale: ptBR });
                            })()
                          : "—"}
                      </td>
                      <td className="p-2">{schedule.userName}</td>
                      <td className="p-2">{schedule.ministryId}</td>
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
                    <td className="p-2 border h-10" colSpan={4}></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="text-sm text-gray-500 mb-4">
              {adminSchedules.length} disponibilidades
            </p>

            {/* Paginação */}
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() =>
                  setAvailableCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={availablecurrentPage === 1}
                className="px-3 py-1 bg-gray-300 rounded text-black"
              >
                Anterior
              </button>

              <span>Página {availablecurrentPage}</span>

              <button
                onClick={() => setAvailableCurrentPage((prev) => prev + 1)}
                disabled={
                  availablecurrentPage * itemsPerPage >= adminSchedules.length
                }
                className="px-3 py-1 bg-gray-300 rounded text-black"
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
                    value={availableDescription}
                    onChange={(e) => setAvailableDescription(e.target.value)}
                    maxLength={1000}
                    className="w-full border rounded p-2 mb-4 pr-10 resize-none h-32 text-black"
                  />
                  <span className="absolute bottom-2 right-3 text-xs text-black-500">
                    {availableDescription.length}/1000
                  </span>
                </div>
                <div className=" flex gap-2">
                  <button
                    onClick={handleConfirm}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => {
                      setShowDescriptionTextArea(false);
                    }}
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded "
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <>
          {/* tabela para usuarios verem "Minhas Escalas Confirmadas" (não Admin) */}
          <div className="mt-8 w-full max-w-3xl">
            <h2 className="text-xl font-semibold mb-4">
              Minhas Escalas Confirmadas
            </h2>

            <table className="w-full border">
              <thead>
                <tr className="bg-gray-200 text-black">
                  <th className="p-2 border">Dia</th>
                  <th className="p-2 border">Hora</th>
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
                        {schedule.date && schedule.time
                          ? (() => {
                              const isoString = `${schedule.date}T${schedule.time}`; // Exemplo: "2025-05-25T14:30"
                              const datetime = new Date(isoString);
                              return isNaN(datetime.getTime())
                                ? "Hora inválida"
                                : format(datetime, "HH:mm", { locale: ptBR });
                            })()
                          : "—"}
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
            <p className="text-sm text-gray-500 mb-4">
              {schedules.length} escala{schedules.length !== 1 && "s"}{" "}
              confirmada
              {schedules.length !== 1 && "s"}
            </p>
            {/* Paginação */}
            <div className="flex justify-center items-center gap-4 mt-4 ">
              <button
                onClick={() =>
                  setScheduleConfirmedCurrentPage((prev) =>
                    Math.max(prev - 1, 1)
                  )
                }
                disabled={scheduleConfirmedCurrentPage === 1}
                className="px-3 py-1 bg-gray-300 rounded text-black"
              >
                Anterior
              </button>

              <span>Página {scheduleConfirmedCurrentPage}</span>

              <button
                onClick={() =>
                  setScheduleConfirmedCurrentPage((prev) => prev + 1)
                }
                disabled={
                  scheduleConfirmedCurrentPage * itemsPerPage >=
                  schedules.length
                }
                className="px-3 py-1 bg-gray-300 rounded text-black"
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
                <tr className="bg-gray-200 text-black">
                  <th className="p-2 border">Dia</th>
                  <th className="p-2 border">Hora</th>
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
                        {schedule.date && schedule.time
                          ? (() => {
                              const isoString = `${schedule.date}T${schedule.time}`; // Exemplo: "2025-05-25T14:30"
                              const datetime = new Date(isoString);
                              return isNaN(datetime.getTime())
                                ? "Hora inválida"
                                : format(datetime, "HH:mm", { locale: ptBR });
                            })()
                          : "—"}
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

            <p className="text-sm text-gray-500 mb-4">
              {pendingSchedules.length} Minhas Disponibilidades Pendentes
            </p>
            {/* Paginação */}
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() =>
                  setConfirmedCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={confirmedCurrentPage === 1}
                className="px-3 py-1 bg-gray-300 rounded text-black"
              >
                Anterior
              </button>

              <span>Página {confirmedCurrentPage}</span>

              <button
                onClick={() => setConfirmedCurrentPage((prev) => prev + 1)}
                disabled={
                  confirmedCurrentPage * itemsPerPage >= pendingSchedules.length
                }
                className="px-3 py-1 bg-gray-300 rounded text-black"
              >
                Próxima
              </button>
            </div>
          </div>
        </>
      </div>
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center text-black">
          <div className="bg-white p-6 rounded shadow-md relative w-full max-w-md text-black">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              x
            </button>
            <h2 className="text-xl font-semibold mb-4">Adicionar Escala</h2>
            <div>
              <label htmlFor="addDate" className="block mb-2">
                Data
              </label>
              <input
                type="date"
                id="addDate"
                value={addDate}
                onChange={(e) => setAddDate(e.target.value)}
                className="w-full border p-2 rounded mb-4 text-black"
              />

              <label htmlFor="addTime" className="block mb-2 text-black">
                Hora da Escala
              </label>
              <input
                type="time"
                id="addTime"
                value={addTime}
                onChange={(e) => setAddTime(e.target.value)}
                className="w-full border p-2 rounded mb-4 text-black"
              />

              <label htmlFor="addDescription" className="block mb-2">
                Descrição
              </label>
              <textarea
                id="addDescription"
                placeholder="Descrição da escala"
                value={addDescription}
                onChange={(e) => setAddDescription(e.target.value)}
                maxLength={1000}
                className="w-full border rounded p-2 mb-4 resize-none h-32 text-black"
              />
              <button
                onClick={handleConfirmAvailability}
                className="bg-green-600 text-white px-4 py-2 rounded w-full"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
