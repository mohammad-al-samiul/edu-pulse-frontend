import RoleGuard from "@/components/layout/RoleGuard";
import Sidebar from "@/components/layout/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="flex">
        <Sidebar
          links={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Users", href: "/admin/users" },
          ]}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </RoleGuard>
  );
}
