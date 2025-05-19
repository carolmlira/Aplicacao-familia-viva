"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { Footer } from "@/components/footer";
import { ReactNode, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";

// IMPORTAR Header com SSR desativado
const Header = dynamic(() => import("@/components/header"), { ssr: false });

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()?.replace(/\/$/, "");
  const noLayoutRoutes = ["/login", "/esqueceu-senha", "/redefinir-senha"];

  const hideLayout = noLayoutRoutes.includes(pathname);

  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (hideLayout) return;

    const resetTimer = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        alert("Usuário inativo por 30 minutos. Fazendo logout...");
        signOut();
      }, 30 * 60 * 1000); // 30 minutos
    };

    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) => document.addEventListener(event, resetTimer));

    resetTimer(); // Inicia o timer

    return () => {
      events.forEach((event) =>
        document.removeEventListener(event, resetTimer)
      );
      if (timer.current) clearTimeout(timer.current);
    };
  }, [hideLayout]);

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
