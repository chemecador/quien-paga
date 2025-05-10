import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  interface Group {
    id: string;
    name: string;
  }

  const mockGroups: Group[] = [];

  return (
    <div className="p-6 bg-emerald-50 shadow-md rounded-lg">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-green-950">
          Dashboard de Quien Paga
        </h1>
        <UserButton afterSignOutUrl="/" />
      </header>

      <main className="space-y-8">
        {/* Sección de bienvenida */}
        <div className="bg-white shadow rounded-lg p-6 text-black">
          <h2 className="text-xl font-semibold mb-4">
            Bienvenido, {user.username || user.firstName || "Usuario"}
          </h2>
          <p className="text-gray-600 mb-6">
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
            <h2 className="text-xl font-semibold">Mis grupos</h2>
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
          </div>

          {mockGroups && mockGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockGroups.map((group) => (
                <div
                  key={group.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium truncate">{group.name}</h3>
                  {/* Aquí irían los detalles del grupo */}
                </div>
              ))}
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

        {/* Sección de actividad reciente */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Actividad reciente</h2>

          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full text-blue-600 mb-4">
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
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">
              No hay actividad reciente
            </h3>
            <p className="text-gray-500">
              La actividad de tus grupos aparecerá aquí cuando comiences a
              registrar gastos.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
