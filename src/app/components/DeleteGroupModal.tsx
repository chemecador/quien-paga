"use client";

import { useState, useTransition } from "react";
import { deleteGroupAction } from "@/app/actions/deleteGroup";
import { useRouter } from "next/navigation";

interface DeleteGroupModalProps {
  groupId: string;
  groupName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteGroupModal({
  groupId,
  groupName,
  isOpen,
  onClose,
}: DeleteGroupModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = () => {
    if (confirmText !== groupName) {
      setError("El nombre del grupo no coincide");
      return;
    }

    startTransition(async () => {
      try {
        await deleteGroupAction(groupId);
        router.push("/dashboard");
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Error eliminando el grupo"
        );
      }
    });
  };

  const handleClose = () => {
    if (!isPending) {
      setConfirmText("");
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <div className="bg-red-100 rounded-full p-2 mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-red-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Eliminar grupo</h3>
        </div>

        <p className="text-gray-600 mb-4">
          Esta acción no se puede deshacer. Se eliminarán permanentemente:
        </p>

        <ul className="text-sm text-gray-600 mb-4 space-y-1">
          <li>• Todos los gastos del grupo</li>
          <li>• Todos los miembros del grupo</li>
          <li>• Todo el historial de balances</li>
        </ul>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Para confirmar, escribe el nombre del grupo:{" "}
            <span className="font-bold">{groupName}</span>
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-dark"
            placeholder={groupName}
            disabled={isPending}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClose}
            disabled={isPending}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending || confirmText !== groupName}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Eliminando..." : "Eliminar grupo"}
          </button>
        </div>
      </div>
    </div>
  );
}
