
-- =====================================================
-- LEVEL - 02. VIDEOJUEGOS Y CATEGORIAS
-- Base de datos: level_db
-- Motor: PostgreSQL 17
-- =====================================================

-- 1. Tabla de videojuegos
CREATE TABLE videojuegos (
    id_videojuego SERIAL PRIMARY KEY,
    id_vendedor INTEGER NOT NULL,

    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    estudio VARCHAR(120),
    tagline VARCHAR(200),

    precio NUMERIC(10,2) NOT NULL
        CHECK (precio >= 0),

    stock INTEGER NOT NULL DEFAULT 0
        CHECK (stock >= 0),

    imagen TEXT,

    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO'
        CHECK (estado IN ('ACTIVO', 'INACTIVO')),

    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_videojuegos_vendedor
        FOREIGN KEY (id_vendedor)
        REFERENCES usuarios(id_usuario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- 2. Tabla de categorias
CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE,
    descripcion TEXT
);

-- 3. Tabla intermedia videojuego_categoria
CREATE TABLE videojuego_categoria (
    id_videojuego INTEGER NOT NULL,
    id_categoria INTEGER NOT NULL,

    PRIMARY KEY (id_videojuego, id_categoria),

    CONSTRAINT fk_vj_categoria_videojuego
        FOREIGN KEY (id_videojuego)
        REFERENCES videojuegos(id_videojuego)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_vj_categoria_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categorias(id_categoria)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- 4. Indices para mejorar consultas
CREATE INDEX idx_videojuegos_vendedor
    ON videojuegos(id_vendedor);

CREATE INDEX idx_videojuegos_titulo
    ON videojuegos(titulo);

CREATE INDEX idx_videojuego_categoria_categoria
    ON videojuego_categoria(id_categoria);

-- 5. Categorias iniciales
INSERT INTO categorias (nombre, descripcion) VALUES
('ACCION', 'Videojuegos de accion'),
('AVENTURA', 'Videojuegos de aventura'),
('DEPORTES', 'Videojuegos deportivos'),
('ESTRATEGIA', 'Videojuegos de estrategia'),
('RPG', 'Juegos de rol'),
('SIMULACION', 'Videojuegos de simulacion'),
('TERROR', 'Videojuegos de terror'),
('CARRERAS', 'Videojuegos de carreras');
