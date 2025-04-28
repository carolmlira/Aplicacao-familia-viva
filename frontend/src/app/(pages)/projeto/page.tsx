import React from "react";
import "./projetos.css";

export default function PageProjetos() {
  const projetos = [
    {
      id: 1,
      titulo: "Arrecadação de alimentos",
      descricao: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sit amet lacus vitae justo pulvinar blandit.",
      imagem: "/images/projeto1.jpg",
    },
    {
      id: 2,
      titulo: "Arrecadação de alimentos",
      descricao: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sit amet lacus vitae justo pulvinar blandit.",
      imagem: "/images/projeto1.jpg",
    },
    {
      id: 3,
      titulo: "Arrecadação de alimentos",
      descricao: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sit amet lacus vitae justo pulvinar blandit.",
      imagem: "/images/projeto1.jpg",
    },
  ];

  return (
    <div className="projetos-container">
      <div className="projetos-header">
        <h1>Projetos</h1>
      </div>

      <div className="projetos-content">
        {projetos.map((projeto) => (
          <div key={projeto.id} className="projeto-card">
            <div className="projeto-img">
              <img src={projeto.imagem} alt={projeto.titulo} />
            </div>
            <div className="projeto-texto">
              <h2>{projeto.titulo}</h2>
              <p>{projeto.descricao}</p>
            </div>
          </div>
        ))}
      </div>

      <footer className="projetos-footer">
        <div className="footer-contato">
          <p>@familia_vivarecife</p>
        </div>
        <div className="footer-localizacao">
          <p>Av. Afonso Olindense, 1045 - Várzea, Recife - PE, 50810-000</p>
        </div>
      </footer>
    </div>
  );
}