import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fireflies — Meeting Notes & Transcriptions",
  description: "AI-powered meeting notes and transcription platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0f0f17] text-white`}>
        <Providers>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-[#f5f5f7] text-gray-900">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
