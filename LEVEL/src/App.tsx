import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from "react";
import "./LEVEL-panel-administrador.css";
import "./LEVEL-responsive-ajustes.css";
import "./LEVEL-portadas-detalles-fix.css";
import "./LEVEL-portadas-detalles-visual.css";
import "./LEVEL-menu-movil.css";
import "./LEVEL-detail-polish.css";
import "./LEVEL-detail-overlay.css";
import "./LEVEL-seller-image-preview.css";

type View = "login" | "register" | "home" | "details" | "profile" | "checkout" | "invoice" | "seller" | "admin";

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

const images = {
  hero: "https://images.unsplash.com/photo-1705510144116-cc4d88838b14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxjeWJlcnB1bmslMjBmdXR1cmlzdGljJTIwdmlkZW8lMjBnYW1lJTIwbmVvbiUyMGRhcmslMjBjaXR5JTIwbGFuZHNjYXBlfGVufDF8fHx8MTc5Mzk4NDUyOHww&ixlib=rb-4.1.0&q=80&w=1080",
  city: "https://images.unsplash.com/photo-1672872476232-da16b45c9001?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjeWJlcnB1bmslMjBmdXR1cmlzdGljJTIwdmlkZW8lMjBuZW9uJTIwZGFyayUyMGNpdHklMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzkzOTg0NTI4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  towers: "https://images.unsplash.com/photo-1535391879778-3bae11d29a24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjeWJlcnB1bmslMjBmdXR1cmlzdGljJTIwdmlkZW8lMjBnYW1lJTIwbmVvbiUyMGRhcmslMjBjaXR5JTIwbGFuZHNjYXBlfGVufDF8fHx8MTc5Mzk4NDUyOHww&ixlib=rb-4.1.0&q=80&w=1080",
  bench: "https://images.unsplash.com/photo-1668211834355-2cdf073f2351?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxjeWJlcnB1bmslMjBmdXR1cmlzdGljJTIwdmlkZW8lMjBnYW1lJTIwbmVvbiUyMGRhcmslMjBjaXR5JTIwbGFuZHNjYXBlfGVufDF8fHx8MTc5Mzk4NDUyOHww&ixlib=rb-4.1.0&q=80&w=1080",
  car: "https://images.unsplash.com/photo-1600998837340-4887228e311f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxjeWJlcnB1bmslMjBmdXR1cmlzdGljJTIwdmlkZW8lMjBnYW1lJTIwbmVvbiUyMGRhcmslMjBjaXR5JTIwbGFuZHNjYXBlfGVufDF8fHx8MTc5Mzk4NDUyOHww&ixlib=rb-4.1.0&q=80&w=1080",
  rider: "https://images.unsplash.com/photo-1642345843526-6279c8880a49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxjeWJlcnB1bmslMjBmdXR1cmlzdGljJTIwdmlkZW8lMjBnYW1lJTIwbmVvbiUyMGRhcmslMjBjaXR5JTIwbGFuZHNjYXBlfGVufDF8fHx8MTc5Mzk4NDUyOHww&ixlib=rb-4.1.0&q=80&w=1080",
  street: "https://images.unsplash.com/photo-1613535167523-0da946b83ffb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxjeWJlcnB1bmslMjBmdXR1cmlzdGljJTIwdmlkZW8lMjBnYW1lJTIwbmVvbiUyMGRhcmslMjBjaXR5JTIwbGFuZHNjYXBlfGVufDF8fHx8MTc5Mzk4NDUyOHww&ixlib=rb-4.1.0&q=80&w=1080",
  skyline: "https://images.unsplash.com/photo-1584905399334-110483dd2627?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw5fHxjeWJlcnB1bmslMjBmdXR1cmlzdGljJTIwdmlkZW8lMjBnYW1lJTIwbmVvbiUyMGRhcmslMjBjaXR5JTIwbGFuZHNjYXBlfGVufDF8fHx8MTc5Mzk4NDUyOHww&ixlib=rb-4.1.0&q=80&w=1080",
};

const games: Game[] = [
  { id: 1, title: "Neon Eclipse", genre: "RPG • Mundo abierto", rating: "9.4", image: images.hero, price: 39.99, stock: 15, description: "Explora Nova Prime y descubre los secretos detrás del Eclipse." },
  { id: 2, title: "Night Protocol", genre: "Acción • Aventura", rating: "8.8", image: images.city, price: 29.99, stock: 20, description: "Una aventura futurista llena de misterios y desafíos." },
  { id: 3, title: "Solaris Drift", genre: "Carreras • Arcade", rating: "8.6", image: images.car, price: 24.99, stock: 12, description: "Compite en circuitos futuristas a toda velocidad." },
  { id: 4, title: "Ghost Circuit", genre: "Acción • Sigilo", rating: "9.1", image: images.rider, price: 34.99, stock: 8, description: "Infiltra instalaciones y descubre una conspiración." },
  { id: 5, title: "Parallel", genre: "Narrativa • Indie", rating: "8.4", image: images.bench, price: 19.99, stock: 25, description: "Una experiencia narrativa donde tus decisiones importan." },
  { id: 6, title: "Sector Nine", genre: "Estrategia • Sci-fi", rating: "8.9", image: images.towers, price: 27.99, stock: 10, description: "Construye tu estrategia y domina el Sector Nine." },
  { id: 7, title: "Afterlight", genre: "Supervivencia", rating: "8.7", image: images.street, price: 22.99, stock: 0, description: "Sobrevive en un mundo donde cada recurso cuenta." },
  { id: 8, title: "Zero District", genre: "Shooter • Online", rating: "9.0", image: images.skyline, price: 32.99, stock: 18, description: "Enfréntate a otros jugadores en combates futuristas." },
];

function Icon({ name, size = 20, className = "" }: {
  name: "search" | "star" | "arrow" | "plus" | "gamepad" | "grid" | "logout" | "cart" | "image-plus" | "eye";
  size?: number;
  className?: string;
}) {
  const paths: Record<string, ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" />,
    arrow: <><path d="M5 12h14" /><path d="m14 7 5 5-5 5" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    gamepad: <><path d="M8 8h8a5 5 0 0 1 4.8 6.4l-.7 2.4a2 2 0 0 1-3.2 1l-2.2-1.8H9.3l-2.2 1.8a2 2 0 0 1-3.2-1l-.7-2.4A5 5 0 0 1 8 8Z" /><path d="M7 12h4M9 10v4M16.5 11.5h.01M18 14h.01" /></>,
    grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    logout: <><path d="M10 5H5v14h5" /><path d="M13 8l4 4-4 4M8 12h9" /></>,
    cart: <><circle cx="9" cy="20" r="1" /><circle cx="19" cy="20" r="1" /><path d="M2 3h2l2.4 12.2a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6L22 7H5" /></>,
    "image-plus": <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m21 15-5-5L5 20M16 4v6M13 7h6" /></>,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
  };

  return (
    <svg aria-hidden="true" className={className} fill="none" height={size} viewBox="0 0 24 24" width={size} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
      {paths[name]}
    </svg>
  );
}

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button className="logo" onClick={onClick} type="button" aria-label="Ir al inicio">
      <span className="logo-mark"><Icon name="gamepad" size={21} /></span>
      <span>LEVEL</span>
    </button>
  );
}

function Navbar({
  setView, search, setSearch, cartCount, onOpenCart,
}: {
  setView: (view: View) => void;
  search: string;
  setSearch: (value: string) => void;
  cartCount?: number;
  onOpenCart?: () => void;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function navigate(view: View) {
    setView(view);
    setMobileMenuOpen(false);
  }

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Logo onClick={() => navigate("home")} />
        <nav className="nav-links" aria-label="Navegación principal">
          <button onClick={() => navigate("home")} type="button">Explorar</button>
          <button onClick={() => navigate("profile")} type="button">Mi biblioteca</button>
          <button onClick={() => navigate("seller")} type="button">Vendedor</button>
          <button onClick={() => navigate("admin")} type="button">Admin</button>
        </nav>
        <label className="search-box">
          <Icon name="search" size={18} />
          <input aria-label="Buscar juegos" onChange={(event) => setSearch(event.target.value)} placeholder="Buscar juegos..." value={search} />
          <span className="key">⌘ K</span>
        </label>
        <button className="cart-button" onClick={onOpenCart} type="button" aria-label="Abrir carrito">
          <Icon name="cart" size={19} />
          {(cartCount ?? 0) > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
        <button className="avatar-button" onClick={() => navigate("profile")} type="button" aria-label="Abrir perfil">
          <span>LM</span><i aria-hidden="true" />
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
        <nav className="mobile-navigation" id="mobile-navigation" aria-label="Navegación móvil">
          <button onClick={() => navigate("home")} type="button">Explorar</button>
          <button onClick={() => navigate("profile")} type="button">Mi biblioteca</button>
          <button onClick={() => navigate("seller")} type="button">Vendedor</button>
          <button onClick={() => navigate("admin")} type="button">Administrador</button>
        </nav>
      )}
    </header>
  );
}

function AuthLayout({ mode, setView }: { mode: "login" | "register"; setView: (view: View) => void }) {
  const isLogin = mode === "login";
  function submit(event: FormEvent) {
    event.preventDefault();
    setView("home");
  }

  return (
    <main className="auth-page">
      <div className="auth-brand"><Logo onClick={() => setView("login")} /></div>
      <section className="auth-card">
        <div className="auth-heading">
          <span className="eyebrow">{isLogin ? "TU BIBLIOTECA TE ESPERA" : "ÚNETE A LA COMUNIDAD"}</span>
          <h1>{isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}</h1>
          <p>{isLogin ? "Accede para seguir descubriendo nuevos mundos." : "Guarda, organiza y descubre tu próxima aventura."}</p>
        </div>
        <form onSubmit={submit}>
          {!isLogin && <Field label="Nombre de usuario" placeholder="Tu nombre de usuario" type="text" />}
          <Field label="Correo electrónico" placeholder="tu@correo.com" type="email" />
          <Field label="Contraseña" placeholder="••••••••" type="password" />
          {!isLogin && <Field label="Confirmar contraseña" placeholder="••••••••" type="password" />}
          {isLogin && (
            <div className="form-row">
              <label className="remember"><input type="checkbox" /><span>Recordarme</span></label>
              <button className="text-link" type="button">¿Olvidaste tu contraseña?</button>
            </div>
          )}
          <button className="primary-button auth-submit" type="submit">
            {isLogin ? "Iniciar sesión" : "Registrarse"} <Icon name="arrow" size={18} />
          </button>
        </form>
        <div className="auth-switch">
          <span>{isLogin ? "¿No tienes cuenta?" : "¿Ya tienes una cuenta?"}</span>
          <button onClick={() => setView(isLogin ? "register" : "login")} type="button">{isLogin ? "Regístrate" : "Inicia sesión"}</button>
        </div>
      </section>
      <p className="auth-footer">Tu universo de juegos, en un solo lugar.</p>
    </main>
  );
}

function Field({ label, placeholder, type }: { label: string; placeholder: string; type: string }) {
  return <label className="field"><span>{label}</span><input placeholder={placeholder} type={type} required /></label>;
}

function GameCard({ game, onClick, onAddToCart }: {
  game: Game;
  onClick: () => void;
  onAddToCart: () => void;
}) {
  return (
    <article className="game-card">
      <button className="game-card-open" onClick={onClick} type="button" aria-label={`Ver detalles de ${game.title}`}>
        <div className="game-cover">
          <img src={game.image} alt={`Portada de ${game.title}`} />
          <span className="rating"><Icon name="star" size={13} /> {game.rating}</span>
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
      <button className="add-cart-button" type="button" disabled={game.stock === 0} onClick={onAddToCart}>
        {game.stock === 0 ? "Agotado" : "+ Añadir al carrito"}
      </button>
    </article>
  );
}

function Home({ setView, setSelectedGameId, search, setSearch, cartCount, onOpenCart, onAddToCart, catalogGames }: {
  setView: (view: View) => void;
  setSelectedGameId: (id: number) => void;
  search: string;
  setSearch: (value: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onAddToCart: (game: Game) => void;
  catalogGames: Game[];
}) {
  const visibleGames = catalogGames.filter((game) => game.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="app-shell">
      <Navbar setView={setView} search={search} setSearch={setSearch} cartCount={cartCount} onOpenCart={onOpenCart} />
      <main className="page-container">
        <section className="hero">
          <img src={images.hero} alt="" />
          <div className="hero-overlay" />
          <div className="hero-content">
            <span className="feature-label"><i /> DESTACADO DE LA SEMANA</span>
            <h1>NEON ECLIPSE</h1>
            <p>La ciudad nunca duerme. Tú tampoco deberías.</p>
            <button className="primary-button" onClick={() => { const featured = catalogGames.find((item) => item.title.toLowerCase() === "neon eclipse") ?? catalogGames[0]; if (featured) setSelectedGameId(featured.id); setView("details"); }} type="button">Ver más <Icon name="arrow" size={18} /></button>
          </div>
          <div className="hero-meta"><span>RPG</span><span>Mundo abierto</span><span>2025</span></div>
        </section>

        <section className="catalog-section">
          <div className="section-heading">
            <div><span className="eyebrow">EXPLORA EL CATÁLOGO</span><h2>Juegos populares</h2></div>
            <button className="see-all" type="button">Ver todos <Icon name="arrow" size={17} /></button>
          </div>
          {visibleGames.length ? (
            <div className="game-grid">
              {visibleGames.map((game) => (
                <GameCard game={game} key={game.id} onClick={() => { setSelectedGameId(game.id); setView("details"); }} onAddToCart={() => onAddToCart(game)} />
              ))}
            </div>
          ) : (
            <div className="empty-state"><Icon name="search" size={28} /><h3>No encontramos ese juego</h3><p>Prueba con otro nombre para seguir explorando.</p></div>
          )}
        </section>
      </main>
    </div>
  );
}

function Details({ setView, selectedGameId, search, setSearch, cartCount, onOpenCart, onAddToCart, catalogGames }: {
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
  const game = catalogGames.find((item) => item.id === selectedGameId) ?? catalogGames[0] ?? games[0];

  return (
    <div className="app-shell">
      <Navbar setView={setView} search={search} setSearch={setSearch} cartCount={cartCount} onOpenCart={onOpenCart} />
      <main className="detail-page-main">
        <section className="detail-banner">
          <img className="detail-banner-backdrop" src={game.image} alt="" aria-hidden="true" />
          <img className="detail-banner-image" src={game.image} alt={`Imagen principal de ${game.title}`} />
          <button className="back-button detail-back-button" onClick={() => setView("home")} type="button">
            <span aria-hidden="true">←</span> Volver al catálogo
          </button>
          <div className="detail-banner-gradient" />
        </section>
        <section className="detail-container">
          <div className="detail-layout">
            <div className="detail-cover">
              <img src={game.image} alt={`Portada de ${game.title}`} />
              <div className="cover-score"><strong>{game.rating}</strong><span>EXCELENTE</span></div>
            </div>
            <article className="detail-copy">
              <span className="eyebrow">{game.studio?.trim() || "ESTUDIO INDEPENDIENTE"}{game.studio?.trim() ? "" : " • 2026"}</span>
              <h1>{game.title.toUpperCase()}</h1>
              <p className="detail-tagline">{game.tagline?.trim() || "Una nueva aventura te espera."}</p>
              <p className="synopsis">{game.description} Sumérgete en Nova Prime, una metrópolis donde cada decisión altera el equilibrio entre humanos y máquinas.</p>
              <div className="detail-block"><span>PLATAFORMAS</span><div className="tags"><b>PC</b><b>PS5</b><b>XBOX SERIES</b></div></div>
              <div className="detail-block"><span>GÉNEROS</span><p>{game.genre}</p></div>
              <div className="detail-block"><span>PRECIO</span><p className="detail-price">${game.price.toFixed(2)}</p></div>
              <div className="detail-block"><span>DISPONIBILIDAD</span><p>{game.stock > 0 ? `${game.stock} unidades disponibles` : "Agotado"}</p></div>
              <button className={`primary-button library-button ${saved ? "is-saved" : ""}`} onClick={() => { onAddToCart(game); setSaved(true); }} type="button" disabled={game.stock === 0}>
                <Icon name={saved ? "grid" : "plus"} size={20} />{saved ? "Añadido al carrito" : "Añadir al carrito"}
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
}: {
  setView: (view: View) => void;
  setSelectedGameId: (id: number) => void;
  search: string;
  setSearch: (value: string) => void;
  purchasedGames: Game[];
}) {
  return (
    <div className="app-shell">
      <Navbar setView={setView} search={search} setSearch={setSearch} />
      <main className="page-container profile-page">
        <section className="profile-header">
          <div className="profile-avatar">LM</div>
          <div className="profile-identity">
            <span className="eyebrow">JUGADOR LEVEL</span>
            <h1>Lucas Mendez</h1>
            <p>@lucasplays</p>
          </div>
          <div className="profile-stats">
            <div>
              <strong>{purchasedGames.length}</strong>
              <span>Juegos en biblioteca</span>
            </div>
            <div>
              <strong>482</strong>
              <span>Horas jugadas</span>
            </div>
            <div>
              <strong>
                {purchasedGames.length > 0
                  ? (
                      purchasedGames.reduce(
                        (sum, game) => sum + Number(game.rating),
                        0
                      ) / purchasedGames.length
                    ).toFixed(1)
                  : "—"}
              </strong>
              <span>Nota promedio</span>
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
              {purchasedGames.length} {purchasedGames.length === 1 ? "JUEGO" : "JUEGOS"}
            </span>
          </div>

          {purchasedGames.length > 0 ? (
            <div className="library-grid">
              {purchasedGames.map((game) => (
                <button
                  className="library-item"
                  key={game.id}
                  onClick={() => { setSelectedGameId(game.id); setView("details"); }}
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

        <button
          className="logout-button"
          onClick={() => setView("login")}
          type="button"
        >
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
}: {
  products: Game[];
  onAdd: (product: Omit<Game, "id">) => void;
  onUpdate: (product: Game) => void;
  onDelete: (id: number) => void;
  onBack: () => void;
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
  };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);

  const previewGame: Game = {
    id: editingId ?? -1,
    title: form.title.trim() || "Nombre del videojuego",
    studio: form.studio.trim() || "Nombre del estudio",
    tagline: form.tagline.trim() || "Frase promocional del videojuego",
    genre: form.genre.trim() || "Género del videojuego",
    price: Number(form.price) > 0 ? Number(form.price) : 0,
    stock: Number.isInteger(Number(form.stock)) && Number(form.stock) >= 0 ? Number(form.stock) : 0,
    description: form.description.trim() || "Aquí aparecerá la descripción del videojuego.",
    rating: "9.0",
    image: form.image,
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
        setForm((previous) => ({ ...previous, image: reader.result as string }));
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
    setFileInputKey((key) => key + 1);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!form.title.trim() || !form.studio.trim() || !form.tagline.trim() || !form.genre.trim() || !form.description.trim()) {
      setError("Completa todos los campos, incluido el estudio y la frase promocional.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0) {
      setError("Ingresa un precio válido y un stock entero igual o mayor que cero.");
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
            <div><span>Productos publicados</span><strong>{products.length}</strong></div>
            <div><span>Unidades disponibles</span><strong>{products.reduce((sum, product) => sum + product.stock, 0)}</strong></div>
            <div><span>Productos agotados</span><strong>{products.filter((product) => product.stock === 0).length}</strong></div>
          </div>

          <section className="seller-panel seller-create-panel">
            <div className="seller-section-heading">
              <div>
                <span className="eyebrow">{editingId !== null ? "ACTUALIZAR PRODUCTO" : "NUEVO PRODUCTO"}</span>
                <h2>{editingId !== null ? "Editar videojuego" : "Publicar videojuego"}</h2>
              </div>
            </div>

            <div className="seller-create-layout">
              <form className="seller-form seller-form-editor" onSubmit={submit}>
                <label className="field">
                  <span>Nombre del videojuego</span>
                  <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Ej. Cyber Runner" required />
                </label>
                <label className="field">
                  <span>Estudio o desarrollador</span>
                  <input value={form.studio} onChange={(event) => setForm({ ...form, studio: event.target.value })} placeholder="Ej. Nightwave Studios" required />
                </label>
                <label className="field">
                  <span>Frase promocional</span>
                  <input value={form.tagline} onChange={(event) => setForm({ ...form, tagline: event.target.value })} placeholder="Ej. Una aventura más allá del tiempo" required />
                </label>
                <label className="field">
                  <span>Género</span>
                  <input value={form.genre} onChange={(event) => setForm({ ...form, genre: event.target.value })} placeholder="Ej. Acción • Aventura" required />
                </label>
                <label className="field">
                  <span>Precio (USD)</span>
                  <input type="number" min="0.01" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="29.99" required />
                </label>
                <label className="field">
                  <span>Stock disponible</span>
                  <input type="number" min="0" step="1" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} placeholder="10" required />
                </label>
                <label className="field seller-description-field">
                  <span>Descripción</span>
                  <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Describe el videojuego..." rows={3} required />
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
                  <p id="seller-image-help" className="seller-image-help">Formatos de imagen · Máximo 5 MB</p>
                  {imageError && <p className="seller-error" role="alert">{imageError}</p>}
                  {form.image && (
                    <div className="seller-selected-image">
                      <img src={form.image} alt="Vista previa de la imagen seleccionada" />
                      <span>Imagen lista para la publicación</span>
                      <button type="button" onClick={() => { setForm({ ...form, image: "" }); setFileInputKey((key) => key + 1); }}>Quitar imagen</button>
                    </div>
                  )}
                </div>

                {error && <p className="seller-error" role="alert">{error}</p>}

                <div className="seller-form-actions">
                  <button className="primary-button" type="submit">
                    {editingId !== null ? "Guardar cambios" : "Publicar producto"}
                  </button>
                  <button
                    className="seller-preview-button"
                    type="button"
                    disabled={!form.image}
                    onClick={() => setPreviewOpen(true)}
                  >
                    <Icon name="eye" size={17} /> Ver videojuego completo
                  </button>
                  {editingId !== null && <button className="seller-cancel-button" onClick={cancelEdit} type="button">Cancelar</button>}
                </div>
              </form>

              <aside className="seller-live-preview">
                <div className="seller-preview-heading">
                  <span className="eyebrow">VISTA PREVIA EN VIVO</span>
                  <span className="seller-preview-dot">● ACTUALIZADA</span>
                </div>
                <p className="seller-preview-caption">Así se verá la tarjeta en el catálogo.</p>
                <article className="game-card seller-preview-card">
                  <div className="game-card-open seller-preview-card-open">
                    <div className="game-cover">
                      {form.image ? (
                        <img src={form.image} alt="Portada del videojuego en vista previa" />
                      ) : (
                        <div className="seller-preview-placeholder">
                          <Icon name="image-plus" size={30} />
                          <span>Sube una imagen</span>
                        </div>
                      )}
                      <span className="rating"><Icon name="star" size={13} /> {previewGame.rating}</span>
                    </div>
                    <div className="game-info">
                      <h3>{previewGame.title}</h3>
                      <p>{previewGame.genre}</p>
                      <div className="game-price-row">
                        <strong>${previewGame.price.toFixed(2)}</strong>
                        <span className={previewGame.stock > 0 ? "in-stock" : "out-of-stock"}>
                          {previewGame.stock > 0 ? `${previewGame.stock} disponibles` : "Agotado"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="seller-preview-cart-label">+ Añadir al carrito</div>
                </article>
                <p className="seller-preview-footnote">La tarjeta se actualiza mientras completas el formulario.</p>
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
              <div className="seller-empty">Todavía no has publicado videojuegos.</div>
            ) : (
              <div className="seller-product-list">
                {products.map((product) => (
                  <article className="seller-product" key={product.id}>
                    <img src={product.image} alt={product.title} />
                    <div className="seller-product-info">
                      <strong>{product.title}</strong>
                      <span>{product.genre}</span>
                      <span className={product.stock > 0 ? "in-stock" : "out-of-stock"}>
                        {product.stock > 0 ? `${product.stock} unidades disponibles` : "Agotado"}
                      </span>
                    </div>
                    <strong className="seller-product-price">${product.price.toFixed(2)}</strong>
                    <div className="seller-product-actions">
                      {product.isSellerProduct ? (
                        <>
                          <button type="button" onClick={() => startEdit(product)}>Editar</button>
                          <button type="button" className="seller-delete" onClick={() => onDelete(product.id)}>Eliminar</button>
                        </>
                      ) : (
                        <span className="seller-protected-label">Producto del catálogo LEVEL</span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {previewOpen && (
        <div className="seller-preview-modal-backdrop" role="presentation" onClick={() => setPreviewOpen(false)}>
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
                <h2 id="seller-preview-title">Así verá el juego un comprador</h2>
              </div>
              <button type="button" className="seller-preview-close" onClick={() => setPreviewOpen(false)} aria-label="Cerrar vista previa">×</button>
            </div>
            <div className="seller-full-preview">
              <div className="seller-full-preview-banner">
                <img src={form.image} alt="" />
              </div>
              <div className="seller-full-preview-content">
                <div className="seller-full-preview-cover">
                  <img src={form.image} alt={`Portada de ${previewGame.title}`} />
                  <div className="cover-score"><strong>9.0</strong><span>VISTA PREVIA</span></div>
                </div>
                <div className="seller-full-preview-info">
                  <span className="eyebrow">{previewGame.studio}</span>
                  <h1>{previewGame.title}</h1>
                  <p className="detail-tagline">{previewGame.tagline}</p>
                  <p className="synopsis">{previewGame.description}</p>
                  <div className="detail-block"><span>GÉNEROS</span><p>{previewGame.genre}</p></div>
                  <div className="detail-block"><span>PRECIO</span><p className="detail-price">${previewGame.price.toFixed(2)}</p></div>
                  <div className="detail-block"><span>DISPONIBILIDAD</span><p>{previewGame.stock > 0 ? `${previewGame.stock} unidades disponibles` : "Agotado"}</p></div>
                </div>
              </div>
            </div>
            <div className="seller-preview-modal-footer">
              <span>Esta es una simulación; el producto aún no se ha publicado.</span>
              <button className="primary-button" type="button" onClick={() => setPreviewOpen(false)}>Volver al formulario</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

type DemoUser = {
  id: number;
  name: string;
  email: string;
  role: "Comprador" | "Vendedor" | "Administrador";
  active: boolean;
};

function AdminDashboard({
  products,
  invoices,
  users,
  onChangeRole,
  onToggleUser,
  onUpdateProduct,
  onDeleteProduct,
  onBack,
}: {
  products: Game[];
  invoices: Invoice[];
  users: DemoUser[];
  onChangeRole: (id: number, role: DemoUser["role"]) => void;
  onToggleUser: (id: number) => void;
  onUpdateProduct: (product: Game) => void;
  onDeleteProduct: (id: number) => void;
  onBack: () => void;
}) {
  const [section, setSection] = useState<"overview" | "users" | "products" | "sales">("overview");
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [productError, setProductError] = useState("");

  const revenue = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const unitsSold = invoices.reduce(
    (sum, invoice) => sum + invoice.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
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
    if (!Number.isFinite(nextPrice) || nextPrice <= 0 || !Number.isInteger(nextStock) || nextStock < 0) {
      setProductError("El precio debe ser mayor que cero y el stock un entero igual o mayor que cero.");
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
          <button className="seller-back-button" onClick={onBack} type="button">← Volver al catálogo</button>
          <div className="admin-heading">
            <div>
              <span className="eyebrow">LEVEL CONTROL CENTER</span>
              <h1>Panel de administración</h1>
              <p>Supervisa usuarios, catálogo y ventas de la tienda.</p>
            </div>
            <span className="admin-role-label">ADMINISTRADOR</span>
          </div>

          <nav className="admin-tabs" aria-label="Secciones de administración">
            <button className={section === "overview" ? "active" : ""} onClick={() => setSection("overview")} type="button">Resumen</button>
            <button className={section === "users" ? "active" : ""} onClick={() => setSection("users")} type="button">Usuarios</button>
            <button className={section === "products" ? "active" : ""} onClick={() => setSection("products")} type="button">Videojuegos</button>
            <button className={section === "sales" ? "active" : ""} onClick={() => setSection("sales")} type="button">Ventas</button>
          </nav>

          {section === "overview" && (
            <>
              <div className="admin-stat-grid">
                <article><span>Usuarios registrados</span><strong>{users.length}</strong><small>{users.filter((user) => user.active).length} activos</small></article>
                <article><span>Videojuegos en catálogo</span><strong>{products.length}</strong><small>{products.reduce((sum, product) => sum + product.stock, 0)} unidades disponibles</small></article>
                <article><span>Ventas registradas</span><strong>{invoices.length}</strong><small>{unitsSold} unidades vendidas</small></article>
                <article><span>Ingresos simulados</span><strong>${revenue.toFixed(2)}</strong><small>Acumulado de las facturas</small></article>
              </div>
              <section className="admin-panel">
                <span className="eyebrow">ACTIVIDAD RECIENTE</span>
                <h2>Últimas ventas</h2>
                {invoices.length === 0 ? (
                  <p className="admin-empty">Todavía no hay ventas registradas. Las compras de demostración aparecerán aquí.</p>
                ) : (
                  <div className="admin-list">
                    {[...invoices].reverse().slice(0, 5).map((invoice) => (
                      <div className="admin-list-row" key={invoice.number}>
                        <div><strong>{invoice.customerName}</strong><span>{invoice.number} · {invoice.date}</span></div>
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
              <div className="admin-panel-heading"><div><span className="eyebrow">GESTIÓN DE CUENTAS</span><h2>Usuarios</h2></div><span className="library-count">{users.length} CUENTAS</span></div>
              <p className="admin-note">Datos de ejemplo para demostrar la gestión de roles. No son cuentas autenticadas.</p>
              <div className="admin-user-list">
                {users.map((user) => (
                  <article className="admin-user-row" key={user.id}>
                    <div className="admin-user-avatar">{user.name.slice(0, 1).toUpperCase()}</div>
                    <div className="admin-user-info"><strong>{user.name}</strong><span>{user.email}</span><small className={user.active ? "admin-active" : "admin-inactive"}>{user.active ? "Activo" : "Deshabilitado"}</small></div>
                    <label className="admin-role-select"><span>Rol</span><select value={user.role} onChange={(event) => onChangeRole(user.id, event.target.value as DemoUser["role"])}><option>Comprador</option><option>Vendedor</option><option>Administrador</option></select></label>
                    <button className="admin-toggle-button" onClick={() => onToggleUser(user.id)} type="button">{user.active ? "Deshabilitar" : "Habilitar"}</button>
                  </article>
                ))}
              </div>
            </section>
          )}

          {section === "products" && (
            <section className="admin-panel">
              <div className="admin-panel-heading"><div><span className="eyebrow">CONTROL DEL INVENTARIO</span><h2>Todos los videojuegos</h2></div><span className="library-count">{products.length} PRODUCTOS</span></div>
              <div className="admin-product-list">
                {products.map((product) => (
                  <article className="admin-product-row" key={product.id}>
                    <img src={product.image} alt={product.title} />
                    <div className="admin-product-main"><strong>{product.title}</strong><span>{product.genre}</span><small>{product.isSellerProduct ? "Publicado por vendedor" : "Catálogo LEVEL"}</small></div>
                    {editingProduct === product.id ? (
                      <div className="admin-product-edit">
                        <label>Precio $<input type="number" min="0.01" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} /></label>
                        <label>Stock<input type="number" min="0" step="1" value={stock} onChange={(event) => setStock(event.target.value)} /></label>
                        <button type="button" onClick={() => saveProduct(product)}>Guardar</button>
                        <button type="button" className="admin-muted-button" onClick={() => { setEditingProduct(null); setProductError(""); }}>Cancelar</button>
                      </div>
                    ) : (
                      <>
                        <div className="admin-product-values"><strong>${product.price.toFixed(2)}</strong><span>{product.stock} unidades</span></div>
                        <div className="admin-row-actions"><button type="button" onClick={() => startProductEdit(product)}>Editar</button><button type="button" className="admin-delete-button" onClick={() => onDeleteProduct(product.id)}>Eliminar</button></div>
                      </>
                    )}
                  </article>
                ))}
              </div>
              {productError && <p className="seller-error" role="alert">{productError}</p>}
            </section>
          )}

          {section === "sales" && (
            <section className="admin-panel">
              <div className="admin-panel-heading"><div><span className="eyebrow">REGISTRO DE OPERACIONES</span><h2>Historial de ventas</h2></div><span className="library-count">{invoices.length} FACTURAS</span></div>
              {invoices.length === 0 ? <p className="admin-empty">No hay facturas todavía. Realiza una compra de demostración para llenar este historial.</p> : (
                <div className="admin-sales-list">
                  {[...invoices].reverse().map((invoice) => (
                    <article className="admin-sale-card" key={invoice.number}>
                      <div className="admin-sale-heading"><div><strong>{invoice.number}</strong><span>{invoice.date}</span></div><b>${invoice.total.toFixed(2)}</b></div>
                      <p><strong>Comprador:</strong> {invoice.customerName} · {invoice.customerEmail}</p>
                      <div className="admin-sale-items">{invoice.items.map((item) => <span key={item.game.id}>{item.game.title} × {item.quantity}</span>)}</div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
          <p className="admin-disclaimer">Panel de demostración: los cambios se mantienen únicamente mientras la aplicación está abierta. Los permisos reales deberán validarse en el backend.</p>
        </div>
      </main>
    </div>
  );
}

function CartDrawer({ cart, onClose, onIncrease, onDecrease, onRemove, onCheckout }: {
  cart: CartItem[];
  onClose: () => void;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
}) {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.game.price * item.quantity, 0);

  return (
    <div className="cart-backdrop" onClick={onClose}>
      <aside className="cart-drawer" onClick={(event) => event.stopPropagation()}>
        <div className="cart-header">
          <div><span className="eyebrow">LEVEL STORE</span><h2>Tu carrito ({totalItems})</h2></div>
          <button className="cart-close" onClick={onClose} type="button" aria-label="Cerrar carrito">✕</button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty"><span>🛒</span><h3>Tu carrito está vacío</h3><p>Explora nuestro catálogo y encuentra tu próximo juego.</p></div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.game.id}>
                  <img src={item.game.image} alt={item.game.title} />
                  <div className="cart-item-info">
                    <h3>{item.game.title}</h3><strong>${item.game.price.toFixed(2)}</strong>
                    <div className="quantity-controls">
                      <button onClick={() => onDecrease(item.game.id)} type="button" aria-label="Disminuir cantidad">−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => onIncrease(item.game.id)} type="button" disabled={item.quantity >= item.game.stock} aria-label="Aumentar cantidad">+</button>
                    </div>
                  </div>
                  <div className="cart-item-actions">
                    <strong>${(item.game.price * item.quantity).toFixed(2)}</strong>
                    <button className="remove-item" onClick={() => onRemove(item.game.id)} type="button">Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <div className="cart-total"><span>Subtotal</span><strong>${total.toFixed(2)}</strong></div>
              <div className="cart-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
              <button className="primary-button checkout-button" type="button" onClick={onCheckout}>Continuar compra <Icon name="arrow" size={18} /></button>
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
}: {
  cart: CartItem[];
  onBack: () => void;
  onConfirm: (customerName: string, customerEmail: string) => void;
}) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const total = cart.reduce((sum, item) => sum + item.game.price * item.quantity, 0);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (cart.length === 0) return;
    onConfirm(customerName.trim(), customerEmail.trim());
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
          <p>Revisa tu pedido e introduce tus datos para generar la factura.</p>
        </div>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={submit}>
            <section className="checkout-panel">
              <h2>Datos del comprador</h2>
              <label className="field">
                <span>Nombre completo</span>
                <input
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Ej. Lucas Méndez"
                  required
                  minLength={2}
                />
              </label>
              <label className="field">
                <span>Correo electrónico</span>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(event) => setCustomerEmail(event.target.value)}
                  placeholder="tu@correo.com"
                  required
                />
              </label>
            </section>

            <section className="checkout-panel">
              <h2>Método de pago</h2>
              <div className="payment-notice">
                <span>💳</span>
                <div>
                  <strong>Pago de demostración</strong>
                  <p>No se realizará ningún cobro real. Esta opción permite probar el flujo de compra.</p>
                </div>
              </div>
            </section>

            <button className="primary-button checkout-confirm-button" type="submit" disabled={cart.length === 0}>
              Confirmar compra <Icon name="arrow" size={18} />
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
            <p className="checkout-disclaimer">La factura se generará al confirmar esta compra de demostración.</p>
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
          <p>Tu compra de demostración se ha registrado correctamente.</p>
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
          <span>Total pagado (simulado)</span>
          <strong>${invoice.total.toFixed(2)}</strong>
        </div>

        <div className="invoice-actions">
          <button className="primary-button" onClick={onContinue} type="button">
            Volver a LEVEL <Icon name="arrow" size={18} />
          </button>
        </div>
        <p className="invoice-footnote">Documento de demostración. No representa un comprobante fiscal.</p>
      </section>
    </main>
  );
}

export default function App() {
  const [view, setView] = useState<View>("login");
  const [selectedGameId, setSelectedGameId] = useState<number | null>(games[0]?.id ?? null);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [demoUsers, setDemoUsers] = useState<DemoUser[]>([
    { id: 1, name: "Alex Morgan", email: "alex@level.demo", role: "Comprador", active: true },
    { id: 2, name: "Sam Rivera", email: "sam@level.demo", role: "Vendedor", active: true },
    { id: 3, name: "Taylor Cruz", email: "taylor@level.demo", role: "Administrador", active: true },
  ]);
  const [purchasedGames, setPurchasedGames] = useState<Game[]>([]);
  const [catalogGames, setCatalogGames] = useState<Game[]>(games);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  function addToCart(game: Game) {
    if (game.stock === 0) return;

    setCart((previous) => {
      const existing = previous.find((item) => item.game.id === game.id);
      if (existing) {
        if (existing.quantity >= game.stock) return previous;
        return previous.map((item) =>
          item.game.id === game.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...previous, { game, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function increaseQuantity(id: number) {
    setCart((previous) => previous.map((item) =>
      item.game.id === id && item.quantity < item.game.stock
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  }

  function decreaseQuantity(id: number) {
    setCart((previous) => previous
      .map((item) => item.game.id === id ? { ...item, quantity: item.quantity - 1 } : item)
      .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(id: number) {
    setCart((previous) => previous.filter((item) => item.game.id !== id));
  }

  function addProduct(product: Omit<Game, "id">) {
    const newProduct: Game = {
      ...product,
      id: Math.max(0, ...catalogGames.map((game) => game.id)) + 1,
    };
    setCatalogGames((previous) => [...previous, newProduct]);
  }

  function updateProduct(updatedProduct: Game) {
    setCatalogGames((previous) =>
      previous.map((product) =>
        product.id === updatedProduct.id && product.isSellerProduct
          ? updatedProduct
          : product
      )
    );
  }

  function deleteProduct(id: number) {
    const product = catalogGames.find((item) => item.id === id);
    if (!product?.isSellerProduct) return;

    setCatalogGames((previous) => previous.filter((product) => product.id !== id));
    setCart((previous) => previous.filter((item) => item.game.id !== id));
  }

  function updateAdminProduct(updatedProduct: Game) {
    setCatalogGames((previous) => previous.map((product) =>
      product.id === updatedProduct.id ? updatedProduct : product
    ));
    setCart((previous) => previous.map((item) =>
      item.game.id === updatedProduct.id ? { ...item, game: updatedProduct } : item
    ));
  }

  function deleteAdminProduct(id: number) {
    setCatalogGames((previous) => previous.filter((product) => product.id !== id));
    setCart((previous) => previous.filter((item) => item.game.id !== id));
  }

  function changeDemoUserRole(id: number, role: DemoUser["role"]) {
    setDemoUsers((previous) => previous.map((user) => user.id === id ? { ...user, role } : user));
  }

  function toggleDemoUser(id: number) {
    setDemoUsers((previous) => previous.map((user) => user.id === id ? { ...user, active: !user.active } : user));
  }

  function completePurchase(customerName: string, customerEmail: string) {
    if (cart.length === 0) return;

    const purchaseItems = cart.map((item) => ({
      game: item.game,
      quantity: item.quantity,
    }));
    const total = purchaseItems.reduce(
      (sum, item) => sum + item.game.price * item.quantity,
      0
    );

    const newInvoice: Invoice = {
      number: `LV-${Date.now().toString().slice(-8)}`,
      date: new Date().toLocaleString("es-SV"),
      customerName,
      customerEmail,
      items: purchaseItems,
      total,
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
    setView("invoice");
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  let page: ReactNode;
  if (view === "login" || view === "register") {
    page = <AuthLayout mode={view} setView={setView} />;
  } else if (view === "details") {
    page = <Details setView={setView} selectedGameId={selectedGameId} search={search} setSearch={setSearch} cartCount={cartCount} onOpenCart={() => setCartOpen(true)} onAddToCart={addToCart} catalogGames={catalogGames} />;
  } else if (view === "profile") {
    page = (
      <Profile
        setView={setView}
        setSelectedGameId={setSelectedGameId}
        search={search}
        setSearch={setSearch}
        purchasedGames={purchasedGames}
      />
    );
  } else if (view === "admin") {
    page = (
      <AdminDashboard
        products={catalogGames}
        invoices={invoices}
        users={demoUsers}
        onChangeRole={changeDemoUserRole}
        onToggleUser={toggleDemoUser}
        onUpdateProduct={updateAdminProduct}
        onDeleteProduct={deleteAdminProduct}
        onBack={() => setView("home")}
      />
    );
  } else if (view === "seller") {
    page = (
      <SellerDashboard
        products={catalogGames}
        onAdd={addProduct}
        onUpdate={updateProduct}
        onDelete={deleteProduct}
        onBack={() => setView("home")}
      />
    );
  } else if (view === "checkout") {
    page = <Checkout
      cart={cart}
      onBack={() => setView("home")}
      onConfirm={completePurchase}
    />;
  } else if (view === "invoice" && invoice) {
    page = <InvoicePage
      invoice={invoice}
      onContinue={() => setView("home")}
    />;
  } else {
    page = <Home setView={setView} setSelectedGameId={setSelectedGameId} search={search} setSearch={setSearch} cartCount={cartCount} onOpenCart={() => setCartOpen(true)} onAddToCart={addToCart} catalogGames={catalogGames} />;
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
