import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "StudioOps — Orquestração de Agentes GenAI",
  description: "Plataforma de orquestração de agentes autônomos para YouTube com interface Pixel Agents (Human-in-the-Loop)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className="dark h-full antialiased"
    >
      <body className="h-full bg-slate-950 text-slate-100 flex overflow-hidden font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-slate-950">
          {children}
        </div>
      </body>
    </html>
  );
}
