export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-70">
      <div className="max-w-7xl mx-auto p-4">{children}</div>
    </div>
  );
}
