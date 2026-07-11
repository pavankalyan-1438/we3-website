import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ScrollController } from "@/components/navigation/ScrollController";
import { Navbar } from "@/components/navigation/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "WE3 | Premium Digital Experiences",
  description: "WE3 engineers premium digital products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased">
        <ScrollController>
          <Navbar />
          {children}
        </ScrollController>
      </body>
    </html>
  );
}
