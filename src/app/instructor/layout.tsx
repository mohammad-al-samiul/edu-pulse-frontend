 "use client";
 
 import RoleGuard from "@/components/layout/RoleGuard";
 import { DashboardShell } from "@/components/layout/DashboardShell";
 
 export default function InstructorLayout({
   children,
 }: {
   children: React.ReactNode;
 }) {
   return (
     <RoleGuard allowedRoles={["INSTRUCTOR"]}>
       <DashboardShell role="INSTRUCTOR">{children}</DashboardShell>
     </RoleGuard>
   );
 }
