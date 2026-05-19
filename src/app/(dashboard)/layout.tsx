import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="ml-[260px] flex-1 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
}
