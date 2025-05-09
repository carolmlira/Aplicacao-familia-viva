"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ReactNode } from "react";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const noLayoutRoutes = ["/login", "/", "/esqueceu-senha"];

  const hideLayout = noLayoutRoutes.includes(pathname);

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
