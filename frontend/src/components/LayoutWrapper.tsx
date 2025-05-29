"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { Footer } from "@/components/footer";
import { ReactNode } from "react";

// IMPORTAR Header com SSR desativado
const Header = dynamic(() => import("@/components/header"), { ssr: false });

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const noLayoutRoutes = ["/login", "/esqueceu-senha", "/redefinir-senha"];

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
