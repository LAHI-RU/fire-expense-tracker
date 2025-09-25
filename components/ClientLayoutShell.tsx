"use client";
import Navbar from "./navbar";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";

export default function ClientLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavAndFooter = pathname === "/login" || pathname === "/register";

  return (
    <>
      {!hideNavAndFooter && <Navbar />}
      <main
        className={`container p-responsive mt-6 flex-1${
          hideNavAndFooter ? "" : ""
        }`}
      >
        {children}
      </main>
      {!hideNavAndFooter && (
        <footer className="w-full py-4 bg-gradient-to-r from-blue-900 via-indigo-800 to-indigo-900 text-center text-base text-white font-semibold shadow-inner border-t border-blue-800 flex items-center justify-center gap-2">
          <span className="inline-block text-xl align-middle">&#169;</span>
          <span className="tracking-wide">
            {new Date().getFullYear()} LDB Solutions. All rights reserved.
          </span>
        </footer>
      )}
      <Analytics />
    </>
  );
}
