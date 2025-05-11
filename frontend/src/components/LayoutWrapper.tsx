"use client";

import { usePathname } from "next/navigation";
<<<<<<< HEAD
<<<<<<< HEAD
import dynamic from "next/dynamic";
import { Footer } from "@/components/footer";
import { ReactNode } from "react";

// IMPORTAR Header com SSR desativado
const Header = dynamic(() => import("@/components/header"), { ssr: false });

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const noLayoutRoutes = ["/login", "/esqueceu-senha", "/redefinir-senha"];
=======
=======
>>>>>>> 47f7474 (Correção Telas, Implem Escala, Exceções em Usuarios)
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ReactNode } from "react";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
<<<<<<< HEAD
<<<<<<< HEAD
  const noLayoutRoutes = ["/login", "/", "/escala","/usuarios"];
>>>>>>> 8dea4da (Front parcialmente feito)
=======
  const noLayoutRoutes = ["/login", "/",];
>>>>>>> 36db846 (Finalização da home, inicialização da page Galeria)
=======
  const noLayoutRoutes = ["/login", "/", "/esqueceu-senha"];
<<<<<<< HEAD
>>>>>>> 11ba172 (Finalização das pages Admin, inserção da page 'Esqueceu a senha', e ajustes em algumas pages)
=======
=======
import dynamic from "next/dynamic";
import { Footer } from "@/components/footer";
import { ReactNode } from "react";

// IMPORTAR Header com SSR desativado
const Header = dynamic(() => import("@/components/header"), { ssr: false });

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
<<<<<<< HEAD
  const noLayoutRoutes = ["/login"];
>>>>>>> 5f138ea (Correção Telas, Implem Escala, Exceções em Usuarios)
<<<<<<< HEAD
>>>>>>> 47f7474 (Correção Telas, Implem Escala, Exceções em Usuarios)
=======
=======
  const noLayoutRoutes = ["/login", "/esqueceu-senha", "/redefinir-senha"];
>>>>>>> 0efbb5e (Recuperação de senha, Module Email, Correções telas)
>>>>>>> 0594157 (Recuperação de senha, Module Email, Correções telas)

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
<<<<<<< HEAD
}
=======
}
>>>>>>> 8dea4da (Front parcialmente feito)
