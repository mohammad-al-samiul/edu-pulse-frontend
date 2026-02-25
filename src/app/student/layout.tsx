 "use client";
 
 import RoleGuard from "@/components/layout/RoleGuard";
 import { DashboardShell } from "@/components/layout/DashboardShell";
 
 export default function StudentLayout({
   children,
 }: {
   children: React.ReactNode;
 }) {
   return (
     <RoleGuard allowedRoles={["STUDENT"]}>
       <DashboardShell role="STUDENT">{children}</DashboardShell>
     </RoleGuard>
   );
 }
