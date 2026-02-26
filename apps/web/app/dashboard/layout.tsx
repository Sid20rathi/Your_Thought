import { SidebarNav } from "@/components/dashboard/SidebarNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg-void)] flex flex-col md:flex-row">
      <SidebarNav />
      <div className="flex-1 w-full min-w-0 pb-24 md:pb-0">
        {/* pb-24 padding for mobile bottom nav */}
        {children}
      </div>
    </div>
  );
}
