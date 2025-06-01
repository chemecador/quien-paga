"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createGroup } from "@/lib/services/groupService";
import { Group, Member } from "@/lib/types";
import { useUser } from "@clerk/nextjs";

interface MemberInput {
  name: string;
}

export default function NewGroupPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    groupName: "",
    description: "",
    equalSplit: true,
  });
  const [members, setMembers] = useState<MemberInput[]>([{ name: "" }]);
  const [error, setError] = useState<string | null>(null);

  if (isLoaded && !user) {
    router.push("/sign-in");
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...members];
    newMembers[index].name = value;
    setMembers(newMembers);
  };

  const addMember = () => {
    setMembers([...members, { name: "" }]);
  };

  const removeMember = (index: number) => {
    const newMembers = [...members];
    newMembers.splice(index, 1);
    setMembers(newMembers);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isLoaded || !user) {
      setError("Debes iniciar sesión para crear un grupo");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.groupName.trim()) {
        throw new Error("El nombre del grupo es obligatorio");
      }

      const validMembers = members
        .filter((m) => m.name.trim() !== "")
        .map((m) => ({
          display_name: m.name.trim(),
          user_id: "",
          email: "",
          role: "member" as const,
        }));

      const groupData: Omit<Group, "id" | "created_at" | "updated_at"> = {
        name: formData.groupName.trim(),
        description: formData.description.trim() || undefined,
        created_by: user.id,
      };

      const creatorMember: Omit<Member, "id" | "group_id"> = {
        user_id: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        display_name: user.fullName || user.username || "Usuario",
        role: "admin",
      };

      const result = await createGroup(groupData, creatorMember);

      if (!result) {
        throw new Error("Error al crear el grupo. Inténtalo de nuevo.");
      }

      if (validMembers.length > 0) {
        console.log("Miembros a añadir:", validMembers);
      }

      router.push("/dashboard");
    } catch (err: Error | unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Ha ocurrido un error. Inténtalo de nuevo.";
      setError(errorMessage);
      console.error("Error creating group:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="m-4 flex items-center">
        <Link
          href="/dashboard"
          className="flex items-center text-green-700 hover:text-green-900 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Volver al dashboard
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 py-6 px-8">
          <h1 className="text-2xl font-bold text-white">Crear nuevo grupo</h1>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Group info */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Información básica
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label
                      htmlFor="groupName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nombre del grupo *
                    </label>
                    <input
                      type="text"
                      id="groupName"
                      name="groupName"
                      value={formData.groupName}
                      onChange={handleChange}
                      placeholder="Ej: Viaje a Tenerife"
                      className="text-gray-800 placeholder-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Descripción (opcional)
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Añade detalles sobre este grupo"
                      className="text-gray-800 placeholder-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Members */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Miembros del grupo
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Añade a las personas que compartirán gastos en este grupo.
                  Podrás enviarles invitaciones después para que se registren.
                </p>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
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
                      <p className="font-medium text-gray-800">
                        {user?.fullName || user?.username || "Tú"}
                      </p>
                      <p className="text-xs text-gray-600">Administrador</p>
                    </div>
                    <div className="ml-auto">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Tú
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3" id="membersList">
                  {members.map((member, index) => (
                    <div
                      key={index}
                      className="relative flex items-center border border-gray-200 rounded-lg p-3 pr-12 bg-white"
                    >
                      <input
                        type="text"
                        placeholder="Nombre del miembro (ej: Pedro)"
                        value={member.name}
                        onChange={(e) =>
                          handleMemberChange(index, e.target.value)
                        }
                        className="text-gray-800 placeholder-gray-600 flex-grow px-3 py-1 text-sm border-none focus:ring-0 focus:outline-none"
                      />
                      {members.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMember(index)}
                          className="absolute right-2 text-gray-400 hover:text-red-500"
                          aria-label="Eliminar miembro"
                        >
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addMember}
                  className="mt-3 flex items-center text-sm text-green-700 hover:text-green-900"
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
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  Añadir otro miembro
                </button>
              </div>
            </div>

            <div className="mt-10 flex justify-end space-x-3">
              <Link
                href="/dashboard"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg hover:opacity-90 shadow-sm ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Creando..." : "Crear grupo"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
