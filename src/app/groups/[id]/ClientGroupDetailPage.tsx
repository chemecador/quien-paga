"use client";

import AddExpenseModal from "./AddExpenseModal";
import DeleteGroupButton from "./DeleteGroupButton";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getGroupExpenses, Expense } from "@/lib/services/expenseService";
import { addMemberToGroupAction } from "@/app/actions/addMemberAction";

interface Group {
  id: string;
  name: string;
  description?: string;
}

interface Member {
  user_id: string;
  display_name?: string;
  email?: string;
  role?: string;
  id: string;
}

interface ClientGroupDetailPageProps {
  group: Group;
  members: Member[];
  groupId: string;
  currentUserId: string;
}

export default function ClientGroupDetailPage({
  group,
  members,
  groupId,
  currentUserId,
}: ClientGroupDetailPageProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const router = useRouter();

  const isAdmin =
    members.find((m) => m.user_id === currentUserId)?.role === "admin";

  const loadExpenses = async () => {
    setLoadingExpenses(true);
    try {
      const groupExpenses = await getGroupExpenses(groupId);
      setExpenses(groupExpenses);
    } catch (error) {
      console.error("Error loading expenses:", error);
    } finally {
      setLoadingExpenses(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [groupId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleExpenseAdded = () => {
    loadExpenses();
    router.refresh();
  };
  const totalBalance = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const currentUserMember = members.find((m) => m.user_id === currentUserId);
  const userBalance = expenses.reduce((balance, expense) => {
    if (expense.paid_by === currentUserMember?.id) {
      balance += expense.amount;
    }
    const userShare = expense.shares.find(
      (share) => share.userId === currentUserMember?.id
    );
    if (userShare) {
      balance -= userShare.amount;
    }
    return balance;
  }, 0);

  const handleAddMember = async () => {
    if (!newMemberName.trim()) return;

    try {
      await addMemberToGroupAction({
        groupId,
        displayName: newMemberName.trim(),
        email: "",
      });

      setNewMemberName("");
      setAddMemberModalOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error al añadir miembro:", error);
      alert("Error al añadir miembro. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Cabecera del grupo */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 py-6 px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-dark">{group.name}</h1>
            <DeleteGroupButton
              groupId={groupId}
              groupName={group.name}
              isAdmin={isAdmin}
            />
          </div>
          {group.description && (
            <p className="mt-2 text-emerald-50">{group.description}</p>
          )}
        </div>

        {/* Resumen del grupo */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm text-gray-500 mb-1">Balance total</h3>
              <p className="text-2xl font-bold text-gray-900">
                {totalBalance.toFixed(2)} €
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Importe de todos los gastos
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-sm text-gray-500 mb-1">Tu balance</h3>
              <p
                className={`text-2xl font-bold ${
                  userBalance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {userBalance >= 0 ? "+" : ""}
                {userBalance.toFixed(2)} €
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {userBalance >= 0 ? "Te deben dinero" : "Debes dinero"}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm text-gray-500 mb-1">Miembros</h3>
              <p className="text-2xl font-bold text-gray-900">
                {members.length}
              </p>
              <p className="text-sm text-gray-500 mt-1">Personas en el grupo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal - Tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <a
              href="#"
              className="border-b-2 border-green-500 py-4 px-6 text-sm font-medium text-green-600"
            >
              Gastos
            </a>
            <a
              href="#"
              className="border-b-2 border-transparent hover:border-gray-300 py-4 px-6 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Balances
            </a>
          </nav>
        </div>

        {/* Lista de gastos */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Gastos</h2>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
              onClick={() => setModalOpen(true)}
            >
              Añadir gasto
            </button>
          </div>

          {/* Lista de gastos o estado vacío */}
          {loadingExpenses ? (
            <div className="text-center py-12">
              <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-green-600 rounded-full" />
              <p className="mt-2 text-gray-500">Cargando gastos...</p>
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg bg-gray-50">
              <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full text-green-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2 text-gray-900">
                No hay gastos todavía
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Comienza a registrar los gastos compartidos para llevar un
                control de quién ha pagado y cuánto debe cada uno.
              </p>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
                onClick={() => setModalOpen(true)}
              >
                Añadir primer gasto
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => {
                const paidByMember = members.find(
                  (m) => m.id === expense.paid_by
                );
                const currentUserMember = members.find(
                  (m) => m.user_id === currentUserId
                );
                return (
                  <div
                    key={expense.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {expense.description}
                        </h4>
                        <div className="mt-1 text-sm text-gray-500">
                          <span>Pagado por </span>
                          <span className="font-medium">
                            {paidByMember?.display_name ||
                              "Usuario desconocido"}
                            {expense.paid_by === currentUserMember?.id &&
                              " (Tú)"}
                          </span>
                          <span> • </span>
                          <span>
                            {new Date(expense.created_at).toLocaleDateString(
                              "es-ES",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          {expense.amount.toFixed(2)} €
                        </div>
                        <div className="text-sm text-gray-500">
                          {expense.shares.length}{" "}
                          {expense.shares.length === 1 ? "persona" : "personas"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Lista de miembros */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Miembros</h2>
            {isAdmin && (
              <button
                className="text-green-600 hover:text-green-700 flex items-center text-sm font-medium"
                onClick={() => setAddMemberModalOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                  />
                </svg>
                Añadir miembro
              </button>
            )}
          </div>

          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-full p-2 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-green-700"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">
                      {member.display_name || "Usuario sin nombre"}
                      {member.user_id === currentUserId && " (Tú)"}
                    </p>
                    {member.email && (
                      <p className="text-xs text-gray-500">{member.email}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  {member.role === "admin" && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                      Admin
                    </span>
                  )}
                  {isAdmin && member.user_id !== currentUserId && (
                    <button className="text-gray-400 hover:text-gray-700 p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AddExpenseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        members={members.map((m) => ({
          id: m.id,
          display_name: m.display_name || "Usuario sin nombre",
        }))}
        groupId={groupId}
        onExpenseAdded={handleExpenseAdded}
      />

      {/* Modal para añadir miembro */}
      {addMemberModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4 text-gray-900">
              Añadir nuevo miembro
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  placeholder="Nombre del miembro"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => {
                  setNewMemberName("");
                  setAddMemberModalOpen(false);
                }}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                onClick={handleAddMember}
              >
                Añadir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
