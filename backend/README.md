# LEVEL - Backend API 

Este es el backend del sistema web **LEVEL**, desarrollado con **Node.js, Express y TypeScript**. Proporciona una API RESTful segura para la gestión de usuarios, catálogo de videojuegos, compras transaccionales y biblioteca personal, conectándose a una base de datos **PostgreSQL** desplegada en Docker.

---

## Requisitos Previos

Para levantar este proyecto en tu entorno local, asegúrate de tener instalado:
- **Node.js** (v18 o superior)
- **Git**
- **Docker y Docker Compose** (para levantar la base de datos `level_db` de forma local)

---

## Instalación y Ejecución paso a paso

**1. Clonar el repositorio y moverse a la rama correcta**
```bash
git clone [https://github.com/OtonielMendez00010023/biblioteca-videojuegos.git](https://github.com/OtonielMendez00010023/biblioteca-videojuegos.git)
cd biblioteca-videojuegos/backend
git checkout develop
---

## Instalacion de dependencias
npm install

## Configurar las variables de entorno 
Crea un archivo llamado .env en la raíz de la carpeta backend (al mismo nivel que package.json) y pega las siguientes variables (ajusta las credenciales de la BD según el contenedor de Docker):

PORT=3000
DB_USER=postgres
DB_PASSWORD=tu_contraseña_aqui
DB_HOST=localhost
DB_PORT=5433
DB_NAME=level_db
JWT_SECRET=super_secreto_para_tokens_level_2026

## Levantar el servicioDeb
npm run dev