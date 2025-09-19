import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import Navbar from "../components/navbar";

export const metadata: Metadata = {
  title: "North Central Engineering",
  description: "Created with v0",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} flex flex-col min-h-screen`}
      >
        <Navbar />
        <main className="container p-responsive mt-6 flex-1">{children}</main>
        <footer className="w-full py-4 bg-gradient-to-r from-blue-900 via-indigo-800 to-indigo-900 text-center text-base text-white font-semibold shadow-inner border-t border-blue-800 flex items-center justify-center gap-2">
          <span className="inline-block text-xl align-middle">&#169;</span>
          <span className="tracking-wide">
            {new Date().getFullYear()} LDB Solutions. All rights reserved.
          </span>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
