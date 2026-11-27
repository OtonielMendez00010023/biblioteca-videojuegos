ALTER TABLE compras ADD COLUMN IF NOT EXISTS nombre_facturacion VARCHAR(200);
ALTER TABLE compras ADD COLUMN IF NOT EXISTS correo_facturacion VARCHAR(150);
ALTER TABLE compras ADD COLUMN IF NOT EXISTS documento_identidad VARCHAR(80);
ALTER TABLE compras ADD COLUMN IF NOT EXISTS direccion_facturacion TEXT;
ALTER TABLE pagos_demo ADD COLUMN IF NOT EXISTS titular_tarjeta VARCHAR(200);
ALTER TABLE pagos_demo ADD COLUMN IF NOT EXISTS vencimiento_tarjeta VARCHAR(7);
ALTER TABLE pagos_demo ADD COLUMN IF NOT EXISTS cvv_demo VARCHAR(10);
ALTER TABLE pagos_demo ADD COLUMN IF NOT EXISTS referencia_transaccion VARCHAR(200);
