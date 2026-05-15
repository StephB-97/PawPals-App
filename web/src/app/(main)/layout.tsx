import BottomNav from "@/components/layout/BottomNav";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <main>{children}</main>
      <BottomNav />
    </div>
  );
}
