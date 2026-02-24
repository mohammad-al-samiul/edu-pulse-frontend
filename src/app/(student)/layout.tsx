import RoleGuard from "@/components/layout/RoleGuard";
import Sidebar from "@/components/layout/Sidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["STUDENT"]}>
      <div className="flex">
        <Sidebar
          links={[
            { label: "Dashboard", href: "/student/dashboard" },
            { label: "My Courses", href: "/student/courses" },
          ]}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </RoleGuard>
  );
}
