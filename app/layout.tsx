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
      <head> 
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&loading=async`}
          async
          defer
        ></script></head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
