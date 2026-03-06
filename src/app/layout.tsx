import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {Providers} from "@/app/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Our Restaurant",
  description: "Delicious Moments, Made Just for You",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
