"use client";

import { motion } from "framer-motion";
import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SidebarNav() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: "◈" },
    { label: "My History", href: "/dashboard/history", icon: "◇" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[240px] sticky top-[72px] h-[calc(100vh-72px)] bg-[#0A0A0A] border-r border-white/5 pt-6 pb-6 z-40">
        
        {/* User Profile */}
        <div className="px-4 mb-6">
          <div className="bg-[#141414] border border-white/5 rounded-sm p-4 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-[#7C3AED]/30">
                <img src={user?.imageUrl || "https://api.dicebear.com/7.x/notionists/svg?seed=dev"} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-ui text-sm text-[#F4F4F5] truncate">
                  {user?.firstName || "Developer"}
                </span>
                <span className="font-mono text-xs text-[#A1A1AA] truncate">
                  {user?.primaryEmailAddress?.emailAddress || "dev@thoughts.com"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-wider">Active Member</span>
            </div>
          </div>
        </div>

        {/* Links */}
        <nav className="flex-1 px-2 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-sm font-mono text-sm transition-all duration-150 ${
                  isActive
                    ? "bg-[rgba(124,58,237,0.08)] border-l-2 border-[#7C3AED] text-[#9D65FF]"
                    : "text-[#52525B] hover:text-[#F4F4F5] hover:bg-white/[0.03] border-l-2 border-transparent"
                }`}
              >
                <span className={isActive ? "text-[#7C3AED]" : "text-[#52525B]"}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="px-2 mt-auto pt-4 border-t border-white/5">
          <button 
            onClick={() => signOut({ redirectUrl: '/' })}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-sm font-mono text-sm text-[#52525B] hover:text-[#F4F4F5] hover:bg-white/[0.03] transition-colors border-l-2 border-transparent"
          >
            <span>⎋</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#050505]/95 backdrop-blur-xl border-t border-white/5 z-50 px-2 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 font-mono text-[10px] transition-colors ${
                isActive ? "text-[#9D65FF]" : "text-[#52525B]"
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
        <button 
          onClick={() => signOut({ redirectUrl: '/' })}
          className="flex flex-col items-center justify-center w-full h-full gap-1 font-mono text-[10px] text-[#52525B]"
        >
          <span className="text-sm">⎋</span>
          Sign Out
        </button>
      </div>
    </>
  );
}
