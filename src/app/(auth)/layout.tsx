export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="container relative flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
