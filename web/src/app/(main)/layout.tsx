import BottomNav from "@/components/layout/BottomNav";
import Sidebar from "@/components/layout/SideBar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="pb-16 md:pb-0 md:ml-56">{children}</main>
      <BottomNav />
    </div>
  );
}
