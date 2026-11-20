-- =====================================================
-- LEVEL - 02. ADMINISTRADOR INICIAL
-- Se ejecuta solo al inicializar un volumen PostgreSQL vacío.
-- Las credenciales provienen de variables de entorno del contenedor.
-- =====================================================

\getenv admin_nombre ADMIN_NOMBRE
\getenv admin_apellido ADMIN_APELLIDO
\getenv admin_correo ADMIN_CORREO
\getenv admin_password_hash ADMIN_PASSWORD_HASH

INSERT INTO usuarios (id_rol, nombre, apellido, correo, password_hash)
SELECT id_rol, :'admin_nombre', :'admin_apellido', :'admin_correo', :'admin_password_hash'
FROM roles
WHERE nombre = 'ADMINISTRADOR'
  AND NOT EXISTS (
      SELECT 1
      FROM usuarios administrador
      JOIN roles rol ON rol.id_rol = administrador.id_rol
      WHERE rol.nombre = 'ADMINISTRADOR'
  )
ON CONFLICT (correo) DO NOTHING;

-- Si el correo configurado ya pertenece a otra cuenta, no se deja una base
-- inicializada sin administrador: la inicialización falla de forma explícita.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM usuarios administrador
        JOIN roles rol ON rol.id_rol = administrador.id_rol
        WHERE rol.nombre = 'ADMINISTRADOR'
    ) THEN
        RAISE EXCEPTION 'No se pudo crear el administrador inicial; revise ADMIN_CORREO y ADMIN_PASSWORD_HASH';
    END IF;
END;
$$;
