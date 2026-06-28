"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Mic2, Search, Settings, Users, Zap, ChevronDown,
  LayoutDashboard, Bell, HelpCircle
} from "lucide-react";
import { getInitials } from "@/lib/utils";

const NAV = [
  { href: "/meetings", icon: LayoutDashboard, label: "Meetings" },
  { href: "/search", icon: Search, label: "Search" },
];

const PLACEHOLDER_NAV = [
  { icon: Zap, label: "Integrations" },
  { icon: Users, label: "Team" },
  { icon: Bell, label: "Notifications" },
];

const USER = { name: "Monal Khatri", email: "khatrimonal05@gmail.com" };

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col" style={{ background: "var(--sidebar-bg)" }}>
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--accent)" }}>
          <Mic2 size={16} className="text-white" />
        </div>
        <span className="text-white font-semibold text-lg tracking-tight">fireflies</span>
      </div>

      {/* Add to Fireflies CTA */}
      <div className="px-3 mb-4">
        <button className="w-full text-sm py-2 px-3 rounded-lg font-medium text-white flex items-center gap-2 transition-colors hover:opacity-90"
          style={{ background: "var(--accent)" }}>
          <Mic2 size={14} />
          Add to live call
        </button>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${active ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
              style={active ? { background: "var(--sidebar-hover)", color: "white" } : {}}>
              <Icon size={16} />
              {label}
            </Link>
          );
        })}

        <div className="pt-4 pb-1 px-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Workspace</p>
        </div>

        {PLACEHOLDER_NAV.map(({ icon: Icon, label }) => (
          <button key={label}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <Icon size={16} />
            {label}
            <span className="ml-auto text-xs bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded">Soon</span>
          </button>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
          <Settings size={16} />
          Settings
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
          <HelpCircle size={16} />
          Help & Support
        </button>

        {/* User profile */}
        <div className="flex items-center gap-3 px-3 py-2.5 mt-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: "var(--accent)" }}>
            {getInitials(USER.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate">{USER.name}</p>
            <p className="text-xs text-gray-500 truncate">{USER.email}</p>
          </div>
          <ChevronDown size={14} className="text-gray-500 flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
}
