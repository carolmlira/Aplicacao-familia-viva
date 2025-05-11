'use client'
import { useSession } from "next-auth/react"; 
import { useEffect, useState } from 'react'
import { useRouter } from "next/navigation"; 
import Link from "next/link";

export default function FirebaseGallery() {
  const { data: session, status } = useSession(); 
  const router = useRouter();
  
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState('gallery');
  const [subgrup, setSubgrup] = useState('');
  const [groupedFiles, setGroupedFiles] = useState<{ [subgrup: string]: string[] }>({});

  const [filesImages, setFilesimage] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "loading") return; 
  
    const role = (session?.user as any)?.role; 
    if (!session || (role !== "ADMIN" && role !== "COMUNIC")) {
      router.push("/"); 
    }
  }, [session, status, router]);

  useEffect(() => {
    const grouped = files.reduce((acc: { [key: string]: string[] }, path: string) => {
      const cleanPath = path.replace(/^gallery\//, ''); 
      const parts = cleanPath.split('/');
      const group = parts.slice(0, -1).join('/'); // exemplo: galeria/culto-jovens
      if (!acc[group]) acc[group] = [];
      acc[group].push(path);
      return acc;
    }, {});
    
    setGroupedFiles(grouped);
  }, [files]);

  useEffect(() => {
    fetchFiles();
  }, [category]); // Carrega sempre que a categoria mudar

  async function uploadFile() {
    if (filesImages.length === 0 || !subgrup) {
      alert('Por favor, selecione um ou mais arquivos e informe o subgrupo.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    filesImages.forEach((file) => {
      formData.append('files', file); // nome do campo deve bater com o backend
    });

    const fullCategory = `${category}/${subgrup}`;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/upload-gallery?category=${fullCategory}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      console.log('Arquivos enviados:', data.urls);

      await fetchFiles();

      setFilesimage([]);
      setPreviewImages([]);
      setSubgrup('');
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao enviar os arquivos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchFiles() {
    if (!category) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/list?category=${category}`);
      const data = await res.json();
      console.log('Arquivos recebidos:', data.files);
      setFiles(data.files || []);
    } catch (error) {
      console.error('Erro ao listar arquivos:', error);
    }
  }
  
  const deleteFile = async (filename: string) => {
     const confirmDelete = window.confirm('Tem certeza que deseja excluir esta imagem?');
    if (!confirmDelete) return; // Não faz nada se o usuário cancelar
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/delete-gallery?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      });
      console.log("res: ", res)
      if (!res.ok) {
        throw new Error('Erro ao deletar arquivo');
      }

      await fetchFiles();
    } catch (error) {
      console.error(error);
    }
  }
  
  function removePreviewImage(index: number) {
  const updatedPreviews = [...previewImages];
  const updatedFiles = [...filesImages];

  updatedPreviews.splice(index, 1);
  updatedFiles.splice(index, 1);

  setPreviewImages(updatedPreviews);
  setFilesimage(updatedFiles);
}

  return (
    <>
      {expandedImage && (
        <div
          onClick={() => setExpandedImage(null)}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 cursor-zoom-out"
        >
          <img
            src={expandedImage}
            alt="Imagem ampliada"
            className="max-w-full max-h-full rounded shadow-lg"
          />
        </div>
      )}

      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Galeria</h1>

        {/* Botão para abrir modal (visível só para ADMIN ou COMUNIC) */}
        {['ADMIN', 'COMUNIC'].includes((session?.user as any)?.role) && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Adicionar Seção
          </button>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
              <h2 className="text-xl font-semibold mb-4">Enviar Arquivo</h2>

              <label className="block mb-2 font-medium">Subgrupo</label>
              <input
                type="text"
                value={subgrup}
                onChange={(e) => setSubgrup(e.target.value)}
                placeholder="ex: culto jovens"
                className="border rounded px-2 py-1 w-full mb-4"
              />

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const selectedFiles = Array.from(e.target.files || []);
                  setFilesimage((prevFiles) => [...prevFiles, ...selectedFiles]);
                  const previews = selectedFiles.map((file) => URL.createObjectURL(file));
                  setPreviewImages((prevPreviews) => [...prevPreviews, ...previews]);
                }}
                className="mb-4"
              />

              {previewImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {previewImages.map((src, index) => (
                    <div key={index} className="relative">
                      <img
                        src={src}
                        alt={`preview-${index}`}
                        className="h-24 object-cover rounded border w-full"
                      />
                      <button
                        onClick={() => removePreviewImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        title="Remover imagem"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-red-300 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={uploadFile}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {loading ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de arquivos agrupados */}
        <div className="mt-8">
          {Object.entries(groupedFiles).length === 0 ? (
            <p className="text-gray-500">Nenhum arquivo encontrado.</p>
          ) : (
            Object.entries(groupedFiles).map(([group, files]) => {
              const baseUrl = 'https://firebasestorage.googleapis.com/v0/b/familia-viva-recife.firebasestorage.app/o/';
              return (
                <div key={group} className="mb-10">
                  <h2 className="text-xl font-bold mb-4 text-orange-500 capitalize">
                    {group.replace(/-/g, ' ')}
                  </h2>
                  <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {files.map((filename) => (
                      <li key={filename} className="relative">
                        <img
                          src={`${baseUrl}${encodeURIComponent(filename)}?alt=media`}
                          alt={filename}
                          className="w-full h-48 object-cover mb-2 rounded cursor-zoom-in"
                          onClick={() =>
                            setExpandedImage(`${baseUrl}${encodeURIComponent(filename)}?alt=media`)
                          }
                        />
                        <div className="absolute top-0 right-0 p-2">
                          {/* Botão de excluir (visível só para ADMIN ou COMUNIC) */}
                          {['ADMIN', 'COMUNIC'].includes((session?.user as any)?.role) && (
                            <button
                              onClick={() => deleteFile(filename)}
                              className="bg-red-500 text-white text-sm px-2 py-1 rounded hover:bg-red-600"
                            >
                              Excluir
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}