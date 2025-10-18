"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  BarChart2,
  Users,
  CreditCard,
  Wallet,
  Folder,
  FileText,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";

import { getUserFromCookie } from "@/lib/auth-client";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart2 },
  { name: "Employees", href: "/employees", icon: Users },
  { name: "Expenses", href: "/expenses", icon: CreditCard },
  { name: "Incomes", href: "/incomes", icon: Wallet },
  { name: "Projects", href: "/projects", icon: Folder },
  { name: "Reports", href: "/reports", icon: FileText },
];

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<null | {
    id: number;
    email: string;
    role: string;
    name?: string;
  }>(null);
  const [jwtError, setJwtError] = useState("");
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const profileRefDesktop = useRef<HTMLDivElement | null>(null);
  const profileRefMobile = useRef<HTMLDivElement | null>(null);
  const profileRefDrawer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      const desktopContains = profileRefDesktop.current?.contains(target);
      const mobileContains = profileRefMobile.current?.contains(target);
      const drawerContains = profileRefDrawer.current?.contains(target);
      if (!desktopContains && !mobileContains && !drawerContains)
        setProfileOpen(false);
    }

    if (profileOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [profileOpen]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const u = getUserFromCookie();
        setUser(u);
        if (!u) setJwtError("No valid user found in JWT. Please login again.");
      } catch (err) {
        setJwtError("JWT decode error: " + err);
        setUser(null);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/verify", {
        method: "DELETE",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    // Clear token cookie
    document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    window.location.href = "/login";
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:w-56 md:flex md:flex-col bg-gradient-to-b from-blue-800 via-blue-900 to-indigo-900 text-white shadow-lg z-40">
        <div className="flex flex-col items-center px-4 py-6 mt-4">
          <img
            src="/logo.jpg"
            alt="logo"
            className="h-24 w-24 rounded-full object-cover"
          />
          <div className="mt-2 text-base font-semibold text-center">
            North Central
            <div className="text-sm font-medium">Engineering</div>
          </div>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon as any;
            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                className={`group flex items-center gap-4 px-4 py-3 rounded-md transition-colors duration-150 hover:bg-blue-700 ${
                  pathname === item.href
                    ? "bg-blue-700 text-white"
                    : "text-blue-100"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="font-semibold text-base">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div
          className="px-4 py-4 border-t border-blue-700 relative"
          ref={profileRefDesktop}
        >
          <button
            onClick={() => setProfileOpen((s) => !s)}
            aria-haspopup="true"
            aria-expanded={profileOpen}
            className="w-full text-left flex items-center gap-3 focus:outline-none"
            title="Open profile menu"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <User className="text-white" size={20} />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="font-semibold truncate">
                {user?.name || user?.email || "No user"}
              </div>
              <div className="text-xs text-blue-200 truncate">
                {user?.role || jwtError}
              </div>
            </div>
          </button>

          {profileOpen && (
            <div className="hidden md:block absolute left-4 bottom-16 w-48 bg-white text-gray-800 rounded shadow-lg z-50">
              <div className="p-3 border-b text-sm">
                <div className="font-semibold truncate">
                  {user?.name || user?.email || "No user"}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {user?.role || ""}
                </div>
              </div>
              <div className="flex flex-col p-2">
                <button
                  onClick={() => (window.location.href = "/profile")}
                  className="text-left px-2 py-2 rounded hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="text-left px-2 py-2 rounded text-red-600 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <LogOut size={14} /> Logout
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Topbar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-700 via-blue-900 to-indigo-800 text-white shadow px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button onClick={() => setDrawerOpen(true)} className="text-white">
              <Menu className="text-white" size={20} />
            </button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <img
                src="/logo.jpg"
                className="h-8 w-8 rounded-full"
                alt="logo"
              />
              <span className="font-semibold">NCE</span>
            </Link>
          </div>

          <div className="flex items-center gap-3" ref={profileRefMobile}>
            <button
              onClick={() => setProfileOpen((s) => !s)}
              className="flex items-center gap-2 focus:outline-none"
              title="Open profile menu"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <User className="text-white" size={16} />
              </div>
              <div className="text-sm font-medium">
                {user?.name || user?.email || "No user"}
              </div>
            </button>
          </div>
        </div>

        {profileOpen && (
          <div className="absolute right-4 top-16 z-50 w-40 bg-white text-gray-800 rounded shadow-lg">
            <div className="p-2 border-b">
              <div className="font-semibold truncate">
                {user?.name || user?.email || "No user"}
              </div>
              <div className="text-xs text-gray-500">
                {user?.role || jwtError}
              </div>
            </div>
            <div className="flex flex-col p-2">
              <button
                onClick={() => (window.location.href = "/profile")}
                className="text-left px-2 py-2 rounded hover:bg-gray-100"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="text-left px-2 py-2 rounded text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-blue-800 via-blue-900 to-indigo-900 text-white p-4 overflow-auto">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/logo.jpg"
                className="h-10 w-10 rounded-full"
                alt="logo"
              />
              <div className="font-bold">North Central Engineering</div>
              <button className="ml-auto" onClick={() => setDrawerOpen(false)}>
                <X className="text-white" size={18} />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon as any;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    prefetch={true}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-700 ${
                      pathname === item.href ? "bg-blue-700" : ""
                    }`}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div
              className="mt-6 border-t border-white/10 pt-4"
              ref={profileRefDrawer}
            >
              <button
                onClick={() => setProfileOpen((s) => !s)}
                className="w-full text-left flex items-center gap-3 pb-3"
                title="Open profile menu"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <User className="text-white" size={18} />
                </div>
                <div>
                  <div className="font-semibold">
                    {user?.name || user?.email || "No user"}
                  </div>
                  <div className="text-xs text-blue-200">
                    {user?.role || jwtError}
                  </div>
                </div>
              </button>

              {profileOpen && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setDrawerOpen(false);
                      window.location.href = "/profile";
                    }}
                    className="w-full py-2 rounded bg-white/10 text-white mb-2"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setDrawerOpen(false);
                      handleLogout();
                    }}
                    className="w-full py-2 rounded bg-red-600 text-white"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <LogOut size={14} /> Logout
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
