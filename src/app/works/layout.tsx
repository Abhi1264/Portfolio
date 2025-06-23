import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function WorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-neutral-100">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
