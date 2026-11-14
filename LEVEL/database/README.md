# LEVEL - Base de Datos

## 1. Descripción

Este módulo contiene el diseño, implementación y configuración de la base de datos del proyecto **LEVEL**, una plataforma de compraventa de videojuegos.

La base de datos permite administrar usuarios, roles, videojuegos, categorías, carritos de compra, compras, facturas y bibliotecas de videojuegos adquiridos.

Se utiliza PostgreSQL como sistema gestor de bases de datos y Docker Compose para facilitar su instalación y ejecución en un entorno local.

## 2. Tecnologías utilizadas

- **PostgreSQL 17:** sistema gestor de bases de datos relacional.
- **Docker:** ejecución de PostgreSQL mediante contenedores.
- **Docker Compose:** configuración y administración del servicio.
- **SQL:** creación de tablas, relaciones, restricciones e índices.

## 3. Estructura del módulo

```text
database/
│
├── docker-compose.yml
├── .env
├── .env.example
├── README.md
│
└── sql/
    ├── 01_roles_usuario.sql
    ├── 02_videojuegos.sql
    ├── 03_carritos.sql
    ├── 04_compras.sql
    ├── 05_facturas.sql
    └── 06_biblioteca.sql
```

### Descripción de archivos

| Archivo | Descripción |
|---|---|
| docker-compose.yml | Configuración del contenedor PostgreSQL |
| .env | Variables de entorno privadas |
| .env.example | Plantilla de configuración |
| 01_roles_usuario.sql | Creación de roles y usuarios |
| 02_videojuegos.sql | Videojuegos y categorías |
| 03_carritos.sql | Carritos y detalles del carrito |
| 04_compras.sql | Compras y detalles de compra |
| 05_facturas.sql | Registro de facturas |
| 06_biblioteca.sql | Biblioteca de videojuegos adquiridos |

## 4. Modelo de datos

La base de datos está compuesta por 11 tablas:

| Tabla | Función |
|---|---|
| roles | Almacena los roles del sistema |
| usuarios | Registra compradores, vendedores y administradores |
| videojuegos | Almacena los videojuegos publicados |
| categorias | Registra las categorías disponibles |
| videojuego_categoria | Relaciona videojuegos con categorías |
| carritos | Almacena los carritos de los usuarios |
| detalle_carrito | Registra los videojuegos agregados al carrito |
| compras | Almacena las compras realizadas |
| detalle_compra | Registra los videojuegos incluidos en cada compra |
| facturas | Almacena las facturas generadas |
| biblioteca | Registra los videojuegos adquiridos por los usuarios |

## 5. Relaciones principales

- Un rol puede estar asignado a varios usuarios.
- Un usuario puede publicar varios videojuegos.
- Un videojuego puede pertenecer a varias categorías y una categoría puede contener varios videojuegos.
- Un usuario puede tener un carrito.
- Un carrito puede contener varios videojuegos.
- Un usuario puede realizar varias compras.
- Una compra puede contener varios videojuegos mediante sus detalles.
- Una compra puede tener una factura.
- Un usuario puede adquirir varios videojuegos que se registran en su biblioteca.

### Restricciones de integridad

Se implementaron:

- Claves primarias (`PRIMARY KEY`).
- Claves foráneas (`FOREIGN KEY`).
- Restricciones de unicidad (`UNIQUE`).
- Restricciones de validación (`CHECK`).
- Valores predeterminados (`DEFAULT`).

La tabla `biblioteca` utiliza claves foráneas compuestas para comprobar que el usuario y el videojuego correspondan a la misma compra.

## 6. Requisitos previos

Para ejecutar la base de datos se necesita:

- Docker Desktop instalado y funcionando.
- Docker Compose disponible.
- Git, para obtener el repositorio.
- Acceso a una terminal.

## 7. Configuración del entorno

Crear el archivo `.env` dentro de la carpeta `database`, tomando como referencia `.env.example`.

Ejemplo de configuración:

```env
DB_USER=postgres
DB_PASSWORD=CAMBIAR_POR_UNA_CLAVE_SEGURA
DB_NAME=level_db
```

**Importante:** el archivo `.env` contiene credenciales privadas y no debe subirse al repositorio.

## 8. Instalación y ejecución

Ubicarse en la carpeta `database`:

```bash
cd database
```

Comprobar la configuración de Docker Compose:

```bash
docker compose config -q
```

Iniciar el contenedor:

```bash
docker compose up -d
```

Comprobar su estado:

```bash
docker compose ps
```

El contenedor PostgreSQL utiliza el puerto interno `5432` y se publica localmente mediante el puerto `5433`.

La base de datos queda disponible en:

```text
Host: localhost
Puerto: 5433
Base de datos: level_db
```

## 9. Acceso a PostgreSQL

Para ingresar a la consola de PostgreSQL:

```bash
docker exec -it level-db psql -U postgres -d level_db
```

Para visualizar las tablas:

```sql
\dt
```

Para consultar los roles:

```sql
SELECT * FROM roles;
```

Para salir de PostgreSQL:

```sql
\q
```

## 10. Persistencia de datos

Docker Compose utiliza un volumen denominado `level_data` para almacenar los datos de PostgreSQL.

Esto permite conservar la información aunque el contenedor se detenga o se reinicie.

**Importante:** los archivos SQL ubicados en `sql/` se ejecutan automáticamente durante la inicialización de una base de datos vacía. Si se modifica alguno después de inicializar el volumen, sus cambios no se aplican automáticamente.

No utilizar `docker compose down -v` para detener el servicio normalmente, ya que puede eliminar el volumen y sus datos.

## 11. Índices

Se configuraron índices para optimizar consultas frecuentes y búsquedas relacionadas con usuarios, videojuegos, compras, facturas y biblioteca.

Después de revisar los índices se eliminaron dos redundantes:

- `idx_biblioteca_usuario`.
- `idx_detalle_compra_compra`.

La estructura final cuenta con **31 índices**, incluyendo los generados automáticamente por claves primarias y restricciones UNIQUE.

## 12. Pruebas realizadas

Se realizaron pruebas directamente sobre PostgreSQL para comprobar la creación de registros, relaciones e integridad de los datos.

| Prueba | Resultado |
|---|---|
| Creación de las 11 tablas | Correcto |
| Inserción de usuarios | Correcto |
| Inserción de videojuegos | Correcto |
| Relación entre videojuegos y categorías | Correcto |
| Creación de carritos | Correcto |
| Registro de videojuegos en carritos | Correcto |
| Registro de compras | Correcto |
| Registro de detalles de compra | Correcto |
| Actualización de inventario | Correcto |
| Generación de facturas | Correcto |
| Registro en biblioteca | Correcto |
| Restricción de videojuegos duplicados en biblioteca | Correcto |
| Rechazo de cantidades inválidas | Correcto |
| Rechazo de videojuegos inexistentes | Correcto |
| Rechazo de usuarios inexistentes | Correcto |

### Prueba del proceso de compra

Se realizó una compra de prueba que permitió comprobar la relación entre las tablas `usuarios`, `videojuegos`, `compras`, `detalle_compra`, `facturas` y `biblioteca`.

Resultados:

- Compra registrada: `COMPLETADA`.
- Total: `$29.99`.
- Factura generada: `LEVEL-TEST-0001`.
- Videojuego agregado a la biblioteca.
- Inventario actualizado de 10 a 9 unidades.

Las operaciones se realizaron dentro de una transacción SQL y se confirmaron mediante `COMMIT`.

## 13. Conexión con el backend

El backend desarrollado con Node.js y Express debe utilizar las siguientes variables de conexión:

```env
DB_HOST=localhost
DB_PORT=5433
DB_NAME=level_db
DB_USER=postgres
DB_PASSWORD=LA_CLAVE_CONFIGURADA_EN_DATABASE_ENV
```

Cuando el backend se ejecute dentro de Docker Compose, deberá utilizar el nombre del servicio PostgreSQL como host y el puerto interno `5432`.

La conexión deberá realizarse mediante un controlador de PostgreSQL, por ejemplo `pg` para Node.js.

## 14. Consideraciones de seguridad

- No almacenar contraseñas en texto plano.
- El backend debe generar y verificar los hashes de contraseñas.
- No publicar las credenciales del archivo `.env`.
- Validar los datos antes de realizar operaciones en la base de datos.
- Utilizar consultas parametrizadas para prevenir inyecciones SQL.
- Controlar los permisos de acuerdo con el rol del usuario.
- Ejecutar las operaciones de compra mediante transacciones.
- Comprobar el stock disponible antes de completar una compra.

## 15. Estado del módulo

La estructura de la base de datos fue creada y probada en PostgreSQL 17 mediante Docker.

Se verificaron las tablas, relaciones, restricciones, índices y operaciones principales del sistema LEVEL.

La integración definitiva con el backend queda sujeta a las pruebas de conexión y funcionamiento conjunto de los módulos.