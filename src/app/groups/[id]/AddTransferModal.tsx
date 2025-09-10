"use client";

import React, { useState } from "react";
import { createTransferAction } from "@/app/actions/createTransferAction";

interface Member {
  id: string;
  display_name: string;
  user_id: string;
}

interface AddTransferModalProps {
  open: boolean;
  onClose: () => void;
  members: Member[];
  groupId: string;
  onTransferAdded: () => void;
  currentUserId: string;
}

export default function AddTransferModal({
  open,
  onClose,
  members,
  groupId,
  onTransferAdded,
  currentUserId,
}: AddTransferModalProps) {
  const [fromUserId, setFromUserId] = useState("");
  const [toUserId, setToUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("Transferencia");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!fromUserId || !toUserId) {
      setError("Debes seleccionar ambos usuarios");
      setLoading(false);
      return;
    }

    if (fromUserId === toUserId) {
      setError("No puedes hacer una transferencia a ti mismo");
      setLoading(false);
      return;
    }

    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      setError("El importe debe ser mayor que 0");
      setLoading(false);
      return;
    }

    try {
      await createTransferAction({
        groupId,
        fromUserId,
        toUserId,
        amount: amountNum,
        description,
      });

      setLoading(false);
      onTransferAdded();
      onClose();

      setFromUserId("");
      setToUserId("");
      setAmount("");
      setDescription("Transferencia");
    } catch (error) {
      console.error("Error creating transfer:", error);
      setError("Error al crear la transferencia");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4 text-gray-900">
          Nueva Transferencia
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Descripción
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Transferencia"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              De (quien paga)
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
              value={fromUserId}
              onChange={(e) => setFromUserId(e.target.value)}
              required
            >
              <option value="">Seleccionar usuario</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.display_name}
                  {member.user_id === currentUserId && " (Tú)"}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Para (quien recibe)
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
              value={toUserId}
              onChange={(e) => setToUserId(e.target.value)}
              required
            >
              <option value="">Seleccionar usuario</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.display_name}
                  {member.user_id === currentUserId && " (Tú)"}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Importe (€)
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
              value={amount}
              min={0}
              step={1}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear Transferencia"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
