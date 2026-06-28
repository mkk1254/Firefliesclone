"use client";
import { Settings, Zap, Users, Bell, Shield, Bot } from "lucide-react";

const SECTIONS = [
  {
    icon: Bot,
    title: "Fireflies Bot",
    description: "Configure your AI meeting bot to join calls automatically",
    badge: "Coming Soon",
  },
  {
    icon: Zap,
    title: "Integrations",
    description: "Connect Zoom, Google Meet, Microsoft Teams, Slack, and more",
    badge: "Coming Soon",
  },
  {
    icon: Users,
    title: "Team & Sharing",
    description: "Invite team members, manage roles, and share meeting notes",
    badge: "Coming Soon",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Configure email and in-app notification preferences",
    badge: "Coming Soon",
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description: "Data retention, export settings, and security preferences",
    badge: "Coming Soon",
  },
];

export default function SettingsPage() {
  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your workspace preferences</p>
      </header>

      <div className="p-6 max-w-2xl">
        {/* Profile section */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Profile</h3>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ background: "var(--accent)" }}>
              MK
            </div>
            <div>
              <p className="font-medium text-gray-900">Monal Khatri</p>
              <p className="text-sm text-gray-500">khatrimonal05@gmail.com</p>
            </div>
            <button className="ml-auto px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
              Edit Profile
            </button>
          </div>
        </section>

        {/* Placeholder sections */}
        <div className="space-y-3">
          {SECTIONS.map(({ icon: Icon, title, description, badge }) => (
            <div key={title} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 opacity-75">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">{title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{description}</p>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 flex-shrink-0">
                {badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
