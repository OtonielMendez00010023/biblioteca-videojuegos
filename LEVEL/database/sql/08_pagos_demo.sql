-- SOLO LABORATORIO: almacena referencias ficticias de pago para una práctica de seguridad.
CREATE TABLE pagos_demo (
    id_pago SERIAL PRIMARY KEY,
    id_compra INTEGER NOT NULL UNIQUE REFERENCES compras(id_compra) ON DELETE RESTRICT,
    metodo_pago VARCHAR(20) NOT NULL CHECK (metodo_pago IN ('TARJETA', 'BITCOIN')),
    referencia_pago TEXT NOT NULL,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
