"use client";

import React, { useState } from "react";
import { createExpenseAction } from "@/app/actions/createExpenseAction";

interface Member {
  id: string;
  display_name: string;
}

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  members: Member[];
  groupId: string;
  onExpenseAdded: () => void;
}

export default function AddExpenseModal({
  open,
  onClose,
  members,
  groupId,
  onExpenseAdded,
}: AddExpenseModalProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(members[0]?.id || "");
  const [splitType, setSplitType] = useState<"equal" | "custom">("equal");
  const [customShares, setCustomShares] = useState<
    { userId: string; amount: number }[]
  >(members.map((m) => ({ userId: m.id, amount: 0 })));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSplitTypeChange = (type: "equal" | "custom") => {
    setSplitType(type);
    if (type === "equal") {
      const amountNum = parseFloat(amount) || 0;
      const equalAmount = amountNum / members.length;
      setCustomShares(
        members.map((m) => ({
          userId: m.id,
          amount: Number(equalAmount.toFixed(2)),
        }))
      );
    }
  };

  const handleAmountChange = (value: number) => {
    setAmount(value.toString());
    if (splitType === "equal") {
      const equalAmount = value / members.length;
      setCustomShares(
        members.map((m) => ({
          userId: m.id,
          amount: Number(equalAmount.toFixed(2)),
        }))
      );
    }
  };

  const handleCustomShareChange = (userId: string, value: number) => {
    const newShares = customShares.map((share) =>
      share.userId === userId ? { ...share, amount: value } : share
    );
    setCustomShares(newShares);

    if (splitType === "custom") {
      const totalAmount = newShares.reduce(
        (sum, share) => sum + share.amount,
        0
      );
      setAmount(totalAmount.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log("Submitting expense with data:", {
      groupId,
      description,
      amount,
      paidBy,
      shares: customShares,
    });

    try {
      await createExpenseAction({
        groupId,
        description,
        amount: parseFloat(amount) || 0,
        paidBy,
        shares: customShares,
      });
      setLoading(false);
      onExpenseAdded();
      onClose();
      setDescription("");
      setAmount("");
      setPaidBy(members[0]?.id || "");
      setSplitType("equal");
      setCustomShares(members.map((m) => ({ userId: m.id, amount: 0 })));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Error al crear gasto");
      } else {
        setError("Error al crear gasto");
      }
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4 text-dark">Añadir gasto</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Descripción
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-dark"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Importe total (€)
            </label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2 text-dark"
              value={amount}
              min={0}
              step={1}
              onChange={(e) => handleAmountChange(Number(e.target.value))}
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Pagado por</label>
            <select
              className="w-full border rounded px-3 py-2 text-dark"
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.display_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">División</label>
            <div className="flex gap-4 mb-2">
              <button
                type="button"
                className={`px-3 py-1 rounded text-dark ${
                  splitType === "equal" ? "bg-green-600" : "bg-gray-200"
                }`}
                onClick={() => handleSplitTypeChange("equal")}
              >
                Todos pagan lo mismo
              </button>
              <button
                type="button"
                className={`px-3 py-1 rounded  text-dark ${
                  splitType === "custom" ? "bg-green-600" : "bg-gray-200"
                }`}
                onClick={() => handleSplitTypeChange("custom")}
              >
                Personalizada
              </button>
            </div>
            {splitType === "custom" && (
              <div className="space-y-2">
                {members.map((m, idx) => (
                  <div key={m.id} className="flex items-center gap-2">
                    <span className="w-24 text-dark">{m.display_name}</span>
                    <input
                      type="number"
                      className="border rounded px-2 py-1 w-28 text-dark"
                      value={customShares[idx]?.amount || 0}
                      min={0}
                      step={1}
                      onChange={(e) =>
                        handleCustomShareChange(m.id, Number(e.target.value))
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 text-dark"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 text-dark"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Añadir gasto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
