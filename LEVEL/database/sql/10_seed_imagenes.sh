#!/usr/bin/env bash
# Carga portadas locales en la columna videojuegos.imagen.
# Solo usa archivos del repositorio; no descarga contenido externo.
set -euo pipefail

load_cover() {
  local file="$1"
  local title="$2"
  [ -f "$file" ] || return 0

  local extension mime escaped_title
  extension="${file##*.}"
  case "${extension,,}" in
    jpg|jpeg) mime="image/jpeg" ;;
    png) mime="image/png" ;;
    webp) mime="image/webp" ;;
    *) echo "Formato no admitido: $file" >&2; return 0 ;;
  esac

  escaped_title="${title//\'/\'\'}"
  {
    printf "UPDATE videojuegos SET imagen = 'data:%s;base64," "$mime"
    base64 "$file" | tr -d '\n'
    printf "' WHERE titulo = '%s';\n" "$escaped_title"
  } | psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -v ON_ERROR_STOP=1
  echo "Portada cargada: $title"
}

load_cover /seed-assets/grand-theft-auto-vi.webp "Grand Theft Auto VI"
load_cover /seed-assets/battlefield-6.webp "Battlefield 6"
load_cover /seed-assets/ea-sports-fc-26.webp "EA SPORTS FC 26"
load_cover /seed-assets/minecraft.webp "Minecraft"
load_cover /seed-assets/fortnite.webp "Fortnite"
load_cover /seed-assets/counter-strike-2.webp "Counter-Strike 2"
load_cover /seed-assets/red-dead-redemption-2.webp "Red Dead Redemption 2"
load_cover /seed-assets/elden-ring-nightreign.webp "Elden Ring Nightreign"
load_cover /seed-assets/oblivion-remastered.webp "The Elder Scrolls IV: Oblivion Remastered"
load_cover /seed-assets/grand-theft-auto-v-enhanced.webp "Grand Theft Auto V Enhanced"
