#!/bin/bash


# Root files
touch README.md .gitignore .env.example pnpm-workspace.yaml

# Contracts
mkdir -p contracts/zap/src
touch contracts/zap/Cargo.toml
touch contracts/zap/src/lib.rs

# Frontend
mkdir -p frontend/yieldzap-app/{public,src/{components,pages,lib,hooks,styles}}
touch frontend/yieldzap-app/.env.local.example
touch frontend/yieldzap-app/package.json
touch frontend/yieldzap-app/tsconfig.json
touch frontend/yieldzap-app/next.config.js

# Backend
mkdir -p backend/rebalancer-bot
touch backend/rebalancer-bot/index.ts
touch backend/rebalancer-bot/notify.ts

mkdir -p backend/strategy-engine/src
touch backend/strategy-engine/src/index.ts

# Scripts
mkdir -p scripts
touch scripts/deploy.zap.sh
touch scripts/init.vaults.sh
chmod +x scripts/*.sh

# Docs
mkdir -p docs
touch docs/architecture.md

# Create pnpm workspace file
cat <<EOF > pnpm-workspace.yaml
packages:
  - 'contracts/**'
  - 'frontend/**'
  - 'backend/**'
EOF

echo "✅ Project structure created successfully."

