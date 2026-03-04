"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  Users,
  DollarSign,
  Bot,
  Settings,
  Cookie,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Production",
    items: [
      { href: "/episodes", label: "Episodes", icon: Film },
      { href: "/characters", label: "Characters", icon: Users },
      { href: "/costs", label: "Costs", icon: DollarSign },
    ],
  },
  {
    title: "Framework",
    items: [
      { href: "/agents", label: "Agents", icon: Bot },
      { href: "/config", label: "Config", icon: Settings },
    ],
  },
];

export function Sidebar({
  open,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full w-[280px] flex-col border-r bg-card",
        open !== undefined &&
          "fixed inset-y-0 left-0 z-50 transition-transform duration-200 lg:static lg:translate-x-0",
        open === false && "-translate-x-full"
      )}
    >
      <div className="flex h-14 items-center justify-between border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Cookie className="h-5 w-5" />
          <span>COOKIE Dashboard</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="mb-6">
            <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {section.title}
            </p>
            {section.items.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
