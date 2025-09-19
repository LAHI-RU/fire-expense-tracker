"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FaUsers,
  FaMoneyBillWave,
  FaWallet,
  FaProjectDiagram,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: <FaProjectDiagram /> },
  { name: "Employees", href: "/employees", icon: <FaUsers /> },
  { name: "Expenses", href: "/expenses", icon: <FaMoneyBillWave /> },
  { name: "Incomes", href: "/incomes", icon: <FaWallet /> },
  { name: "Projects", href: "/projects", icon: <FaProjectDiagram /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-700 via-blue-900 to-indigo-800 shadow-lg px-4 py-3">
      <div className="container flex items-center justify-between">
        <span className="text-white font-bold text-xl tracking-wide">
          FIRE Expense Tracker
        </span>
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200 text-white hover:bg-blue-600 ${
                pathname.startsWith(item.href) ? "bg-blue-600 font-semibold" : ""
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
                pathname.startsWith(item.href) ? "bg-blue-600 font-semibold" : ""
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
