import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";

import ClientLayoutShell from "../components/ClientLayoutShell";

export const metadata: Metadata = {
  title: "North Central Engineering",
  description: "Created with v0",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} flex flex-col min-h-screen`}
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 rounded-full border-4 border-t-blue-600 border-gray-200 animate-spin" />
                <div className="text-lg text-gray-600">Loading...</div>
              </div>
            </div>
          }
        >
          <ClientLayoutShell>{children}</ClientLayoutShell>
        </Suspense>
      </body>
    </html>
  );
}
