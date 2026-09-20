import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TYPEVERSE — Type. Train. Compete. Evolve.",
  description: "Premium hybrid typing improvement platform combining professional speed testing with immersive game experiences, adaptive learning, and touch-typing academy.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}>
      <body className="min-h-full bg-[#080B14] text-[#F8FAFC] selection:bg-[#8B5CF6]/30 selection:text-white flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
