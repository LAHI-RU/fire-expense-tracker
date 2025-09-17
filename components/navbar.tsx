"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaUsers,
  FaMoneyBillWave,
  FaWallet,
  FaProjectDiagram,
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
  return (
    <nav className="bg-gradient-to-r from-blue-700 via-blue-900 to-indigo-800 shadow-lg px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <span className="text-white font-bold text-xl tracking-wide">
          FIRE Expense Tracker
        </span>
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
    </nav>
  );
}
