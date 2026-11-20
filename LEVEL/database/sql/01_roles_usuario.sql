
-- =====================================================
-- LEVEL - 01. ROLES Y USUARIOS
-- Base de datos: level_db
-- Motor: PostgreSQL 17
-- =====================================================

-- 1. Tabla de roles
CREATE TABLE roles (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL UNIQUE,
    descripcion VARCHAR(150)
);

-- 2. Tabla de usuarios
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    id_rol INTEGER NOT NULL,

    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,

    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO'
        CHECK (estado IN ('ACTIVO', 'INACTIVO', 'BLOQUEADO')),

    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuarios_roles
        FOREIGN KEY (id_rol)
        REFERENCES roles(id_rol)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- 3. Insertar roles iniciales
INSERT INTO roles (nombre, descripcion) VALUES
('ADMINISTRADOR', 'Administra la plataforma LEVEL'),
('VENDEDOR', 'Publica y administra videojuegos'),
('COMPRADOR', 'Compra videojuegos y administra su biblioteca');

-- El modelo permite varios usuarios por rol, excepto para ADMINISTRADOR.
-- La restricción se aplica también ante inserciones directas en la base de datos.
CREATE OR REPLACE FUNCTION impedir_multiples_administradores()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.id_rol = (SELECT id_rol FROM roles WHERE nombre = 'ADMINISTRADOR') THEN
        -- Serializa las altas/cambios de administrador para preservar la unicidad.
        PERFORM 1 FROM roles WHERE id_rol = NEW.id_rol FOR UPDATE;

        IF EXISTS (
            SELECT 1
            FROM usuarios
            WHERE id_rol = NEW.id_rol
              AND id_usuario <> COALESCE(NEW.id_usuario, -1)
        ) THEN
            RAISE EXCEPTION 'Solo puede existir un usuario con el rol ADMINISTRADOR'
                USING ERRCODE = '23505';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_unico_administrador
BEFORE INSERT OR UPDATE OF id_rol ON usuarios
FOR EACH ROW
EXECUTE FUNCTION impedir_multiples_administradores();
