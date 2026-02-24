"use client";

import { useRoleGuard } from "@/hooks/useRoleGuard";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useRoleGuard(["STUDENT"]);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-5 hidden md:block">
        <h2 className="text-xl font-bold mb-6">Student Panel</h2>

        <nav className="space-y-3">
          <a href="/dashboard" className="block hover:text-blue-600">
            Dashboard
          </a>
          <a href="/my-courses" className="block hover:text-blue-600">
            My Courses
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
