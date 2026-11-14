
-- =====================================================
-- LEVEL - 05. FACTURAS
-- Base de datos: level_db
-- Motor: PostgreSQL 17
-- =====================================================

-- 1. Tabla de facturas
CREATE TABLE facturas (
    id_factura SERIAL PRIMARY KEY,

    id_compra INTEGER NOT NULL UNIQUE,

    numero_factura VARCHAR(40) NOT NULL UNIQUE,

    fecha_emision TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    subtotal NUMERIC(10,2) NOT NULL
        CHECK (subtotal >= 0),

    total NUMERIC(10,2) NOT NULL
        CHECK (total >= 0),

    estado VARCHAR(20) NOT NULL DEFAULT 'EMITIDA'
        CHECK (
            estado IN ('EMITIDA', 'ANULADA')
        ),

    CONSTRAINT fk_facturas_compra
        FOREIGN KEY (id_compra)
        REFERENCES compras(id_compra)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- 2. Indice para consultas por fecha
CREATE INDEX idx_facturas_fecha
    ON facturas(fecha_emision);
