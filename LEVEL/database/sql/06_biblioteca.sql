
-- =====================================================
-- LEVEL - 06. BIBLIOTECA DE VIDEOJUEGOS
-- Base de datos: level_db
-- Motor: PostgreSQL 17
-- =====================================================

-- 1. Tabla de biblioteca
CREATE TABLE biblioteca (
    id_biblioteca SERIAL PRIMARY KEY,

    id_usuario INTEGER NOT NULL,
    id_videojuego INTEGER NOT NULL,
    id_compra INTEGER NOT NULL,

    fecha_adquisicion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Un usuario no puede registrar dos veces
    -- el mismo videojuego en su biblioteca.
    CONSTRAINT uq_biblioteca_usuario_videojuego
        UNIQUE (id_usuario, id_videojuego),

CONSTRAINT fk_biblioteca_usuario_compra
    FOREIGN KEY (id_compra, id_usuario)
    REFERENCES compras(id_compra, id_usuario)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

CONSTRAINT fk_biblioteca_videojuego_compra
    FOREIGN KEY (id_compra, id_videojuego)
    REFERENCES detalle_compra(id_compra, id_videojuego)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE INDEX idx_biblioteca_videojuego
    ON biblioteca(id_videojuego);

CREATE INDEX idx_biblioteca_compra
    ON biblioteca(id_compra);
