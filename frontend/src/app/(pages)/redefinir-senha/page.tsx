// app/redefinir-senha/page.tsx
import { Suspense } from "react";
import RedefinirSenhaContent from "./RedefinirSenhaContent";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <RedefinirSenhaContent />
    </Suspense>
  );
}
