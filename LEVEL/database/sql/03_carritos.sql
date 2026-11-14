
-- =====================================================
-- LEVEL - 03. CARRITOS Y DETALLES
-- Base de datos: level_db
-- Motor: PostgreSQL 17
-- =====================================================

-- 1. Tabla de carritos
CREATE TABLE carritos (
    id_carrito SERIAL PRIMARY KEY,

    id_usuario INTEGER NOT NULL UNIQUE,

    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_carritos_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- 2. Tabla de detalles del carrito
CREATE TABLE detalle_carrito (
    id_detalle SERIAL PRIMARY KEY,

    id_carrito INTEGER NOT NULL,
    id_videojuego INTEGER NOT NULL,

    cantidad INTEGER NOT NULL DEFAULT 1
        CHECK (cantidad > 0),

    CONSTRAINT fk_detalle_carrito_carrito
        FOREIGN KEY (id_carrito)
        REFERENCES carritos(id_carrito)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_detalle_carrito_videojuego
        FOREIGN KEY (id_videojuego)
        REFERENCES videojuegos(id_videojuego)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT uq_carrito_videojuego
        UNIQUE (id_carrito, id_videojuego)
);


CREATE INDEX idx_detalle_carrito_videojuego
    ON detalle_carrito(id_videojuego);
