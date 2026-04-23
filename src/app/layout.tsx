import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tronnus | Painel do Produtor",
  description: "Gerencie suas vendas e recebíveis com facilidade.",
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
