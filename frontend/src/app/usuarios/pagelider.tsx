import React from "react";
import "./lider.css";

export default function PageLider() {
  return (
    <div className="lider-container">
      <header className="lider-header">
        <h1>Arrecadação de alimentos</h1>
        <button className="editar-button">Editar</button>
      </header>

      <main className="lider-content">
        <section className="lider-section">
          <img src="/images/projeto1.jpg" alt="Imagem principal" className="lider-img" />
          <p className="lider-texto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer blandit mauris non lorem
            feugiat, in tincidunt lorem tristique. Aenean fringilla magna sit amet lectus tincidunt,
            sed aliquam velit lacinia.
          </p>
        </section>

        <section className="lider-section">
          <p className="lider-texto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer blandit mauris non lorem
            feugiat, in tincidunt lorem tristique. Aenean fringilla magna sit amet lectus tincidunt,
            sed aliquam velit lacinia.
          </p>
          <img src="/images/projeto2.jpg" alt="Imagem secundaria" className="lider-img" />
        </section>

        <section className="lider-section">
          <img src="/images/projeto3.jpg" alt="Imagem secundaria" className="lider-img" />
          <p className="lider-texto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer blandit mauris non lorem
            feugiat, in tincidunt lorem tristique. Aenean fringilla magna sit amet lectus tincidunt,
            sed aliquam velit lacinia.
          </p>
        </section>
      </main>

      <footer className="lider-footer">
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
