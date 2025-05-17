import Link from "next/link";
import Image from "next/image";
import styles from "./header.module.css";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const [isMobile, setIsMobile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileUserMenu, setShowMobileUserMenu] = useState(false);
  const [showLogoUploader, setShowLogoUploader] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [imgUserUrl, setImgUserUrl] = useState<string | null>(null);
  const id = session?.user?.id

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1000);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/logo`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.url) {
          // força o browser a baixar a imagem atualizada
          setLogoUrl(`${data.url}?t=${Date.now()}`);
        }
      })
      .catch((err) => console.error("Erro ao carregar logo:", err));
  }, []);


  useEffect(() => {
    if (!id) return 

    async function fetchUser() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
          credentials: 'include',
        })
        if (!res.ok) throw new Error('Erro ao carregar dados do usuário')
        const user = await res.json()
        setImgUserUrl(user.photo || null)
      } catch (err) {
        console.error(err)
        alert('Não foi possível carregar os dados do perfil')
      }
    }

    fetchUser()
  }, [id]) 

  const handleLogoClick = () => {
    if (!session || role !== "ADMIN") {
      window.location.href = "/";
    } else {
      setShowLogoUploader(true);
    }
  };

  if (status === "loading") return "";

  const role = session?.user?.role;

  function scrollToFooter() {
    const footer = document.getElementById("footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  }

  const renderMenuItems = () => (
    <>
      <li>
        <Link href="/" onClick={() => setShowDropdown(false)}>
          Home
        </Link>
      </li>
      <li>
        <Link href="/#sobre" onClick={() => setShowDropdown(false)}>
          Sobre
        </Link>
      </li>
      <li>
        <Link href="/#programacao" onClick={() => setShowDropdown(false)}>
          Cultos
        </Link>
      </li>
      <li>
        <Link href="/projeto" onClick={() => setShowDropdown(false)}>
          Projetos
        </Link>
      </li>
      <li>
        <Link href="/redes" onClick={() => setShowDropdown(false)}>
          Redes
        </Link>
      </li>
      <li>
        <Link href="/galeria" onClick={() => setShowDropdown(false)}>
          Galeria
        </Link>
      </li>
      <li>
        <button
          onClick={() => {
            scrollToFooter();
            setShowDropdown(false);
          }}
          className={styles.navButton}
        >
          Localização
        </button>
      </li>
      <li>
        <button
          onClick={() => {
            scrollToFooter();
            setShowDropdown(false);
          }}
          className={styles.navButton}
        >
          Contato
        </button>
      </li>

      {["ADMIN", "COMUNIC", "VOLUNT", "USER"].includes(role ?? "") && (
        <li>
          <Link href="/escala" onClick={() => setShowDropdown(false)}>
            Escalas
          </Link>
        </li>
      )}
      {role === "ADMIN" && (
        <li>
          <Link href="/usuarios" onClick={() => setShowDropdown(false)}>
            Usuários
          </Link>
        </li>
      )}
    </>
  );

  async function uploadSobreImage(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file); // nome do campo esperado no backend

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/upload/logo`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Erro ao fazer upload da imagem da logo");
    }

    const data = await res.json();
    return data.url; // supondo que o backend retorna { url: string }
  }

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <button
          onClick={handleLogoClick}
          className={!showDropdown ? "" : styles.logoHidden}
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
        >
          <Image src={logoUrl || "/logo.svg"} alt="Logo" width={70} height={70} />
        </button>
        {showLogoUploader && (
          <div className={styles.logoModal}>
            <div className={styles.logoModalContent}>
              <h3 style={{ fontWeight: "bold", color: "orangered" }}>Enviar nova logo</h3>
              <input
                type="file"
                style={{ boxShadow: "0 4px 4px -2px rgba(0, 0, 0, 0.3)" }}
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = await uploadSobreImage(file);
                    if (url) {
                      setLogoUrl(url);
                      setShowLogoUploader(false);
                    }
                  }
                }}
              />
              <button className={styles.buttonCancele} onClick={() => setShowLogoUploader(false)}>Cancelar</button>
            </div>
          </div>
        )}

        {isMobile ? (
          <div className={styles.mobileMenu}>
            <Image
              src="/images/list.svg"
              alt="Menu"
              width={30}
              height={30}
              onClick={() => {
                setShowDropdown(!showDropdown);
                setShowMobileUserMenu(false);
              }}
              className={styles.menuIcon}
            />

            {showDropdown && (
              <ul className={styles.dropdownMenu}>
                {renderMenuItems()}
                {session ? (
                  <li>
                    <button
                      onClick={() => setShowMobileUserMenu(!showMobileUserMenu)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      {session.user?.name}
                      <Image
                        src="/images/seta.svg"
                        alt="Seta"
                        width={12}
                        height={12}
                      />
                    </button>

                    {showMobileUserMenu && (
                      <ul
                        style={{
                          listStyle: "none",
                          paddingLeft: 0,
                          marginTop: 8,
                        }}
                      >
                        <li>
                         <Link
                          href="/perfil"

                            onClick={() => {
                              setShowDropdown(false);
                              setShowMobileUserMenu(false);
                            }}
                          >
                            Editar Perfil
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              setShowDropdown(false);
                              setShowMobileUserMenu(false);
                              signOut({ redirect: false }).then(() => {
                                window.location.href = `${process.env.NEXT_PUBLIC_API_URL}`;
                              });
                            }}
                          >
                            Sair
                          </button>
                        </li>
                      </ul>
                    )}
                  </li>
                ) : (
                  <li>
                    <Link href="/login" onClick={() => setShowDropdown(false)}>
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            )}
          </div>
        ) : (
          <>
            <ul className={styles["nav-menu"]}>{renderMenuItems()}</ul>

            <div className={styles["login-container"]}>
              {session ? (
                <div className={styles.userMenu}>
                  <Image
                    src={imgUserUrl || "/images/icon-user.svg"}
                    alt="Foto do usuário"
                    width={40}
                    height={40}
                    className={styles.userImage}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  />

                  {showUserMenu && (
                    <div className={styles.userDropdown}>
                      <p className={styles.userName}>{session.user?.name}</p>
                      <Link
                        href="/perfil"
                        onClick={() => setShowUserMenu(false)}
                        className={styles.userLink}
                      >
                        Editar Perfil
                      </Link>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            signOut({ redirect: false }).then(() => {
                              window.location.href = `${process.env.NEXT_PUBLIC_API_URL}`;
                            });
                          }}
                          className={styles.userLink}
                        >
                          Sair
                        </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className={styles.botaoLogin}>
                  Login
                </Link>
              )}
            </div>
          </>
        )}
      </nav>
    </header>
  );
}