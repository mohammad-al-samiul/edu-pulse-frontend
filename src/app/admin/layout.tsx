 "use client";
 
 import RoleGuard from "@/components/layout/RoleGuard";
 import { DashboardShell } from "@/components/layout/DashboardShell";
 
 export default function AdminLayout({
   children,
 }: {
   children: React.ReactNode;
 }) {
   return (
     <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
       <DashboardShell role="ADMIN">{children}</DashboardShell>
     </RoleGuard>
   );
 }
