import { Header } from "@/components/features/layout/header";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata = {
  title: "GatorTutor",
  description: "Find your perfect tutor at UF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="relative min-h-screen">
          <div className="fixed inset-0 -z-10">
            <img
              src="/images/background-poster.jpg"
              alt="Background"
              className="object-cover w-full h-full"
            />
          </div>
          <Header />
          {children}
          <Toaster
            className="!fixed !top-[80px] !right-0"
            expand={true}
            richColors
            closeButton
            toastOptions={{
              style: {
                maxWidth: "600px",
                padding: "16px",
                borderRadius: "12px",
                fontSize: "16px",
                boxShadow:
                  "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
              },
            }}
          />
        </div>
      </body>
    </html>
  );
}
