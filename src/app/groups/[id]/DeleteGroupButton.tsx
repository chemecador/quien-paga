"use client";

import { useState } from "react";
import DeleteGroupModal from "@/app/components/DeleteGroupModal";

interface DeleteGroupButtonProps {
  groupId: string;
  groupName: string;
  isAdmin: boolean;
}

export default function DeleteGroupButton({
  groupId,
  groupName,
  isAdmin,
}: DeleteGroupButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isAdmin) return null;

  return (
    <>
      <button
        className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium shadow"
        onClick={() => setIsOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        Eliminar grupo
      </button>
      <DeleteGroupModal
        groupId={groupId}
        groupName={groupName}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
