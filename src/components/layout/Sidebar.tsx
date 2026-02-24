"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

interface SidebarProps {
  links: { label: string; href: string }[];
}

export default function Sidebar({ links }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={clsx(
        "h-screen bg-background border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && <h2 className="font-bold">Dashboard</h2>}
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      <nav className="space-y-2 px-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-lg px-3 py-2 hover:bg-muted transition"
          >
            {collapsed ? link.label[0] : link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
