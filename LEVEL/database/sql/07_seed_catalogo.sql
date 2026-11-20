-- Catálogo inicial de LEVEL. Se ejecuta solo en una base vacía y no duplica títulos.
WITH administrador AS (
    SELECT u.id_usuario FROM usuarios u JOIN roles r ON r.id_rol = u.id_rol WHERE r.nombre = 'ADMINISTRADOR' LIMIT 1
), juegos(titulo, descripcion, estudio, tagline, precio, stock) AS (
    VALUES
    ('Grand Theft Auto VI', 'Aventura de mundo abierto ambientada en Leonida.', 'Rockstar Games', 'Vice City vuelve a empezar.', 69.99, 20),
    ('Battlefield 6', 'Combate multijugador a gran escala.', 'Battlefield Studios', 'La batalla cambia para siempre.', 59.99, 18),
    ('EA SPORTS FC 26', 'Fútbol competitivo con clubes y selecciones.', 'EA Sports', 'El juego de todos.', 49.99, 25),
    ('Minecraft', 'Construye, explora y sobrevive en mundos infinitos.', 'Mojang Studios', 'Crea tu propia aventura.', 29.99, 30),
    ('Fortnite', 'Acción competitiva y modos creativos.', 'Epic Games', 'La isla te espera.', 0.00, 50),
    ('Counter-Strike 2', 'Shooter táctico competitivo por equipos.', 'Valve', 'Cada ronda cuenta.', 0.00, 40),
    ('Red Dead Redemption 2', 'Aventura narrativa en el lejano oeste.', 'Rockstar Games', 'Forajidos hasta el final.', 39.99, 16),
    ('Elden Ring Nightreign', 'Acción cooperativa en un mundo oscuro.', 'FromSoftware', 'Resiste la noche.', 39.99, 14),
    ('The Elder Scrolls IV: Oblivion Remastered', 'RPG de fantasía en Cyrodiil.', 'Bethesda Game Studios', 'Una leyenda renace.', 49.99, 15),
    ('Grand Theft Auto V Enhanced', 'Crimen y mundo abierto en Los Santos.', 'Rockstar Games', 'Regresa a Los Santos.', 29.99, 22)
)
INSERT INTO videojuegos (id_vendedor, titulo, descripcion, estudio, tagline, precio, stock, imagen)
SELECT a.id_usuario, j.titulo, j.descripcion, j.estudio, j.tagline, j.precio, j.stock,
       'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="750"%3E%3Crect width="100%25" height="100%25" fill="%23171228"/%3E%3Crect x="32" y="32" width="536" height="686" rx="24" fill="%236d45c5"/%3E%3Ctext x="300" y="360" text-anchor="middle" fill="white" font-family="Arial" font-size="34" font-weight="bold"%3ELEVEL%3C/text%3E%3C/svg%3E'
FROM juegos j CROSS JOIN administrador a
WHERE NOT EXISTS (SELECT 1 FROM videojuegos v WHERE v.titulo = j.titulo);

INSERT INTO videojuego_categoria (id_videojuego, id_categoria)
SELECT v.id_videojuego, c.id_categoria
FROM videojuegos v JOIN categorias c ON c.nombre = CASE
    WHEN v.titulo IN ('EA SPORTS FC 26') THEN 'DEPORTES'
    WHEN v.titulo IN ('Minecraft', 'The Elder Scrolls IV: Oblivion Remastered') THEN 'AVENTURA'
    WHEN v.titulo IN ('Counter-Strike 2', 'Battlefield 6') THEN 'ACCION'
    ELSE 'RPG' END
WHERE v.titulo IN ('Grand Theft Auto VI','Battlefield 6','EA SPORTS FC 26','Minecraft','Fortnite','Counter-Strike 2','Red Dead Redemption 2','Elden Ring Nightreign','The Elder Scrolls IV: Oblivion Remastered','Grand Theft Auto V Enhanced')
ON CONFLICT DO NOTHING;
