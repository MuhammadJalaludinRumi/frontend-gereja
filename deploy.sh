#!/bin/bash

# Nama pm2 process Nuxt
PM2_APP_NAME="nuxt-app"

# Folder yang kita cek perubahan
WATCH_DIRS=("composables" "pages" "plugins" "package.json" "nuxt.config.ts")

# 1️⃣ Pull terbaru
echo "🔄 Pulling latest code..."
git pull origin main

# 2️⃣ Cek perubahan di folder penting
CHANGES=$(git diff --name-only HEAD@{1} HEAD)

SHOULD_BUILD=false

for dir in "${WATCH_DIRS[@]}"; do
  if echo "$CHANGES" | grep -q "^$dir"; then
    SHOULD_BUILD=true
    break
  fi
done

if [ "$SHOULD_BUILD" = true ]; then
  echo "📦 Changes detected in important files. Building Nuxt..."

  # Install dependency kalau ada update
  pnpm install

  # Build Nuxt
  pnpm build

  # Restart Nuxt via PM2
  echo "🔄 Restarting Nuxt app..."
  pm2 restart $PM2_APP_NAME

  echo "✅ Deployment complete!"
else
  echo "✨ No relevant changes detected. Skipping build."
fi
