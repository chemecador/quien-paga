import { currentUser } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getGroupById, getGroupMembers } from "@/lib/services/groupService";
import Link from "next/link";
import DeleteGroupButton from "./DeleteGroupButton";

export const dynamic = "force-dynamic";

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const resolvedParams = await params;
  const groupId = resolvedParams.id;

  const group = await getGroupById(groupId);
  const members = await getGroupMembers(groupId);

  if (!group) {
    return notFound();
  }

  const currentUserMember = members.find(
    (member) => member.user_id === user.id
  );
  const isAdmin = currentUserMember?.role === "admin";

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Cabecera del grupo */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 py-6 px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">{group.name}</h1>
            <div className="flex items-center space-x-2">
              <Link
                href={`/groups/${groupId}/settings`}
                className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                title="Configuración"
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
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </Link>
              <button
                className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                title="Más opciones"
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
                    d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                  />
                </svg>
              </button>
              <DeleteGroupButton
                groupId={groupId}
                groupName={group.name}
                isAdmin={isAdmin}
              />
            </div>
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
              <p className="text-2xl font-bold text-gray-900">0.00 €</p>
              <p className="text-sm text-gray-500 mt-1">
                Importe de todos los gastos
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-sm text-gray-500 mb-1">Tu balance</h3>
              <p className="text-2xl font-bold text-green-600">0.00 €</p>
              <p className="text-sm text-gray-500 mt-1">Estás al día</p>
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
            <a
              href="#"
              className="border-b-2 border-transparent hover:border-gray-300 py-4 px-6 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Miembros
            </a>
          </nav>
        </div>

        {/* Lista de gastos */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Gastos</h2>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow">
              Añadir gasto
            </button>
          </div>

          {/* Estado vacío para gastos */}
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
            <h3 className="text-lg font-medium mb-2">No hay gastos todavía</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Comienza a registrar los gastos compartidos para llevar un control
              de quién ha pagado y cuánto debe cada uno.
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow">
              Añadir primer gasto
            </button>
          </div>
        </div>
      </div>

      {/* Lista de miembros */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Miembros</h2>
            {isAdmin && (
              <button className="text-green-600 hover:text-green-700 flex items-center text-sm font-medium">
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
                Invitar
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
                      {member.user_id === user.id && " (Tú)"}
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
                  {isAdmin && member.user_id !== user.id && (
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
    </div>
  );
}
