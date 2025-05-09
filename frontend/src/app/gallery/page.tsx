'use client'
import { useSession } from "next-auth/react"; // Pega a sessão atual (quem está logado e suas permissões).
import { useEffect, useState } from 'react' // Para redirecionar o usuário se ele não for admin.
import { useRouter } from "next/navigation"; // Para redirecionamento
import Link from "next/link"; // Para criar navegação sem recarregar a página.


export default function FirebaseGallery() {
  const { data: session, status } = useSession(); //tem as informações de quem está logado (tipo nome, email, role)
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState('gallery');
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "loading") return; // Ainda carregando a sessão
  
    const role = (session?.user as any)?.role; 
    if (!session || (role !== "ADMIN" && role !== "COMUNIC")) {
      router.push("/"); // Redireciona se não for ADMIN ou COMUNIC
    }
  }, [session, status, router]);


  useEffect(() => {
    fetchFiles();
  }, [category]); // Carrega sempre que a categoria mudar

  async function uploadFile() {
    if (!file) return;
  
    setLoading(true);
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/upload?category=${category}`, {
        method: 'POST',
        body: formData,
      });
  
      const data = await res.json();
      console.log('Arquivo enviado:', data.url);
  
      // Depois de enviar, atualiza a lista
      await fetchFiles();
    } catch (error) {
      console.error('Erro ao enviar o arquivo:', error);
    } finally {
      setLoading(false);
    }
  }
  
  
  async function fetchFiles() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/list?category=${category}`);
      const data = await res.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error('Erro ao listar arquivos:', error);
    }
  }
  
  const deleteFile = async (filename: string) => {
    try {
      console.log("filename: ", filename)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/delete/${filename}`, {
        method: 'DELETE',
      });
      console.log("res: ", res)
      if (!res.ok) {
        throw new Error('Erro ao deletar arquivo');
      }
  
      const data = await res.json();
      console.log('Arquivo deletado:', data.message);
    } catch (error) {
      console.error(error);
    }

  };
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Galeria de Arquivos</h1>

      {/* Upload */}
      <div className="mb-6">
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button
          onClick={uploadFile}
          disabled={loading}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>

      {/* Lista de arquivos */}
      <div>
        <ul className="space-y-2">
          {files.map((filename) => (
            <li key={filename} className="flex justify-between items-center bg-gray-100 p-2 rounded">
              {/* Exibindo as imagens diretamente */}
              <img
                 src={`https://firebasestorage.googleapis.com/v0/b/familia-viva-recife.firebasestorage.app/o/${encodeURIComponent(filename)}?alt=media`} 
                alt={(filename)} // Utilizando a função para o alt também
                className="w-32 h-32 object-cover"
              />
              <div className="flex items-center space-x-2">
                <a
                  href={`https://firebasestorage.googleapis.com/v0/b/familia-viva-recife.firebasestorage.app/o/${encodeURIComponent(filename)}?alt=media`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Abrir Arquivo
                </a>
                <button
                  onClick={() => deleteFile(filename)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}