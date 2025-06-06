'use client'

import { useSession } from "next-auth/react"; 
import { useEffect, useState, useCallback  } from 'react'
import { useRouter } from "next/navigation"; 
import Image from 'next/image';

export default function FirebaseGallery() {
  const { data: session, status } = useSession(); 
  const router = useRouter();
  
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [category,] = useState('gallery');
  const [subgrup, setSubgrup] = useState('');
  const [groupedFiles, setGroupedFiles] = useState<{ [subgrup: string]: string[] }>({});
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [filesImages, setFilesimage] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    // Se o usuário estiver logado, mas não tiver permissão, redireciona
    if (session) {
      const role = (session.user)?.role;
      if (role !== "ADMIN" && role !== "COMUNIC") {
        router.push("/");
      }
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

  const fetchFiles = useCallback(async () => {
      if (!category) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/list?category=${category}`);
        const data = await res.json();
        setFiles(data.files || []);
      } catch (error) {
        console.error('Erro ao listar arquivos:', error);
      }
    }, [category]);


  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);


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

  const deleteFile = async (filename: string) => {
     const confirmDelete = window.confirm('Tem certeza que deseja excluir esta imagem?');
    if (!confirmDelete) return; // Não faz nada se o usuário cancelar.
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
  
  const hasRole = (allowed: string[], role?: string) => {
    return role ? allowed.includes(role) : false;
  };
  
  function removePreviewImage(index: number) {
    const updatedPreviews = [...previewImages];
    const updatedFiles = [...filesImages];

    updatedPreviews.splice(index, 1);
    updatedFiles.splice(index, 1);

    setPreviewImages(updatedPreviews);
    setFilesimage(updatedFiles);
  }

  function toggleGroupExpansion(group: string) {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  }

  return (
    <>
      {expandedImage && (
        <div
          onClick={() => setExpandedImage(null)}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 cursor-zoom-out"
        >
          <Image
            src={expandedImage}
            alt="Imagem ampliada"
            width={800}        // defina a largura desejada
            height={600}       // defina a altura desejada
            className="max-w-full max-h-full rounded shadow-lg"
            style={{ objectFit: 'contain' }}
          />
        </div>
      )}
      <div className="p-8">
        <div className="galley-header">
          <div className="flex justify-between items-center mb-6 w-full">
            <h1
              className="font-bold text-left mr-4"
              style={{
                fontSize: '40px',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              <span className="bg-gradient-to-r from-[#FE3012] via-[#FE6116] via-[#FE8719] via-[#FEA819] to-[#FEC31A] bg-clip-text text-transparent">
                Galeria
              </span>
            </h1>
            {/* Botão para abrir modal (visível só para ADMIN ou COMUNIC) */}
            {hasRole(['ADMIN', 'COMUNIC'], session?.user?.role) &&  (
              <button
                onClick={() => setShowModal(true)}
                className="ml-auto bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Adicionar Seção
              </button>
            )}
          </div>
        </div>  
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative text-gray-800">
              <h2 className="text-xl font-semibold mb-4">Enviar Arquivo</h2>

              <label className="block mb-2 font-medium">Subgrupo</label>
              <input
                type="text"
                value={subgrup}
                onChange={(e) => setSubgrup(e.target.value)}
                placeholder="ex: culto jovens"
                className="border rounded px-2 py-1 w-full mb-4 text-gray-800"
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
                className="mb-9 text-gray-800" id="file_input"
              />

              {previewImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {previewImages.map((src, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={src}
                        alt={`preview-${index}`}
                        width={300}
                        height={96}
                        className="object-contain rounded border w-full h-24"
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
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-orange-500 capitalize">
                      {group.replace(/-/g, ' ')}
                    </h2>

                    {files.length > 4 && (
                      <button
                        onClick={() => toggleGroupExpansion(group)}
                        className="px-4 py-2"
                        style={{ color: '#fe5f2f' }}
                      >
                        {expandedGroups[group] ? 'Ver menos' : `Ver mais`}
                      </button>
                    )}
                  </div>
                  <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(expandedGroups[group] ? files : files.slice(0, 4)).map((filename) => (
                      <li key={filename} className="relative">
                        <Image
                          src={`${baseUrl}${encodeURIComponent(filename)}?alt=media`}
                          alt={filename}
                          width={300}
                          height={288}
                          className="w-full h-72 object-cover mb-2 rounded cursor-zoom-in"
                          onClick={() =>
                            setExpandedImage(`${baseUrl}${encodeURIComponent(filename)}?alt=media`)
                          }
                        />
                        <div className="absolute top-0 right-0 p-2">
                          {hasRole(['ADMIN', 'COMUNIC'], session?.user?.role) && (
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


