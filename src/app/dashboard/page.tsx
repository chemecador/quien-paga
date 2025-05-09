import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="p-6 bg-emerald-200 shadow-md rounded-lg">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-green-950">
          Dashboard de Quien Paga
        </h1>
        <UserButton afterSignOutUrl="/" />
      </header>

      <main>
        <div className="shadow rounded-lg p-6 text-black">
          <h2 className="text-xl font-semibold mb-4">
            Bienvenido, {user.username || "Usuario"}
          </h2>
          <p>
            Esta es tu dashboard donde podrás gestionar tus grupos y gastos.
          </p>
        </div>
      </main>
    </div>
  );
}
