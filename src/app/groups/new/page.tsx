// app/groups/new/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function NewGroupPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center">
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

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 py-6 px-8">
          <h1 className="text-2xl font-bold text-white">Crear nuevo grupo</h1>
        </div>

        <div className="p-8">
          <form>
            <div className="space-y-6">
              {/* Información básica del grupo */}
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
                      placeholder="Ej: Viaje a Barcelona"
                      className="text-gray-400 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                      rows={3}
                      placeholder="Añade detalles sobre este grupo"
                      className="text-gray-400 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Miembros */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Miembros del grupo
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Añade a las personas que compartirán gastos en este grupo.
                  Podrás invitar a más personas después.
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
                      <p className="text-gray-700 font-medium">
                        {user.username || user.firstName || "Tú"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.emailAddresses[0]?.emailAddress || ""}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Tú
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3" id="membersList">
                  {/* Miembro 1 */}
                  <div className="relative flex items-center border border-gray-200 rounded-lg p-3 pr-12 bg-white">
                    <input
                      type="email"
                      placeholder="Correo electrónico"
                      className="text-gray-700flex-grow px-3 py-1 text-sm border-none focus:ring-0 focus:outline-none"
                    />
                    <button
                      type="button"
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
                  </div>
                </div>

                <button
                  type="button"
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

              {/* Preferencias */}
              <div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="equalSplit"
                        name="equalSplit"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="equalSplit"
                        className="font-medium text-gray-700"
                      >
                        Dividir gastos equitativamente por defecto
                      </label>
                      <p className="text-gray-500">
                        Todos los gastos se dividirán a partes iguales entre los
                        miembros, a menos que se especifique lo contrario.
                      </p>
                    </div>
                  </div>
                </div>
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
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg hover:opacity-90 shadow-sm"
              >
                Crear grupo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
