"use client";

import Link from "next/link";
import React from "react";
import { smoothScrollTo } from "@/lib/ui-effects";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FaUsers,
  FaMoneyBillWave,
  FaWallet,
  FaProjectDiagram,
  FaTachometerAlt,
  FaFolderOpen,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaUserCircle,
  FaRegUser,
} from "react-icons/fa";

import { getUserFromCookie } from "@/lib/auth-client";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: <FaTachometerAlt /> },
  { name: "Employees", href: "/employees", icon: <FaUsers /> },
  { name: "Expenses", href: "/expenses", icon: <FaMoneyBillWave /> },
  { name: "Incomes", href: "/incomes", icon: <FaWallet /> },
  { name: "Projects", href: "/projects", icon: <FaFolderOpen /> },
];

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<null | {
    id: number;
    email: string;
    role: string;
  }>(null);
  const [jwtError, setJwtError] = useState("");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Check JWT and set user on mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const u = getUserFromCookie();
        setUser(u);
        if (!u) {
          setJwtError("No valid user found in JWT. Please login again.");
        }
        console.log("Navbar user:", u);
      } catch (err) {
        setJwtError("JWT decode error: " + err);
        setUser(null);
      }
    }
  }, []);

  const handleLogout = async () => {
    document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    window.location.href = "/login";
  };

  const handleProfile = () => {
    setProfileOpen((open) => !open);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-blue-700 via-blue-900 to-indigo-800 shadow-lg px-4 py-6">
      <div className="container flex items-center justify-between">
        <Link href="/dashboard">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Company Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="text-white font-bold text-3xl tracking-wide cursor-pointer hover:opacity-70 transition duration-300 px-2 rounded">
              North Central Engineering
            </span>
          </div>
        </Link>
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-2 items-center">
          {navItems.map((item, idx) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md font-semibold transition-colors duration-200 hover:bg-blue-800 focus:bg-blue-900 ${
                pathname === item.href
                  ? "bg-blue-900 text-white"
                  : "text-blue-200"
              }`}
              onClick={(e) => {
                if (item.href.startsWith("#")) {
                  e.preventDefault();
                  smoothScrollTo(item.href.replace("#", ""), 80);
                }
              }}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
          {/* Modern Avatar/Profile Dropdown */}
          {(user || jwtError) && (
            <div className="relative ml-4">
              <button
                onClick={handleProfile}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors duration-200 shadow"
                title="Profile"
              >
                <FaRegUser className="text-blue-700 text-2xl" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50 p-4">
                  <div className="flex flex-col items-center gap-2">
                    <FaRegUser className="text-4xl text-blue-700 mb-2" />
                    <div className="font-bold text-lg">
                      {user && user.email ? user.email : "No user"}
                    </div>
                    <div className="text-xs text-blue-600 font-semibold">
                      {user && user.role ? `Role: ${user.role}` : jwtError}
                    </div>
                  </div>
                  <hr className="my-3" />
                  <button
                    onClick={() => (window.location.href = "/profile")}
                    className="w-full py-2 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 mb-2"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-900 px-4 py-2 rounded-b-lg shadow-lg">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200 text-white hover:bg-blue-600 ${
                pathname.startsWith(item.href)
                  ? "bg-blue-600 font-semibold"
                  : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
          {/* Logout Icon Mobile */}
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="mt-2 flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-red-200 hover:bg-red-700 transition-colors duration-200 w-full"
            title="Logout"
          >
            <FaSignOutAlt className="text-xl" />
            <span className="">Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
}
