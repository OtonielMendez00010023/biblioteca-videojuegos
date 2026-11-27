import axios from "axios";
import {
  getUsers,
  updateUserStatus,
  login,
  logout,
  register,
  getProfile,
  type AdminUser,
  type UserProfile,
} from "./services/authService";
import { checkout, getAdminSales, getVendorSales, getInvoiceDetail, getMyInvoices, type InvoiceDetail, type MyInvoice } from "./services/commerceService";
import {
  getGames,
  createGame,
  updateGame,
  deleteGame,
  mapGenreToCategoryIds,
  type BackendGame,
} from "./services/gameService";
import { claimGames, getMyLibrary } from "./services/libraryService";
import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from "react";
import "./LEVEL-panel-administrador.css";
import "./LEVEL-responsive-ajustes.css";
import "./LEVEL-portadas-detalles-fix.css";
import "./LEVEL-portadas-detalles-visual.css";
import "./LEVEL-menu-movil.css";
import "./LEVEL-detail-polish.css";
import "./LEVEL-detail-overlay.css";
import "./LEVEL-seller-image-preview.css";

type View =
  | "login"
  | "register"
  | "home"
  | "details"
  | "profile"
  | "invoices"
  | "invoiceDetail"
  | "checkout"
  | "invoice"
  | "seller"
  | "admin";

type Game = {
  id: number;
  title: string;
  genre: string;
  rating: string;
  image: string;
  price: number;
  stock: number;
  description: string;
  studio?: string;
  tagline?: string;
  isSellerProduct?: boolean;
  ownerId?: number;
  platforms?: string[];
};

type CartItem = {
  game: Game;
  quantity: number;
};

type Invoice = {
  number: string;
  date: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  total: number;
};

function mapBackendGameToUI(item: BackendGame): Game {
  return {
    id: item.id_videojuego,
    ownerId: item.id_vendedor,
    platforms: item.plataformas || [],
    title: item.titulo,
    genre: item.categorias || "Sin etiquetas",
    rating: "9.0",
    image: item.imagen || images.hero,
    price: Number(item.precio),
    stock: item.stock,
    description: item.descripcion || "Sin descripción disponible.",
    studio: item.estudio ?? undefined,
    tagline: item.tagline ?? undefined,
    isSellerProduct: true,
  };
}

const images = {
  hero: "https://images.unsplash.com/photo-1705510144116-cc4d88838b14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxjeWJlcnB1bmslMjBmdXR1cmlzdGljJTIwdmlkZW8lMjBnYW1lJTIwbmVvbiUyMGRhcmslMjBjaXR5JTIwbGFuZHNjYXBlfGVufDF8fHx8MTc5Mzk4NDUyOHww&ixlib=rb-4.1.0&q=80&w=1080",
  city: "https://images.unsplash.com/photo-1672872476232-da16b45c9001?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjeWJlcnB1bmslMjBmdXR1cmlzdGljJTIwdmlkZW8lMjBuZW9uJTIwZGFyayUyMGNpdHklMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzkzOTg0NTI4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  towers:
    "https://images.unsplash.com/photo-1535391879778-3bae11d29a24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjeWJlcnB1bmslMjBmdXR1cmlzdGljJTIwdmlkZW8lMjBnYW1lJTIwbmVvbiUyMGRhcmslMjBjaXR5JTIwbGFuZHNjYXBlfGVufDF8fHx8MTc5Mzk4NDUyOHww&ixlib=rb-4.1.0&q=80&w=1080",
  bench:
    "https://images.unsplash.com/photo-1668211834355-2cdf073f2351?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxjeWJlcnB1bmslMjBmdXR1cmlzdGljJTIwdmlkZW8lMjBnYW1lJTIwbmVvbiUyMGRhcmslMjBjaXR5JTIwbGFuZHNjYXBlfGVufDF8fHx8MTc5Mzk4NDUyOHww&ixlib=rb-4.1.0&q=80&w=1080",
  car: "https://images.unsplash.com/photo-1600998837340-4887228e311f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxjeWJlcnB1bmslMjBmdXR1cmlzdGljJTIwdmlkZW8lMjBnYW1lJTIwbmVvbiUyMGRhcmslMjBjaXR5JTIwbGFuZHNjYXBlfGVufDF8fHx8MTc5Mzk4NDUyOHww&ixlib=rb-4.1.0&q=80&w=1080",
  rider:
    "https://images.unsplash.com/photo-1642345843526-6279c8880a49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxjeWJlcnB1bmslMjBmdXR1cmlzdGljJTIwdmlkZW8lMjBnYW1lJTIwbmVvbiUyMGRhcmslMjBjaXR5JTIwbGFuZHNjYXBlfGVufDF8fHx8MTc5Mzk4NDUyOHww&ixlib=rb-4.1.0&q=80&w=1080",
  street:
    "https://images.unsplash.com/photo-1613535167523-0da946b83ffb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxjeWJlcnB1bmslMjBmdXR1cmlzdGljJTIwdmlkZW8lMjBnYW1lJTIwbmVvbiUyMGRhcmslMjBjaXR5JTIwbGFuZHNjYXBlfGVufDF8fHx8MTc5Mzk4NDUyOHww&ixlib=rb-4.1.0&q=80&w=1080",
  skyline:
    "https://images.unsplash.com/photo-1584905399334-110483dd2627?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw5fHxjeWJlcnB1bmslMjBmdXR1cmlzdGljJTIwdmlkZW8lMjBnYW1lJTIwbmVvbiUyMGRhcmslMjBjaXR5JTIwbGFuZHNjYXBlfGVufDF8fHx8MTc5Mzk4NDUyOHww&ixlib=rb-4.1.0&q=80&w=1080",
};

const games: Game[] = [
  {
    id: 1,
    title: "Neon Eclipse",
    genre: "RPG • Mundo abierto",
    rating: "9.4",
    image: images.hero,
    price: 39.99,
    stock: 15,
    description:
      "Explora Nova Prime y descubre los secretos detrás del Eclipse.",
  },
  {
    id: 2,
    title: "Night Protocol",
    genre: "Acción • Aventura",
    rating: "8.8",
    image: images.city,
    price: 29.99,
    stock: 20,
    description: "Una aventura futurista llena de misterios y desafíos.",
  },
  {
    id: 3,
    title: "Solaris Drift",
    genre: "Carreras • Arcade",
    rating: "8.6",
    image: images.car,
    price: 24.99,
    stock: 12,
    description: "Compite en circuitos futuristas a toda velocidad.",
  },
  {
    id: 4,
    title: "Ghost Circuit",
    genre: "Acción • Sigilo",
    rating: "9.1",
    image: images.rider,
    price: 34.99,
    stock: 8,
    description: "Infiltra instalaciones y descubre una conspiración.",
  },
  {
    id: 5,
    title: "Parallel",
    genre: "Narrativa • Indie",
    rating: "8.4",
    image: images.bench,
    price: 19.99,
    stock: 25,
    description: "Una experiencia narrativa donde tus decisiones importan.",
  },
  {
    id: 6,
    title: "Sector Nine",
    genre: "Estrategia • Sci-fi",
    rating: "8.9",
    image: images.towers,
    price: 27.99,
    stock: 10,
    description: "Construye tu estrategia y domina el Sector Nine.",
  },
  {
    id: 7,
    title: "Afterlight",
    genre: "Supervivencia",
    rating: "8.7",
    image: images.street,
    price: 22.99,
    stock: 0,
    description: "Sobrevive en un mundo donde cada recurso cuenta.",
  },
  {
    id: 8,
    title: "Zero District",
    genre: "Shooter • Online",
    rating: "9.0",
    image: images.skyline,
    price: 32.99,
    stock: 18,
    description: "Enfréntate a otros jugadores en combates futuristas.",
  },
];

function Icon({
  name,
  size = 20,
  className = "",
}: {
  name:
    | "search"
    | "star"
    | "arrow"
    | "plus"
    | "gamepad"
    | "grid"
    | "logout"
    | "cart"
    | "image-plus"
    | "eye";
  size?: number;
  className?: string;
}) {
  const paths: Record<string, ReactNode> = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    star: (
      <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" />
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m14 7 5 5-5 5" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    gamepad: (
      <>
        <path d="M8 8h8a5 5 0 0 1 4.8 6.4l-.7 2.4a2 2 0 0 1-3.2 1l-2.2-1.8H9.3l-2.2 1.8a2 2 0 0 1-3.2-1l-.7-2.4A5 5 0 0 1 8 8Z" />
        <path d="M7 12h4M9 10v4M16.5 11.5h.01M18 14h.01" />
      </>
    ),
    grid: (
      <>
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
      </>
    ),
    logout: (
      <>
        <path d="M10 5H5v14h5" />
        <path d="M13 8l4 4-4 4M8 12h9" />
      </>
    ),
    cart: (
      <>
        <circle cx="9" cy="20" r="1" />
        <circle cx="19" cy="20" r="1" />
        <path d="M2 3h2l2.4 12.2a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6L22 7H5" />
      </>
    ),
    "image-plus": (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9" r="1.5" />
        <path d="m21 15-5-5L5 20M16 4v6M13 7h6" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      {paths[name]}
    </svg>
  );
}

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="logo"
      onClick={onClick}
      type="button"
      aria-label="Ir al inicio"
    >
      <span className="logo-mark">
        <Icon name="gamepad" size={21} />
      </span>
      <span>LEVEL</span>
    </button>
  );
}

function Navbar({
  setView,
  search,
  setSearch,
  cartCount,
  onOpenCart,
}: {
  setView: (view: View) => void;
  search: string;
  setSearch: (value: string) => void;
  cartCount?: number;
  onOpenCart?: () => void;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const role = sessionStorage.getItem("level_role");
  const isBuyer = role === "COMPRADOR";
  const isSeller = role === "VENDEDOR";
  const isAdmin = role === "ADMINISTRADOR";
  const initials = sessionStorage.getItem("level_user_initials") || "LV";

  function handleNavbarLogout() {
    logout();
    window.location.reload();
  }

  function navigate(view: View) {
    setView(view);
    setMobileMenuOpen(false);
  }

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Logo onClick={() => navigate("home")} />
        <nav className="nav-links" aria-label="Navegación principal">
          <button onClick={() => navigate("home")} type="button">
            Explorar
          </button>
          <button onClick={() => navigate("profile")} type="button">
            Mi perfil
          </button>
          {isBuyer && (
            <button onClick={() => navigate("invoices")} type="button">
              Mis facturas
            </button>
          )}
          {isSeller && (
            <button onClick={() => navigate("seller")} type="button">
              Vendedor
            </button>
          )}
          {isAdmin && (
            <button onClick={() => navigate("admin")} type="button">
              Administración
            </button>
          )}
        </nav>
        <label className="search-box">
          <Icon name="search" size={18} />
          <input
            aria-label="Buscar juegos"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar juegos..."
            value={search}
          />
          <span className="key">⌘ K</span>
        </label>
        {isBuyer && (
          <button
            className="cart-button"
            onClick={onOpenCart}
            type="button"
            aria-label="Abrir carrito"
          >
            <Icon name="cart" size={19} />
            {(cartCount ?? 0) > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </button>
        )}
        <button className="nav-logout" onClick={handleNavbarLogout} type="button">
          <Icon name="logout" size={17} /> Cerrar sesión
        </button>
        <button
          className="avatar-button"
          onClick={() => navigate("profile")}
          type="button"
          aria-label="Abrir perfil"
        >
          <span>{initials}</span>
          <i aria-hidden="true" />
        </button>
        <button
          className={`mobile-menu-toggle ${mobileMenuOpen ? "is-open" : ""}`}
          onClick={() => setMobileMenuOpen((open) => !open)}
          type="button"
          aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      {mobileMenuOpen && (
        <nav
          className="mobile-navigation"
          id="mobile-navigation"
          aria-label="Navegación móvil"
        >
          <button onClick={() => navigate("home")} type="button">
            Explorar
          </button>
          <button onClick={() => navigate("profile")} type="button">
            Mi perfil
          </button>
          {isBuyer && <button onClick={() => navigate("invoices")} type="button">Mis facturas</button>}
          {isSeller && (
            <button onClick={() => navigate("seller")} type="button">
              Vendedor
            </button>
          )}
          {isAdmin && (
            <button onClick={() => navigate("admin")} type="button">
              Administración
            </button>
          )}
          <button onClick={handleNavbarLogout} type="button">Cerrar sesión</button>
        </nav>
      )}
    </header>
  );
}

function AuthLayout({
  mode,
  setView,
  onAuthenticated,
}: {
  mode: "login" | "register";
  setView: (view: View) => void;
  onAuthenticated: () => void;
}) {
  const isLogin = mode === "login";

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rol, setRol] = useState<"COMPRADOR" | "VENDEDOR">("COMPRADOR");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!isLogin && password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login(correo, password);
      } else {
        await register({
          nombre,
          apellido,
          correo,
          password,
          rol,
        });

        await login(correo, password);
      }

      onAuthenticated();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.error ??
            error.response?.data?.message ??
            "No se pudo conectar con el servidor.",
        );
      } else {
        setError("Ocurrió un error inesperado.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-brand">
        <Logo onClick={() => setView("login")} />
      </div>

      <section className="auth-card">
        <div className="auth-heading">
          <span className="eyebrow">
            {isLogin ? "TU BIBLIOTECA TE ESPERA" : "ÚNETE A LA COMUNIDAD"}
          </span>

          <h1>{isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}</h1>

          <p>
            {isLogin
              ? "Accede para seguir descubriendo nuevos mundos."
              : "Guarda, organiza y descubre tu próxima aventura."}
          </p>
        </div>

        <form onSubmit={submit}>
          {!isLogin && (
            <>
              <Field
                label="Nombre"
                placeholder="Tu nombre"
                type="text"
                value={nombre}
                onChange={setNombre}
              />

              <Field
                label="Apellido"
                placeholder="Tu apellido"
                type="text"
                value={apellido}
                onChange={setApellido}
              />

              <label className="field">
                <span>Tipo de cuenta</span>
                <select
                  value={rol}
                  onChange={(event) =>
                    setRol(event.target.value as "COMPRADOR" | "VENDEDOR")
                  }
                >
                  <option value="COMPRADOR">Comprador</option>
                  <option value="VENDEDOR">Vendedor</option>
                </select>
              </label>
            </>
          )}

          <Field
            label="Correo electrónico"
            placeholder="tu@correo.com"
            type="email"
            value={correo}
            onChange={setCorreo}
          />

          <Field
            label="Contraseña"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={setPassword}
          />

          {!isLogin && (
            <Field
              label="Confirmar contraseña"
              placeholder="••••••••"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
          )}

          {error && (
            <p role="alert" style={{ color: "#f87171" }}>
              {error}
            </p>
          )}

          <button
            className="primary-button auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Procesando..."
              : isLogin
                ? "Iniciar sesión"
                : "Registrarse"}

            <Icon name="arrow" size={18} />
          </button>
        </form>

        <div className="auth-switch">
          <span>
            {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes una cuenta?"}
          </span>

          <button
            onClick={() => {
              setError("");
              setView(isLogin ? "register" : "login");
            }}
            type="button"
          >
            {isLogin ? "Regístrate" : "Inicia sesión"}
          </button>
        </div>
      </section>

      <p className="auth-footer">Tu universo de juegos, en un solo lugar.</p>
    </main>
  );
}

function Field({
  label,
  placeholder,
  type,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
      />
    </label>
  );
}

function GameCard({
  game,
  onClick,
  onAddToCart,
}: {
  game: Game;
  onClick: () => void;
  onAddToCart: () => void;
}) {
  return (
    <article className="game-card">
      <button
        className="game-card-open"
        onClick={onClick}
        type="button"
        aria-label={`Ver detalles de ${game.title}`}
      >
        <div className="game-cover">
          <img src={game.image} alt={`Portada de ${game.title}`} />
          <span className="rating">
            <Icon name="star" size={13} /> {game.rating}
          </span>
        </div>
        <div className="game-info">
          <h3>{game.title}</h3>
          <p>{game.genre}</p>
          <div className="game-price-row">
            <strong>${game.price.toFixed(2)}</strong>
            <span className={game.stock > 0 ? "in-stock" : "out-of-stock"}>
              {game.stock > 0 ? `${game.stock} disponibles` : "Agotado"}
            </span>
          </div>
        </div>
      </button>
      <button
        className="add-cart-button"
        type="button"
        disabled={game.stock === 0}
        onClick={onAddToCart}
      >
        {game.stock === 0 ? "Agotado" : "+ Añadir al carrito"}
      </button>
    </article>
  );
}

function Home({
  setView,
  setSelectedGameId,
  search,
  setSearch,
  cartCount,
  onOpenCart,
  onAddToCart,
  catalogGames,
}: {
  setView: (view: View) => void;
  setSelectedGameId: (id: number) => void;
  search: string;
  setSearch: (value: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onAddToCart: (game: Game) => void;
  catalogGames: Game[];
}) {
  const visibleGames = catalogGames.filter((game) =>
    game.title.toLowerCase().includes(search.toLowerCase()),
  );
  const featuredGame = catalogGames[0];

  return (
    <div className="app-shell">
      <Navbar
        setView={setView}
        search={search}
        setSearch={setSearch}
        cartCount={cartCount}
        onOpenCart={onOpenCart}
      />
      <main className="page-container">
        <section className="hero">
          {featuredGame && <img src={featuredGame.image} alt={`Portada de ${featuredGame.title}`} />}
          <div className="hero-overlay" />
          <div className="hero-content">
            <span className="feature-label">
              <i /> DESTACADO DE LA SEMANA
            </span>
            <h1>{featuredGame ? featuredGame.title.toUpperCase() : "CATÁLOGO LEVEL"}</h1>
            <p>{featuredGame?.tagline || featuredGame?.description || "Agrega videojuegos desde la base de datos para verlos aquí."}</p>
            {featuredGame && <button className="primary-button" onClick={() => { setSelectedGameId(featuredGame.id); setView("details"); }} type="button">Ver más <Icon name="arrow" size={18} /></button>}
          </div>
          <div className="hero-meta">
            {(featuredGame?.genre.split("•").map((tag) => tag.trim()).filter(Boolean).slice(0, 3) ?? ["Sin etiquetas"]).map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </section>

        <section className="catalog-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">EXPLORA EL CATÁLOGO</span>
              <h2>Juegos populares</h2>
            </div>
            <button className="see-all" type="button">
              Ver todos <Icon name="arrow" size={17} />
            </button>
          </div>
          {visibleGames.length ? (
            <div className="game-grid">
              {visibleGames.map((game) => (
                <GameCard
                  game={game}
                  key={game.id}
                  onClick={() => {
                    setSelectedGameId(game.id);
                    setView("details");
                  }}
                  onAddToCart={() => onAddToCart(game)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Icon name="search" size={28} />
              <h3>No encontramos ese juego</h3>
              <p>Intenta con otro nombre para seguir explorando.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Details({
  setView,
  selectedGameId,
  search,
  setSearch,
  cartCount,
  onOpenCart,
  onAddToCart,
  catalogGames,
}: {
  setView: (view: View) => void;
  selectedGameId: number | null;
  search: string;
  setSearch: (value: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onAddToCart: (game: Game) => void;
  catalogGames: Game[];
}) {
  const [saved, setSaved] = useState(false);
  const game =
    catalogGames.find((item) => item.id === selectedGameId) ??
    catalogGames[0] ??
    games[0];

  return (
    <div className="app-shell">
      <Navbar
        setView={setView}
        search={search}
        setSearch={setSearch}
        cartCount={cartCount}
        onOpenCart={onOpenCart}
      />
      <main className="detail-page-main">
        <section className="detail-banner">
          <img
            className="detail-banner-backdrop"
            src={game.image}
            alt=""
            aria-hidden="true"
          />
          <img
            className="detail-banner-image"
            src={game.image}
            alt={`Imagen principal de ${game.title}`}
          />
          <button
            className="back-button detail-back-button"
            onClick={() => setView("home")}
            type="button"
          >
            <span aria-hidden="true">←</span> Volver al catálogo
          </button>
          <div className="detail-banner-gradient" />
        </section>
        <section className="detail-container">
          <div className="detail-layout">
            <div className="detail-cover">
              <img src={game.image} alt={`Portada de ${game.title}`} />
              <div className="cover-score">
                <strong>{game.rating}</strong>
                <span>EXCELENTE</span>
              </div>
            </div>
            <article className="detail-copy">
              <span className="eyebrow">
                {game.studio?.trim() || "ESTUDIO INDEPENDIENTE"}
                {game.studio?.trim() ? "" : " • 2026"}
              </span>
              <h1>{game.title.toUpperCase()}</h1>
              <p className="detail-tagline">
                {game.tagline?.trim() || "Una nueva aventura te espera."}
              </p>
              <p className="synopsis">{game.description}</p>
              <div className="detail-block">
                <span>PLATAFORMAS</span>
                <div className="tags">{(game.platforms ?? []).map((platform) => <b key={platform}>{platform}</b>)}</div>
              </div>
              <div className="detail-block">
                <span>GÉNEROS</span>
                <p>{game.genre}</p>
              </div>
              <div className="detail-block">
                <span>PRECIO</span>
                <p className="detail-price">${game.price.toFixed(2)}</p>
              </div>
              <div className="detail-block">
                <span>DISPONIBILIDAD</span>
                <p>
                  {game.stock > 0
                    ? `${game.stock} unidades disponibles`
                    : "Agotado"}
                </p>
              </div>
              <button
                className={`primary-button library-button ${saved ? "is-saved" : ""}`}
                onClick={() => {
                  onAddToCart(game);
                  setSaved(true);
                }}
                type="button"
                disabled={game.stock === 0}
              >
                <Icon name={saved ? "grid" : "plus"} size={20} />
                {saved ? "Añadido al carrito" : "Añadir al carrito"}
              </button>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

function Profile({
  setView,
  setSelectedGameId,
  search,
  setSearch,
  purchasedGames,
  profile,
  onLogout,
}: {
  setView: (view: View) => void;
  setSelectedGameId: (id: number) => void;
  search: string;
  setSearch: (value: string) => void;
  purchasedGames: Game[];
  profile: UserProfile | null;
  onLogout: () => void;
}) {
  const roleLabel = profile?.rol === "VENDEDOR" ? "VENDEDOR LEVEL" : profile?.rol === "ADMINISTRADOR" ? "ADMINISTRADOR LEVEL" : "JUGADOR LEVEL";
  const fullName = profile ? `${profile.nombre} ${profile.apellido}` : "Cargando perfil...";
  const initials = profile ? `${profile.nombre[0] ?? ""}${profile.apellido[0] ?? ""}`.toUpperCase() : "LV";
  return (
    <div className="app-shell">
      <Navbar setView={setView} search={search} setSearch={setSearch} />
      <main className="page-container profile-page">
        <section className="profile-header">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-identity">
            <span className="eyebrow">{roleLabel}</span>
            <h1>{fullName}</h1>
            <p>{profile?.correo ?? ""}</p>
          </div>
          <div className="profile-stats">
            <div>
              <strong>{purchasedGames.length}</strong>
              <span>Juegos en biblioteca</span>
            </div>
            <div>
              <strong>{profile?.rol ?? "—"}</strong>
              <span>Rol de cuenta</span>
            </div>
            <div>
              <strong>{profile?.fecha_registro ? new Date(profile.fecha_registro).toLocaleDateString("es-SV") : "—"}</strong>
              <span>Miembro desde</span>
            </div>
          </div>
        </section>

        <section className="library-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">COLECCIÓN PERSONAL</span>
              <h2>Mi biblioteca</h2>
            </div>
            <span className="library-count">
              {purchasedGames.length}{" "}
              {purchasedGames.length === 1 ? "JUEGO" : "JUEGOS"}
            </span>
          </div>

          {purchasedGames.length > 0 ? (
            <div className="library-grid">
              {purchasedGames.map((game) => (
                <button
                  className="library-item"
                  key={game.id}
                  onClick={() => {
                    setSelectedGameId(game.id);
                    setView("details");
                  }}
                  type="button"
                >
                  <img src={game.image} alt={`Portada de ${game.title}`} />
                  <span>{game.title}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="library-empty">
              <span className="library-empty-icon">🎮</span>
              <h3>Tu biblioteca está vacía</h3>
              <p>
                Cuando compres tus primeros videojuegos, aparecerán aquí para
                que puedas consultar tu colección.
              </p>
              <button
                className="primary-button"
                onClick={() => setView("home")}
                type="button"
              >
                Explorar videojuegos <Icon name="arrow" size={18} />
              </button>
            </div>
          )}
        </section>

        <button className="logout-button" onClick={onLogout} type="button">
          <Icon name="logout" size={18} /> Cerrar sesión
        </button>
      </main>
    </div>
  );
}

function SellerDashboard({
  products,
  onAdd,
  onUpdate,
  onDelete,
  onBack,
  sales,
}: {
  products: Game[];
  onAdd: (product: Omit<Game, "id">) => void;
  onUpdate: (product: Game) => void;
  onDelete: (id: number) => void;
  onBack: () => void;
  sales: Invoice[];
}) {
  const emptyForm = {
    title: "",
    studio: "",
    tagline: "",
    genre: "",
    price: "",
    stock: "",
    description: "",
    image: "",
    platforms: [] as string[],
  };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [tagInput, setTagInput] = useState("");

  const tags = form.genre.split("•").map((tag) => tag.trim()).filter(Boolean);

  function addTag() {
    const tag = tagInput.trim();
    if (!tag || tags.some((current) => current.toLocaleLowerCase() === tag.toLocaleLowerCase())) return;
    setForm({ ...form, genre: [...tags, tag].join(" • ") });
    setTagInput("");
  }

  function removeTag(tag: string) {
    setForm({ ...form, genre: tags.filter((current) => current !== tag).join(" • ") });
  }

  const previewGame: Game = {
    id: editingId ?? -1,
    title: form.title.trim() || "Nombre del videojuego",
    studio: form.studio.trim() || "Nombre del estudio",
    tagline: form.tagline.trim() || "Frase promocional del videojuego",
    genre: form.genre.trim() || "Género del videojuego",
    price: Number(form.price) > 0 ? Number(form.price) : 0,
    stock:
      Number.isInteger(Number(form.stock)) && Number(form.stock) >= 0
        ? Number(form.stock)
        : 0,
    description:
      form.description.trim() ||
      "Aquí aparecerá la descripción del videojuego.",
    rating: "9.0",
    image: form.image,
    platforms: form.platforms,
    isSellerProduct: true,
  };

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageError("");
    if (!file.type.startsWith("image/")) {
      setImageError("Selecciona un archivo de imagen válido.");
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError("La imagen no debe superar los 5 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setForm((previous) => ({
          ...previous,
          image: reader.result as string,
        }));
      } else {
        setImageError("No se pudo cargar la imagen. Inténtalo de nuevo.");
      }
    };
    reader.onerror = () => setImageError("Ocurrió un error al leer la imagen.");
    reader.readAsDataURL(file);
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setImageError("");
    setPreviewOpen(false);
    setTagInput("");
    setFileInputKey((key) => key + 1);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (
      !form.title.trim() ||
      !form.studio.trim() ||
      !form.tagline.trim() ||
      !form.genre.trim() ||
      form.platforms.length === 0 ||
      !form.description.trim()
    ) {
      setError(
        "Completa todos los campos, incluido el estudio y la frase promocional.",
      );
      return;
    }
    if (
      !Number.isFinite(price) ||
      price <= 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      setError(
        "Ingresa un precio válido y un stock entero igual o mayor que cero.",
      );
      return;
    }
    if (!form.image) {
      setError("Debes subir una imagen del videojuego.");
      return;
    }

    if (editingId !== null) {
      const current = products.find((product) => product.id === editingId);
      if (!current) return;
      onUpdate({
        ...current,
        title: form.title.trim(),
        studio: form.studio.trim(),
        tagline: form.tagline.trim(),
        genre: form.genre.trim(),
        price,
        stock,
        description: form.description.trim(),
        image: form.image,
        platforms: form.platforms,
      });
    } else {
      onAdd({
        title: form.title.trim(),
        studio: form.studio.trim(),
        tagline: form.tagline.trim(),
        genre: form.genre.trim(),
        price,
        stock,
        description: form.description.trim(),
        rating: "—",
        image: form.image,
        platforms: form.platforms,
        isSellerProduct: true,
      });
    }

    resetForm();
  }

  function startEdit(product: Game) {
    setEditingId(product.id);
    setForm({
      title: product.title,
      studio: product.studio ?? "",
      tagline: product.tagline ?? "",
      genre: product.genre,
      price: String(product.price),
      stock: String(product.stock),
      description: product.description,
      image: product.image,
      platforms: product.platforms,
    });
    setError("");
    setImageError("");
    setPreviewOpen(false);
    setFileInputKey((key) => key + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    resetForm();
  }

  return (
    <div className="app-shell">
      <main className="seller-page">
        <div className="seller-container">
          <button className="seller-back-button" onClick={onBack} type="button">
            ← Volver al catálogo
          </button>
          <div className="seller-topline">
            <div>
              <span className="eyebrow">LEVEL STORE</span>
              <h1>Panel del vendedor</h1>
              <p>Administra el catálogo y el inventario de tus videojuegos.</p>
            </div>
            <span className="seller-role">VENDEDOR</span>
          </div>

          <div className="seller-stats">
            <div>
              <span>Productos publicados</span>
              <strong>{products.length}</strong>
            </div>
            <div>
              <span>Unidades disponibles</span>
              <strong>
                {products.reduce((sum, product) => sum + product.stock, 0)}
              </strong>
            </div>
            <div>
              <span>Productos agotados</span>
              <strong>
                {products.filter((product) => product.stock === 0).length}
              </strong>
            </div>
            <div><span>Ventas realizadas</span><strong>{sales.length}</strong></div>
          </div>

          <section className="seller-panel seller-create-panel">
            <div className="seller-section-heading">
              <div>
                <span className="eyebrow">
                  {editingId !== null
                    ? "ACTUALIZAR PRODUCTO"
                    : "NUEVO PRODUCTO"}
                </span>
                <h2>
                  {editingId !== null
                    ? "Editar videojuego"
                    : "Publicar videojuego"}
                </h2>
              </div>
            </div>

            <div className="seller-create-layout">
              <form
                className="seller-form seller-form-editor"
                onSubmit={submit}
              >
                <label className="field">
                  <span>Nombre del videojuego</span>
                  <input
                    value={form.title}
                    onChange={(event) =>
                      setForm({ ...form, title: event.target.value })
                    }
                    placeholder="Ej. Cyber Runner"
                    required
                  />
                </label>
                <label className="field">
                  <span>Estudio o desarrollador</span>
                  <input
                    value={form.studio}
                    onChange={(event) =>
                      setForm({ ...form, studio: event.target.value })
                    }
                    placeholder="Ej. Nightwave Studios"
                    required
                  />
                </label>
                <label className="field">
                  <span>Frase promocional</span>
                  <input
                    value={form.tagline}
                    onChange={(event) =>
                      setForm({ ...form, tagline: event.target.value })
                    }
                    placeholder="Ej. Una aventura más allá del tiempo"
                    required
                  />
                </label>
                <div className="field">
                  <span>Etiquetas del videojuego</span>
                  <div className="tag-entry">
                    <input value={tagInput} onChange={(event) => setTagInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addTag(); } }} placeholder="Ej. Acción" />
                    <button type="button" onClick={addTag}>Agregar</button>
                  </div>
                  <div className="seller-tags" aria-live="polite">
                    {tags.length ? tags.map((tag) => <button type="button" key={tag} onClick={() => removeTag(tag)} aria-label={`Quitar etiqueta ${tag}`}>{tag} ×</button>) : <small>Agrega una etiqueta a la vez.</small>}
                  </div>
                </div>
                <fieldset className="field"><span>Plataformas disponibles</span><div className="seller-tags">{["PC", "PS5", "XBOX SERIES", "NINTENDO SWITCH"].map((platform) => <label key={platform}><input type="checkbox" checked={form.platforms.includes(platform)} onChange={() => setForm({ ...form, platforms: form.platforms.includes(platform) ? form.platforms.filter((item) => item !== platform) : [...form.platforms, platform] })} /> {platform}</label>)}</div></fieldset>
                <label className="field">
                  <span>Precio (USD)</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.price}
                    onChange={(event) =>
                      setForm({ ...form, price: event.target.value })
                    }
                    placeholder="29.99"
                    required
                  />
                </label>
                <label className="field">
                  <span>Stock disponible</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={(event) =>
                      setForm({ ...form, stock: event.target.value })
                    }
                    placeholder="10"
                    required
                  />
                </label>
                <label className="field seller-description-field">
                  <span>Descripción</span>
                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      setForm({ ...form, description: event.target.value })
                    }
                    placeholder="Describe el videojuego..."
                    rows={3}
                    required
                  />
                </label>

                <div className="seller-image-field">
                  <label className="field">
                    <span>Imagen del videojuego</span>
                    <input
                      key={fileInputKey}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      aria-describedby="seller-image-help"
                    />
                  </label>
                  <p id="seller-image-help" className="seller-image-help">
                    Formatos de imagen · Máximo 5 MB
                  </p>
                  {imageError && (
                    <p className="seller-error" role="alert">
                      {imageError}
                    </p>
                  )}
                  {form.image && (
                    <div className="seller-selected-image">
                      <img
                        src={form.image}
                        alt="Vista previa de la imagen seleccionada"
                      />
                      <span>Imagen lista para la publicación</span>
                      <button
                        type="button"
                        onClick={() => {
                          setForm({ ...form, image: "" });
                          setFileInputKey((key) => key + 1);
                        }}
                      >
                        Quitar imagen
                      </button>
                    </div>
                  )}
                </div>

                {error && (
                  <p className="seller-error" role="alert">
                    {error}
                  </p>
                )}

                <div className="seller-form-actions">
                  <button className="primary-button" type="submit">
                    {editingId !== null
                      ? "Guardar cambios"
                      : "Publicar producto"}
                  </button>
                  <button
                    className="seller-preview-button"
                    type="button"
                    disabled={!form.image}
                    onClick={() => setPreviewOpen(true)}
                  >
                    <Icon name="eye" size={17} /> Ver videojuego completo
                  </button>
                  {editingId !== null && (
                    <button
                      className="seller-cancel-button"
                      onClick={cancelEdit}
                      type="button"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>

              <aside className="seller-live-preview">
                <div className="seller-preview-heading">
                  <span className="eyebrow">VISTA PREVIA EN VIVO</span>
                  <span className="seller-preview-dot">● ACTUALIZADA</span>
                </div>
                <p className="seller-preview-caption">
                  Así se verá la tarjeta en el catálogo.
                </p>
                <article className="game-card seller-preview-card">
                  <div className="game-card-open seller-preview-card-open">
                    <div className="game-cover">
                      {form.image ? (
                        <img
                          src={form.image}
                          alt="Portada del videojuego en vista previa"
                        />
                      ) : (
                        <div className="seller-preview-placeholder">
                          <Icon name="image-plus" size={30} />
                          <span>Sube una imagen</span>
                        </div>
                      )}
                      <span className="rating">
                        <Icon name="star" size={13} /> {previewGame.rating}
                      </span>
                    </div>
                    <div className="game-info">
                      <h3>{previewGame.title}</h3>
                      <p>{previewGame.genre}</p>
                      <div className="game-price-row">
                        <strong>${previewGame.price.toFixed(2)}</strong>
                        <span
                          className={
                            previewGame.stock > 0 ? "in-stock" : "out-of-stock"
                          }
                        >
                          {previewGame.stock > 0
                            ? `${previewGame.stock} disponibles`
                            : "Agotado"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="seller-preview-cart-label">
                    + Añadir al carrito
                  </div>
                </article>
                <p className="seller-preview-footnote">
                  La tarjeta se actualiza mientras completas el formulario.
                </p>
              </aside>
            </div>
          </section>

          <section className="seller-panel">
            <div className="seller-section-heading">
              <div>
                <span className="eyebrow">INVENTARIO</span>
                <h2>Mis videojuegos</h2>
              </div>
              <span className="library-count">{products.length} PRODUCTOS</span>
            </div>

            {products.length === 0 ? (
              <div className="seller-empty">
                Todavía no has publicado videojuegos.
              </div>
            ) : (
              <div className="seller-product-list">
                {products.map((product) => (
                  <article className="seller-product" key={product.id}>
                    <img src={product.image} alt={product.title} />
                    <div className="seller-product-info">
                      <strong>{product.title}</strong>
                      <span>{product.genre}</span>
                      <span
                        className={
                          product.stock > 0 ? "in-stock" : "out-of-stock"
                        }
                      >
                        {product.stock > 0
                          ? `${product.stock} unidades disponibles`
                          : "Agotado"}
                      </span>
                    </div>
                    <strong className="seller-product-price">
                      ${product.price.toFixed(2)}
                    </strong>
                    <div className="seller-product-actions">
                      {product.isSellerProduct ? (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(product)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="seller-delete"
                            onClick={() => onDelete(product.id)}
                          >
                            Eliminar
                          </button>
                        </>
                      ) : (
                        <span className="seller-protected-label">
                          Producto del catálogo LEVEL
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
          <section className="seller-panel">
            <div className="seller-section-heading"><div><span className="eyebrow">OPERACIONES</span><h2>Ventas de mis videojuegos</h2></div></div>
            {sales.length ? <div className="admin-sales-list">{sales.map((sale) => <article className="admin-sale-card" key={sale.number}><div className="admin-sale-heading"><div><strong>{sale.number}</strong><span>{sale.date}</span></div><b>${sale.total.toFixed(2)}</b></div><div className="admin-sale-items">{sale.items.map((item) => <span key={`${sale.number}-${item.game.id}`}>{item.game.title} × {item.quantity}</span>)}</div></article>)}</div> : <p className="admin-empty">Aún no hay ventas de tus videojuegos.</p>}
          </section>
        </div>
      </main>

      {previewOpen && (
        <div
          className="seller-preview-modal-backdrop"
          role="presentation"
          onClick={() => setPreviewOpen(false)}
        >
          <section
            className="seller-preview-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="seller-preview-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="seller-preview-modal-header">
              <div>
                <span className="eyebrow">VISTA PREVIA</span>
                <h2 id="seller-preview-title">
                  Así verá el juego un comprador
                </h2>
              </div>
              <button
                type="button"
                className="seller-preview-close"
                onClick={() => setPreviewOpen(false)}
                aria-label="Cerrar vista previa"
              >
                ×
              </button>
            </div>
            <div className="seller-full-preview">
              <div className="seller-full-preview-banner">
                <img src={form.image} alt="" />
              </div>
              <div className="seller-full-preview-content">
                <div className="seller-full-preview-cover">
                  <img
                    src={form.image}
                    alt={`Portada de ${previewGame.title}`}
                  />
                  <div className="cover-score">
                    <strong>9.0</strong>
                    <span>VISTA PREVIA</span>
                  </div>
                </div>
                <div className="seller-full-preview-info">
                  <span className="eyebrow">{previewGame.studio}</span>
                  <h1>{previewGame.title}</h1>
                  <p className="detail-tagline">{previewGame.tagline}</p>
                  <p className="synopsis">{previewGame.description}</p>
                  <div className="detail-block">
                    <span>GÉNEROS</span>
                    <p>{previewGame.genre}</p>
                  </div>
                  <div className="detail-block">
                    <span>PRECIO</span>
                    <p className="detail-price">
                      ${previewGame.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="detail-block">
                    <span>DISPONIBILIDAD</span>
                    <p>
                      {previewGame.stock > 0
                        ? `${previewGame.stock} unidades disponibles`
                        : "Agotado"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="seller-preview-modal-footer">
              <span>
                Esta es una simulación; el producto aún no se ha publicado.
              </span>
              <button
                className="primary-button"
                type="button"
                onClick={() => setPreviewOpen(false)}
              >
                Volver al formulario
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function AdminDashboard({
  products,
  invoices,
  users,
  onStatusChange,
  onUpdateProduct,
  onDeleteProduct,
  onBack,
}: {
  products: Game[];
  invoices: Invoice[];
  users: AdminUser[];
  onStatusChange: (id: number, estado: AdminUser["estado"]) => void;
  onUpdateProduct: (product: Game) => void;
  onDeleteProduct: (id: number) => void;
  onBack: () => void;
}) {
  const [section, setSection] = useState<
    "overview" | "users" | "products" | "sales"
  >("overview");
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [productError, setProductError] = useState("");

  const revenue = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const unitsSold = invoices.reduce(
    (sum, invoice) =>
      sum + invoice.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0,
  );

  function startProductEdit(product: Game) {
    setEditingProduct(product.id);
    setPrice(String(product.price));
    setStock(String(product.stock));
    setProductError("");
  }

  function saveProduct(product: Game) {
    const nextPrice = Number(price);
    const nextStock = Number(stock);
    if (
      !Number.isFinite(nextPrice) ||
      nextPrice <= 0 ||
      !Number.isInteger(nextStock) ||
      nextStock < 0
    ) {
      setProductError(
        "El precio debe ser mayor que cero y el stock un entero igual o mayor que cero.",
      );
      return;
    }
    onUpdateProduct({ ...product, price: nextPrice, stock: nextStock });
    setEditingProduct(null);
    setProductError("");
  }

  return (
    <div className="app-shell admin-shell">
      <main className="admin-page">
        <div className="admin-container">
          <button className="seller-back-button" onClick={onBack} type="button">
            ← Volver al catálogo
          </button>
          <div className="admin-heading">
            <div>
              <span className="eyebrow">LEVEL CONTROL CENTER</span>
              <h1>Panel de administración</h1>
              <p>Supervisa usuarios, catálogo y ventas de la tienda.</p>
            </div>
            <span className="admin-role-label">ADMINISTRADOR</span>
          </div>

          <nav className="admin-tabs" aria-label="Secciones de administración">
            <button
              className={section === "overview" ? "active" : ""}
              onClick={() => setSection("overview")}
              type="button"
            >
              Resumen
            </button>
            <button
              className={section === "users" ? "active" : ""}
              onClick={() => setSection("users")}
              type="button"
            >
              Usuarios
            </button>
            <button
              className={section === "products" ? "active" : ""}
              onClick={() => setSection("products")}
              type="button"
            >
              Videojuegos
            </button>
            <button
              className={section === "sales" ? "active" : ""}
              onClick={() => setSection("sales")}
              type="button"
            >
              Ventas
            </button>
          </nav>

          {section === "overview" && (
            <>
              <div className="admin-stat-grid">
                <article>
                  <span>Usuarios registrados</span>
                  <strong>{users.length}</strong>
                  <small>
                    {users.filter((user) => user.estado === "ACTIVO").length}{" "}
                    activos
                  </small>
                </article>
                <article>
                  <span>Videojuegos en catálogo</span>
                  <strong>{products.length}</strong>
                  <small>
                    {products.reduce((sum, product) => sum + product.stock, 0)}{" "}
                    unidades disponibles
                  </small>
                </article>
                <article>
                  <span>Ventas registradas</span>
                  <strong>{invoices.length}</strong>
                  <small>{unitsSold} unidades vendidas</small>
                </article>
                <article>
                  <span>Ingresos totales</span>
                  <strong>${revenue.toFixed(2)}</strong>
                  <small>Acumulado de las facturas</small>
                </article>
              </div>
              <section className="admin-panel">
                <span className="eyebrow">ACTIVIDAD RECIENTE</span>
                <h2>Últimas ventas</h2>
                {invoices.length === 0 ? (
                  <p className="admin-empty">
                    Todavía no hay ventas registradas. Las compras de
                    ventas aparecerán aquí.
                  </p>
                ) : (
                  <div className="admin-list">
                    {[...invoices]
                      .reverse()
                      .slice(0, 5)
                      .map((invoice) => (
                        <div className="admin-list-row" key={invoice.number}>
                          <div>
                            <strong>{invoice.customerName}</strong>
                            <span>
                              {invoice.number} · {invoice.date}
                            </span>
                          </div>
                          <b>${invoice.total.toFixed(2)}</b>
                        </div>
                      ))}
                  </div>
                )}
              </section>
            </>
          )}

          {section === "users" && (
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <span className="eyebrow">GESTIÓN DE CUENTAS</span>
                  <h2>Usuarios</h2>
                </div>
                <span className="library-count">{users.length} CUENTAS</span>
              </div>
              <p className="admin-note">
                Cuentas registradas en la base de datos. Las contraseñas nunca
                se muestran.
              </p>
              <div className="admin-user-list">
                {users.map((user) => (
                  <article className="admin-user-row" key={user.id_usuario}>
                    <div className="admin-user-avatar">
                      {user.nombre.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="admin-user-info">
                      <strong>
                        {user.nombre} {user.apellido}
                      </strong>
                      <span>{user.correo}</span>
                      <small
                        className={
                          user.estado === "ACTIVO"
                            ? "admin-active"
                            : "admin-inactive"
                        }
                      >
                        {user.estado}
                      </small>
                    </div>
                    <div className="admin-role-select">
                      <span>Rol</span>
                      <strong>{user.rol}</strong>
                    </div>
                    {user.rol !== "ADMINISTRADOR" && <div className="admin-row-actions">
                      {user.estado === "ACTIVO" ? <button type="button" className="admin-delete-button" onClick={() => onStatusChange(user.id_usuario, "BLOQUEADO")}>Bloquear</button> : <button type="button" onClick={() => onStatusChange(user.id_usuario, "ACTIVO")}>Activar</button>}
                      <button type="button" className="admin-muted-button" onClick={() => onStatusChange(user.id_usuario, "INACTIVO")}>Desactivar</button>
                    </div>}
                  </article>
                ))}
              </div>
            </section>
          )}

          {section === "products" && (
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <span className="eyebrow">CONTROL DEL INVENTARIO</span>
                  <h2>Todos los videojuegos</h2>
                </div>
                <span className="library-count">
                  {products.length} PRODUCTOS
                </span>
              </div>
              <div className="admin-product-list">
                {products.map((product) => (
                  <article className="admin-product-row" key={product.id}>
                    <img src={product.image} alt={product.title} />
                    <div className="admin-product-main">
                      <strong>{product.title}</strong>
                      <span>{product.genre}</span>
                      <small>
                        {product.isSellerProduct
                          ? "Publicado por vendedor"
                          : "Catálogo LEVEL"}
                      </small>
                    </div>
                    {editingProduct === product.id ? (
                      <div className="admin-product-edit">
                        <label>
                          Precio $
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={price}
                            onChange={(event) => setPrice(event.target.value)}
                          />
                        </label>
                        <label>
                          Stock
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={stock}
                            onChange={(event) => setStock(event.target.value)}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => saveProduct(product)}
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          className="admin-muted-button"
                          onClick={() => {
                            setEditingProduct(null);
                            setProductError("");
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="admin-product-values">
                          <strong>${product.price.toFixed(2)}</strong>
                          <span>{product.stock} unidades</span>
                        </div>
                        <div className="admin-row-actions">
                          <button
                            type="button"
                            onClick={() => startProductEdit(product)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="admin-delete-button"
                            onClick={() => onDeleteProduct(product.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </>
                    )}
                  </article>
                ))}
              </div>
              {productError && (
                <p className="seller-error" role="alert">
                  {productError}
                </p>
              )}
            </section>
          )}

          {section === "sales" && (
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <span className="eyebrow">REGISTRO DE OPERACIONES</span>
                  <h2>Historial de ventas</h2>
                </div>
                <span className="library-count">
                  {invoices.length} FACTURAS
                </span>
              </div>
              {invoices.length === 0 ? (
                <p className="admin-empty">
                  No hay facturas todavía. Realiza una compra
                  para llenar este historial.
                </p>
              ) : (
                <div className="admin-sales-list">
                  {[...invoices].reverse().map((invoice) => (
                    <article className="admin-sale-card" key={invoice.number}>
                      <div className="admin-sale-heading">
                        <div>
                          <strong>{invoice.number}</strong>
                          <span>{invoice.date}</span>
                        </div>
                        <b>${invoice.total.toFixed(2)}</b>
                      </div>
                      <p>
                        <strong>Comprador:</strong> {invoice.customerName} ·{" "}
                        {invoice.customerEmail}
                      </p>
                      <div className="admin-sale-items">
                        {invoice.items.map((item) => (
                          <span key={item.game.id}>
                            {item.game.title} × {item.quantity}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
          <p className="admin-disclaimer">
            Gestiona usuarios, catálogo y ventas desde un solo lugar.
          </p>
        </div>
      </main>
    </div>
  );
}

function CartDrawer({
  cart,
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
}: {
  cart: CartItem[];
  onClose: () => void;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
}) {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const total = cart.reduce(
    (sum, item) => sum + item.game.price * item.quantity,
    0,
  );

  return (
    <div className="cart-backdrop" onClick={onClose}>
      <aside
        className="cart-drawer"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="cart-header">
          <div>
            <span className="eyebrow">LEVEL STORE</span>
            <h2>Tu carrito ({totalItems})</h2>
          </div>
          <button
            className="cart-close"
            onClick={onClose}
            type="button"
            aria-label="Cerrar carrito"
          >
            ✕
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <span>🛒</span>
            <h3>Tu carrito está vacío</h3>
            <p>Explora nuestro catálogo y encuentra tu próximo juego.</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.game.id}>
                  <img src={item.game.image} alt={item.game.title} />
                  <div className="cart-item-info">
                    <h3>{item.game.title}</h3>
                    <strong>${item.game.price.toFixed(2)}</strong>
                    <div className="quantity-controls">
                      <button
                        onClick={() => onDecrease(item.game.id)}
                        type="button"
                        aria-label="Disminuir cantidad"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => onIncrease(item.game.id)}
                        type="button"
                        disabled={item.quantity >= item.game.stock}
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-actions">
                    <strong>
                      ${(item.game.price * item.quantity).toFixed(2)}
                    </strong>
                    <button
                      className="remove-item"
                      onClick={() => onRemove(item.game.id)}
                      type="button"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <div className="cart-total">
                <span>Subtotal</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
              <div className="cart-total">
                <span>Total</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
              <button
                className="primary-button checkout-button"
                type="button"
                onClick={onCheckout}
              >
                Continuar compra <Icon name="arrow" size={18} />
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function Checkout({
  cart,
  onBack,
  onConfirm,
  profile,
}: {
  cart: CartItem[];
  onBack: () => void;
  onConfirm: (data: any) => Promise<void>;
  profile: UserProfile | null;
}) {
  const [method, setMethod] = useState<"TARJETA" | "BITCOIN">("TARJETA");
  const [paymentValue, setPaymentValue] = useState("");
  const [billing, setBilling] = useState({ direccion: "" });
  const [card, setCard] = useState({ titular: "", vencimiento: "", cvv: "", referencia_transaccion: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const total = cart.reduce(
    (sum, item) => sum + item.game.price * item.quantity,
    0,
  );

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (cart.length === 0) return;
    setError("");
    setLoading(true);
    try {
      if (method === "TARJETA" && !/^\d{16}$/.test(paymentValue.replace(/\s/g, ""))) throw new Error("Ingresa los 16 dígitos de la tarjeta.");
      if (method === "BITCOIN" && paymentValue.trim().length < 20) throw new Error("Ingresa una dirección Bitcoin válida.");
      if (!billing.direccion.trim()) throw new Error("Ingresa la dirección de facturación.");
      await onConfirm({ method, reference: paymentValue.trim(), facturacion: billing, pago_demo: card });
    } catch (error) {
      setError(
        axios.isAxiosError(error)
          ? (error.response?.data?.error ?? "No se pudo registrar la compra.")
          : error instanceof Error
            ? error.message
            : "No se pudo registrar la compra.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="checkout-page">
      <div className="checkout-container">
        <button className="back-button" onClick={onBack} type="button">
          ← Volver al carrito
        </button>

        <div className="checkout-heading">
          <span className="eyebrow">LEVEL STORE</span>
          <h1>Finalizar compra</h1>
          <p>Tu compra se asociará automáticamente a tu cuenta LEVEL.</p>
        </div>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={submit}>
            <section className="checkout-panel">
              <h2>Datos de facturación</h2>
              <label className="field"><span>Nombre completo</span><input value={profile ? `${profile.nombre} ${profile.apellido}` : "Cargando cuenta..."} readOnly /></label>
              <label className="field"><span>Correo electrónico</span><input value={profile?.correo ?? ""} readOnly /></label>
              <label className="field"><span>Dirección de facturación</span><input value={billing.direccion} onChange={(e) => setBilling({ direccion: e.target.value })} placeholder="Ej. Colonia, calle y número" required /></label>
            </section>
            <section className="checkout-panel">
              <h2>Método de pago</h2>
              <label className="field"><span>Selecciona un método</span><select value={method} onChange={(event) => { setMethod(event.target.value as "TARJETA" | "BITCOIN"); setPaymentValue(""); }}><option value="TARJETA">Tarjeta</option><option value="BITCOIN">Bitcoin</option></select></label>
              <label className="field"><span>{method === "TARJETA" ? "Número de tarjeta" : "Dirección Bitcoin"}</span><input value={paymentValue} onChange={(event) => setPaymentValue(event.target.value)} inputMode={method === "TARJETA" ? "numeric" : "text"} placeholder={method === "TARJETA" ? "1234 5678 9012 3456" : "bc1..."} required /></label>
              {method === "TARJETA" && <><label className="field"><span>Titular</span><input value={card.titular} onChange={(e) => setCard({...card,titular:e.target.value})} required /></label><label className="field"><span>Vencimiento / CVV</span><input value={card.vencimiento} onChange={(e) => setCard({...card,vencimiento:e.target.value})} placeholder="MM/AA" required /><input value={card.cvv} onChange={(e) => setCard({...card,cvv:e.target.value})} placeholder="CVV" required /></label></>}
              {method === "BITCOIN" && <label className="field"><span>Referencia de transacción</span><input value={card.referencia_transaccion} onChange={(e) => setCard({...card,referencia_transaccion:e.target.value})} required /></label>}
              <p className="checkout-disclaimer">Verifica la información antes de confirmar tu compra.</p>
            </section>

            {error && (
              <p className="seller-error" role="alert">
                {error}
              </p>
            )}
            <button
              className="primary-button checkout-confirm-button"
              type="submit"
              disabled={cart.length === 0 || loading}
            >
              {loading ? "Procesando..." : "Confirmar compra"}{" "}
              <Icon name="arrow" size={18} />
            </button>
          </form>

          <aside className="checkout-order">
            <h2>Resumen del pedido</h2>
            {cart.map((item) => (
              <div className="checkout-order-item" key={item.game.id}>
                <img src={item.game.image} alt={item.game.title} />
                <div>
                  <strong>{item.game.title}</strong>
                  <span>Cantidad: {item.quantity}</span>
                </div>
                <b>${(item.game.price * item.quantity).toFixed(2)}</b>
              </div>
            ))}
            <div className="checkout-order-total">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <p className="checkout-disclaimer">
              La factura se generará al confirmar tu compra.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

function InvoicePage({
  invoice,
  onContinue,
}: {
  invoice: Invoice;
  onContinue: () => void;
}) {
  return (
    <main className="invoice-page">
      <section className="invoice-card">
        <div className="invoice-success">
          <span className="invoice-success-icon">✓</span>
          <span className="eyebrow">LEVEL STORE</span>
          <h1>¡Compra completada!</h1>
          <p>Tu compra se ha registrado correctamente.</p>
        </div>

        <div className="invoice-details">
          <div>
            <span>Número de factura</span>
            <strong>{invoice.number}</strong>
          </div>
          <div>
            <span>Fecha</span>
            <strong>{invoice.date}</strong>
          </div>
          <div>
            <span>Comprador</span>
            <strong>{invoice.customerName}</strong>
          </div>
          <div>
            <span>Correo electrónico</span>
            <strong>{invoice.customerEmail}</strong>
          </div>
        </div>

        <div className="invoice-products">
          <h2>Detalle de compra</h2>
          <div className="invoice-table-head">
            <span>Producto</span>
            <span>Cant.</span>
            <span>Precio</span>
            <span>Importe</span>
          </div>
          {invoice.items.map((item) => (
            <div className="invoice-table-row" key={item.game.id}>
              <span>{item.game.title}</span>
              <span>{item.quantity}</span>
              <span>${item.game.price.toFixed(2)}</span>
              <strong>${(item.game.price * item.quantity).toFixed(2)}</strong>
            </div>
          ))}
        </div>

        <div className="invoice-total">
          <span>Total pagado</span>
          <strong>${invoice.total.toFixed(2)}</strong>
        </div>

        <div className="invoice-actions">
          <button className="primary-button" onClick={onContinue} type="button">
            Volver a LEVEL <Icon name="arrow" size={18} />
          </button>
        </div>
        <p className="invoice-footnote">
          Gracias por comprar en LEVEL.
        </p>
      </section>
    </main>
  );
}

function MyInvoicesPage({
  setView,
  search,
  setSearch,
  onOpen,
}: {
  setView: (view: View) => void;
  search: string;
  setSearch: (value: string) => void;
  onOpen: (id: number) => void;
}) {
  const [invoices, setInvoices] = useState<MyInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyInvoices()
      .then(setInvoices)
      .catch(() => setError("No se pudieron cargar tus facturas."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-shell">
      <Navbar setView={setView} search={search} setSearch={setSearch} />
      <main className="invoice-page">
        <section className="invoice-card">
          <span className="eyebrow">HISTORIAL DE COMPRAS</span>
          <h1>Mis facturas</h1>
          <p className="muted">Consulta los comprobantes de las compras realizadas con tu cuenta.</p>
          {loading && <p className="muted">Cargando facturas...</p>}
          {error && <p className="seller-error">{error}</p>}
          {!loading && !error && invoices.length === 0 && <p className="muted">Todavía no tienes facturas. Cuando completes una compra aparecerá aquí.</p>}
          {!loading && invoices.map((invoice) => (
            <div className="invoice-list-row" key={invoice.id_factura}>
              <span><strong>{invoice.numero_factura}</strong><br />{new Date(invoice.fecha_emision).toLocaleString("es-SV")}</span>
              <span>{invoice.cantidad_productos} producto{invoice.cantidad_productos === 1 ? "" : "s"}</span>
              <strong>${Number(invoice.total).toFixed(2)}</strong>
              <button className="secondary-button" type="button" onClick={() => onOpen(invoice.id_factura)}>Ver detalle</button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

function InvoiceDetailPage({
  id,
  setView,
  search,
  setSearch,
}: {
  id: number;
  setView: (view: View) => void;
  search: string;
  setSearch: (value: string) => void;
}) {
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getInvoiceDetail(id).then(setInvoice).catch(() => setError("No se pudo cargar el detalle de la factura."));
  }, [id]);

  return (
    <div className="app-shell">
      <Navbar setView={setView} search={search} setSearch={setSearch} />
      <main className="invoice-page">
        <section className="invoice-card">
          <button className="back-button" type="button" onClick={() => setView("invoices")}>← Volver a mis facturas</button>
          {error && <p className="seller-error">{error}</p>}
          {!invoice && !error && <p className="muted">Cargando factura...</p>}
          {invoice && <>
            <div className="invoice-success">
              <span className="eyebrow">FACTURA LEVEL</span>
              <h1>{invoice.numero_factura}</h1>
              <p>Emitida el {new Date(invoice.fecha_emision).toLocaleString("es-SV")}</p>
            </div>
            <div className="invoice-details">
              <div><span>Comprador</span><strong>{invoice.nombre_facturacion || "No disponible"}</strong></div>
              <div><span>Correo</span><strong>{invoice.correo_facturacion || "No disponible"}</strong></div>
              <div><span>Dirección</span><strong>{invoice.direccion_facturacion || "No disponible"}</strong></div>
              <div><span>Método de pago</span><strong>{invoice.metodo_pago}</strong></div>
            </div>
            <div className="invoice-products">
              <h2>Detalle de compra</h2>
              <div className="invoice-table-head"><span>Producto</span><span>Cant.</span><span>Precio</span><span>Importe</span></div>
              {invoice.productos.map((item, index) => <div className="invoice-table-row" key={`${item.titulo}-${index}`}><span>{item.titulo}</span><span>{item.cantidad}</span><span>${Number(item.precio_unitario).toFixed(2)}</span><strong>${Number(item.subtotal).toFixed(2)}</strong></div>)}
            </div>
            <div className="invoice-total"><span>Total pagado</span><strong>${Number(invoice.total).toFixed(2)}</strong></div>
            <p className="invoice-footnote">Gracias por comprar en LEVEL.</p>
          </>}
        </section>
      </main>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<View>("login");
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [vendorSales, setVendorSales] = useState<Invoice[]>([]);
  const [userRole, setUserRole] = useState(
    sessionStorage.getItem("level_role"),
  );
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [purchasedGames, setPurchasedGames] = useState<Game[]>([]);
  const [catalogGames, setCatalogGames] = useState<Game[]>([]);

  async function loadBackendData() {
    try {
      const currentProfile = await getProfile();
      setProfile(currentProfile);
      sessionStorage.setItem("level_user_name", `${currentProfile.nombre} ${currentProfile.apellido}`);
      sessionStorage.setItem("level_user_initials", `${currentProfile.nombre[0] ?? ""}${currentProfile.apellido[0] ?? ""}`.toUpperCase());
    } catch (error) {
      console.error("No se pudo cargar el perfil:", error);
    }

    try {
      const backendGames = await getGames();
      const mappedGames = backendGames.map(mapBackendGameToUI);
      setCatalogGames(mappedGames);
      if (mappedGames.length > 0) {
        setSelectedGameId((current) => current ?? mappedGames[0].id);
      }
    } catch (error) {
      console.error("No se pudo cargar el catálogo:", error);
    }

    const role = sessionStorage.getItem("level_role") || "";
    if (role === "COMPRADOR" || role === "ADMINISTRADOR") {
      try {
        const myLibrary = await getMyLibrary();
        setPurchasedGames(
          myLibrary.map((item) => ({
            id: item.id_videojuego,
            title: item.titulo,
            genre: item.estudio || "En biblioteca",
            rating: "9.0",
            image: item.imagen || images.hero,
            price: 0,
            stock: 1,
            description: "",
            studio: item.estudio ?? undefined,
          })),
        );
      } catch (error) {
        console.error("No se pudo cargar la biblioteca:", error);
      }
    }
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  useEffect(() => {
    const token = sessionStorage.getItem("level_token");
    if (token) {
      const role = sessionStorage.getItem("level_role");
      setUserRole(role);
      loadBackendData();
      setView("home");
    }
  }, []);

  useEffect(() => {
    if (userRole !== "ADMINISTRADOR") return;

    getUsers()
      .then(setUsers)
      .catch((error) => {
        console.error("No se pudieron cargar los usuarios:", error);
      });
    getAdminSales()
      .then((sales) => {
        setInvoices(
          sales.map((sale) => ({
            number: sale.numero_factura,
            date: new Date(sale.fecha_emision).toLocaleString("es-SV"),
            customerName: `${sale.nombre} ${sale.apellido}`,
            customerEmail: sale.correo,
            total: Number(sale.total),
            items: sale.items.map((item) => ({
              quantity: item.cantidad,
              game: {
                id: item.id_videojuego,
                title: item.titulo,
                price: Number(item.precio_unitario),
                genre: "",
                rating: "",
                image: "",
                stock: 0,
                description: "",
              },
            })),
          })),
        );
      })
      .catch((error) => {
        console.error("No se pudieron cargar las ventas:", error);
      });
  }, [userRole]);

  useEffect(() => {
    if (userRole !== "VENDEDOR") return;
    getVendorSales().then((sales) => setVendorSales(sales.map((sale) => ({
      number: sale.numero_factura,
      date: new Date(sale.fecha_emision).toLocaleString("es-SV"),
      customerName: `${sale.nombre} ${sale.apellido}`,
      customerEmail: sale.correo,
      total: Number(sale.total),
      items: sale.items.map((item) => ({ quantity: item.cantidad, game: { id: item.id_videojuego, title: item.titulo, price: Number(item.precio_unitario), genre: "", rating: "", image: "", stock: 0, description: "" } })),
    })))).catch((error) => console.error("No se pudieron cargar las ventas del vendedor:", error));
  }, [userRole]);

  function handleLogout() {
    logout();
    setUserRole(null);
    setUsers([]);
    setProfile(null);
    setPurchasedGames([]);
    setCart([]);
    setView("login");
  }

  function addToCart(game: Game) {
    if (game.stock === 0) return;

    setCart((previous) => {
      const existing = previous.find((item) => item.game.id === game.id);
      if (existing) {
        if (existing.quantity >= game.stock) return previous;
        return previous.map((item) =>
          item.game.id === game.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...previous, { game, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function increaseQuantity(id: number) {
    setCart((previous) =>
      previous.map((item) =>
        item.game.id === id && item.quantity < item.game.stock
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  }

  function decreaseQuantity(id: number) {
    setCart((previous) =>
      previous
        .map((item) =>
          item.game.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeFromCart(id: number) {
    setCart((previous) => previous.filter((item) => item.game.id !== id));
  }

  async function addProduct(product: Omit<Game, "id">) {
    try {
      await createGame({
        titulo: product.title,
        descripcion: product.description,
        estudio: product.studio || "Estudio independiente",
        tagline: product.tagline || "",
        precio: product.price,
        stock: product.stock,
        imagen: product.image,
        categorias: mapGenreToCategoryIds(product.genre),
        plataformas: product.platforms ?? ["PC"],
      });
      await loadBackendData();
    } catch (error) {
      alert(
        "Error al publicar el videojuego. Verifica que tengas rol VENDEDOR o ADMINISTRADOR.",
      );
      console.error(error);
    }
  }

  async function updateProduct(updatedProduct: Game) {
    try {
      await updateGame(updatedProduct.id, {
        titulo: updatedProduct.title,
        precio: updatedProduct.price,
        stock: updatedProduct.stock,
      });
      await loadBackendData();
    } catch (error) {
      alert("Error al actualizar el videojuego.");
      console.error(error);
    }
  }

  async function deleteProduct(id: number) {
    try {
      await deleteGame(id);
      setCart((previous) => previous.filter((item) => item.game.id !== id));
      await loadBackendData();
    } catch (error) {
      alert("Error al eliminar el videojuego.");
      console.error(error);
    }
  }

  async function changeUserStatus(id: number, estado: AdminUser["estado"]) {
    try {
      await updateUserStatus(id, estado);
      setUsers((previous) => previous.map((user) => user.id_usuario === id ? { ...user, estado } : user));
    } catch (error) { alert("No se pudo actualizar el estado del usuario."); }
  }

  async function completePurchase(data: any) {
    if (cart.length === 0) return;

    const purchaseItems = cart.map((item) => ({
      game: item.game,
      quantity: item.quantity,
    }));
    const total = purchaseItems.reduce(
      (sum, item) => sum + item.game.price * item.quantity,
      0,
    );

    const purchase = await checkout(
      cart.map((item) => ({
        id_videojuego: item.game.id,
        cantidad: item.quantity,
      })), data.method, data.reference, data.facturacion, data.pago_demo,
    );

    const purchaseId =
      (purchase as { id_compra?: number }).id_compra ??
      (purchase.factura as { id_compra?: number } | undefined)?.id_compra;
    if (purchaseId) {
      await claimGames(purchaseId).catch(() => {});
    }

    const newInvoice: Invoice = {
      number: purchase.factura.numero_factura,
      date: new Date(purchase.factura.fecha_emision).toLocaleString("es-SV"),
      customerName: profile ? `${profile.nombre} ${profile.apellido}` : "Comprador LEVEL",
      customerEmail: profile?.correo ?? "",
      items: purchaseItems,
      total: Number(purchase.factura.total ?? total),
    };
    setInvoice(newInvoice);
    setInvoices((previous) => [...previous, newInvoice]);

    setPurchasedGames((previous) => {
      const existingIds = new Set(previous.map((game) => game.id));
      const newlyPurchased = purchaseItems
        .map((item) => item.game)
        .filter((game) => !existingIds.has(game.id));

      return [...previous, ...newlyPurchased];
    });

    setCart([]);
    setCartOpen(false);
    await loadBackendData();
    setView("invoice");
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  let page: ReactNode;
  if (view === "login" || view === "register") {
    page = (
      <AuthLayout
        mode={view}
        setView={setView}
        onAuthenticated={async () => {
          const role = sessionStorage.getItem("level_role");
          setUserRole(role);
          await loadBackendData();
          setView("home");
        }}
      />
    );
  } else if (view === "details") {
    page = (
      <Details
        setView={setView}
        selectedGameId={selectedGameId}
        search={search}
        setSearch={setSearch}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        onAddToCart={addToCart}
        catalogGames={catalogGames}
      />
    );
  } else if (view === "profile") {
    page = (
      <Profile
        setView={setView}
        setSelectedGameId={setSelectedGameId}
        search={search}
        setSearch={setSearch}
        purchasedGames={purchasedGames}
        profile={profile}
        onLogout={handleLogout}
      />
    );
  } else if (view === "invoices" && userRole === "COMPRADOR") {
    page = <MyInvoicesPage setView={setView} search={search} setSearch={setSearch} onOpen={(id) => { setSelectedInvoiceId(id); setView("invoiceDetail"); }} />;
  } else if (view === "invoiceDetail" && selectedInvoiceId && userRole === "COMPRADOR") {
    page = <InvoiceDetailPage id={selectedInvoiceId} setView={setView} search={search} setSearch={setSearch} />;
  } else if (view === "admin" && userRole === "ADMINISTRADOR") {
    page = (
      <AdminDashboard
        products={catalogGames}
        invoices={invoices}
        users={users}
        onStatusChange={changeUserStatus}
        onUpdateProduct={updateProduct}
        onDeleteProduct={deleteProduct}
        onBack={() => setView("home")}
      />
    );
  } else if (view === "seller" && userRole === "VENDEDOR") {
    page = (
      <SellerDashboard
        products={catalogGames.filter((product) => product.ownerId === profile?.id_usuario)}
        onAdd={addProduct}
        onUpdate={updateProduct}
        onDelete={deleteProduct}
        onBack={() => setView("home")}
        sales={vendorSales}
      />
    );
  } else if (view === "checkout") {
    page = (
      <Checkout
        cart={cart}
        onBack={() => setView("home")}
        onConfirm={completePurchase}
        profile={profile}
      />
    );
  } else if (view === "invoice" && invoice) {
    page = <InvoicePage invoice={invoice} onContinue={() => setView("home")} />;
  } else {
    page = (
      <Home
        setView={setView}
        setSelectedGameId={setSelectedGameId}
        search={search}
        setSearch={setSearch}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        onAddToCart={addToCart}
        catalogGames={catalogGames}
      />
    );
  }

  return (
    <>
      {page}
      {cartOpen && (
        <CartDrawer
          cart={cart}
          onClose={() => setCartOpen(false)}
          onIncrease={increaseQuantity}
          onDecrease={decreaseQuantity}
          onRemove={removeFromCart}
          onCheckout={() => {
            setCartOpen(false);
            setView("checkout");
          }}
        />
      )}
    </>
  );
}
