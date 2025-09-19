"use client";

import Link from "next/link";
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
} from "react-icons/fa";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: <FaTachometerAlt /> },
  { name: "Employees", href: "/employees", icon: <FaUsers /> },
  { name: "Expenses", href: "/expenses", icon: <FaMoneyBillWave /> },
  { name: "Incomes", href: "/incomes", icon: <FaWallet /> },
  { name: "Projects", href: "/projects", icon: <FaFolderOpen /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-blue-700 via-blue-900 to-indigo-800 shadow-lg px-4 py-6">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logo.jpg" // Change to your actual logo file name
            alt="Company Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="text-white font-bold text-xl tracking-wide">
            North Central Engineering
          </span>
        </div>
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200 text-white hover:bg-blue-600 ${
                pathname.startsWith(item.href)
                  ? "bg-blue-600 font-semibold"
                  : ""
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
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
        </div>
      )}
    </nav>
  );
}
