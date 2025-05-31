import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { getUserGroups } from "@/lib/services/groupService";
import { Group } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const groups: Group[] = await getUserGroups(user.id);

  return (
    <div className="p-6 bg-emerald-800 shadow-md rounded-lg">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-light text-2xl font-bold">
          Dashboard de Quien Paga
        </h1>
        <UserButton afterSignOutUrl="/" />
      </header>

      <main className="space-y-8">
        {/* Sección de bienvenida */}
        <div className=" bg-emerald-100 shadow rounded-lg p-6 text-black">
          <h2 className="text-dark text-xl font-semibold mb-4">
            Bienvenido, {user.username || user.firstName || "Usuario"}
          </h2>
          <p className="mb-6">
            Gestiona tus gastos compartidos de forma sencilla. Crea grupos,
            registra gastos y mantén las cuentas claras con tus amigos, familia
            o compañeros.
          </p>

          <Link
            href="/groups/new"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg transition-all hover:opacity-90 shadow-sm"
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Crear nuevo grupo
          </Link>
        </div>

        {/* Sección de grupos */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-dark text-xl font-semibold">Mis grupos</h2>
            {groups.length > 0 && (
              <Link
                href="/groups"
                className="text-sm text-green-700 hover:text-green-900 flex items-center"
              >
                Ver todos
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 ml-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </Link>
            )}
          </div>

          {groups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group) => (
                <Link
                  key={group.id}
                  href={`/groups/${group.id}`}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow hover:bg-gray-50"
                >
                  <h3 className="font-medium text-lg truncate text-gray-800">
                    {group.name}
                  </h3>
                  {group.description && (
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {group.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Creado:{" "}
                      {new Date(group.created_at).toLocaleDateString("es-ES")}
                    </span>
                    <div className="flex items-center text-xs text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4 mr-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                      Tú
                    </div>
                  </div>
                </Link>
              ))}

              <Link
                href="/groups/new"
                className="border border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center text-center min-h-[120px]"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-green-700"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </div>
                <span className="text-green-700 font-medium">
                  Crear nuevo grupo
                </span>
              </Link>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full text-emerald-600 mb-4">
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
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">
                No tienes grupos todavía
              </h3>
              <p className="text-gray-500 mb-6">
                Los grupos te permiten organizar gastos compartidos con amigos,
                familia o compañeros.
              </p>
              <Link
                href="/groups/new"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg hover:opacity-90"
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
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Crear mi primer grupo
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
