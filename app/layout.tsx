import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import "./styles/weather.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weather or Not",
  description: "Gives you the weather anywhere in the World!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
