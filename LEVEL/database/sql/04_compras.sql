
-- =====================================================
-- LEVEL - 04. COMPRAS Y DETALLES
-- Base de datos: level_db
-- Motor: PostgreSQL 17
-- =====================================================

-- 1. Tabla de compras
CREATE TABLE compras (
    id_compra SERIAL PRIMARY KEY,

    id_usuario INTEGER NOT NULL,

    fecha_compra TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_compra_usuario
    UNIQUE (id_compra, id_usuario),

    subtotal NUMERIC(10,2) NOT NULL
        CHECK (subtotal >= 0),

    total NUMERIC(10,2) NOT NULL
        CHECK (total >= 0),

    metodo_pago VARCHAR(30),

    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE'
        CHECK (
            estado IN ('PENDIENTE', 'COMPLETADA', 'CANCELADA')
        ),

    CONSTRAINT fk_compras_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- 2. Tabla de detalles de compra
CREATE TABLE detalle_compra (
    id_detalle_compra SERIAL PRIMARY KEY,

    id_compra INTEGER NOT NULL,
    id_videojuego INTEGER NOT NULL,
    CONSTRAINT uq_compra_videojuego
    UNIQUE (id_compra, id_videojuego),

    cantidad INTEGER NOT NULL
        CHECK (cantidad > 0),

    precio_unitario NUMERIC(10,2) NOT NULL
        CHECK (precio_unitario >= 0),

    subtotal NUMERIC(10,2) NOT NULL
        CHECK (subtotal >= 0),

    CONSTRAINT chk_detalle_compra_subtotal
        CHECK (subtotal = cantidad * precio_unitario),

    CONSTRAINT fk_detalle_compra_compra
        FOREIGN KEY (id_compra)
        REFERENCES compras(id_compra)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_detalle_compra_videojuego
        FOREIGN KEY (id_videojuego)
        REFERENCES videojuegos(id_videojuego)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- 3. Indices para mejorar consultas
CREATE INDEX idx_compras_usuario
    ON compras(id_usuario);

CREATE INDEX idx_compras_fecha
    ON compras(fecha_compra);

CREATE INDEX idx_detalle_compra_videojuego
    ON detalle_compra(id_videojuego);
