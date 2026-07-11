import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScrolling } from "@/components/SmoothScrolling";
import { LiquidNav } from "@/components/navigation/LiquidNav";
import { NavProvider } from "@/components/navigation/NavContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Premium Agency Portfolio",
  description: "Liquid glass navigation showcase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <SmoothScrolling>
          <NavProvider>
            <LiquidNav />
            {children}
          </NavProvider>
        </SmoothScrolling>
      </body>
    </html>
  );
}
