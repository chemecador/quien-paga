import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-emerald-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl text-white font-extrabold">
            ¿Quién paga hoy?
          </h1>
          <nav className="space-x-4">
            <Link href="/sign-in" className="hover:underline">
              Iniciar sesión
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 bg-white text-blue-600 rounded-lg shadow hover:shadow-lg"
            >
              Registrarse
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow mt-8">
        <div className="max-w-6xl mx-auto text-center px-6">
          <h2 className="text-5xl font-bold mb-4">
            La forma más fácil de gestionar gastos
          </h2>
          <p className="text-xl mb-8">
            ¿A quién le toca pagar hoy? Nuestro algoritmo calcula quién ha
            pagado menos gastos y cuánto debe a cada uno.
          </p>
          <Link
            href="/sign-up"
            className="inline-block px-8 py-4 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700"
          >
            Empezar ahora
          </Link>
        </div>

        <section className="py-16">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 px-6">
            {[
              {
                title: "Crear grupos",
                desc: "Organiza los gastos de todo el viaje.",
                icon: (
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7h18M3 12h18M3 17h18"
                    />
                  </svg>
                ),
              },
              {
                title: "Registrar pagos",
                desc: "Añade quién pagó y cuánto gastó.",
                icon: (
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2"
                    />
                  </svg>
                ),
              },
              {
                title: "Resumen gráfico",
                desc: "Visualiza cuánto ha pagado cada uno.",
                icon: (
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-6h6v6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h5l2 2h5a2 2 0 012 2v12a2 2 0 01-2 2z"
                    />
                  </svg>
                ),
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <div className="text-blue-600 mb-4">{f.icon}</div>
                <h3 className="text-secondary text-xl font-semibold mb-2">
                  {f.title}
                </h3>
                <p className="text-label">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="py-6">
        <p className="text-center text-gray-500 text-sm">
          &copy; 2025 QuienPaga. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
