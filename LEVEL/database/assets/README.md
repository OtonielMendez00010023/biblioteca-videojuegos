# Portadas iniciales de LEVEL

Coloca aquí las portadas locales que se cargarán al crear la base de datos con Docker.

Usa formato `.webp`, `.jpg` o `.png`, preferentemente WebP y menos de 300 KB por archivo. Los nombres deben coincidir exactamente con esta lista:

- `grand-theft-auto-vi.webp`
- `battlefield-6.webp`
- `ea-sports-fc-26.webp`
- `minecraft.webp`
- `fortnite.webp`
- `counter-strike-2.webp`
- `red-dead-redemption-2.webp`
- `elden-ring-nightreign.webp`
- `oblivion-remastered.webp`
- `grand-theft-auto-v-enhanced.webp`

El script `sql/10_seed_imagenes.sh` convierte el archivo a Base64 y lo almacena en la columna `videojuegos.imagen`. No se descarga contenido externo.
