#!/bin/bash

# Lightweight Deployment Package Creator (Without node_modules)
# For cPanel with npm install capability

echo "🚀 Creating LIGHTWEIGHT deployment package..."

# Variables
PACKAGE_NAME="portonew-lite-$(date +%Y%m%d-%H%M%S)"
PACKAGE_DIR="deployment-lite"
ARCHIVE_NAME="${PACKAGE_NAME}.tar.gz"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Clean previous package
if [ -d "$PACKAGE_DIR" ]; then
    echo -e "${YELLOW}Removing old package...${NC}"
    rm -rf "$PACKAGE_DIR"
fi

mkdir -p "$PACKAGE_DIR"

# Build
echo -e "${BLUE}Building production files...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Build failed! Exiting...${NC}"
    exit 1
fi

# Copy files
echo -e "${BLUE}Copying files (WITHOUT node_modules)...${NC}"

cp -r dist "$PACKAGE_DIR/"
cp server.js "$PACKAGE_DIR/"
cp package.json "$PACKAGE_DIR/"
cp package-lock.json "$PACKAGE_DIR/"
cp .env.example "$PACKAGE_DIR/"
cp database.sql "$PACKAGE_DIR/"
cp DEPLOY.md "$PACKAGE_DIR/"
cp DEPLOYMENT_CHECKLIST.md "$PACKAGE_DIR/"
cp README.md "$PACKAGE_DIR/"

# Create install instructions
cat > "$PACKAGE_DIR/INSTALL.txt" << 'EOF'
╔═══════════════════════════════════════════════════════════════╗
║    INSTALASI LIGHTWEIGHT - TANPA NODE_MODULES                 ║
╔═══════════════════════════════════════════════════════════════╗

📦 Package ini TIDAK include node_modules (lebih kecil, lebih cepat upload)

📋 LANGKAH INSTALASI:

1. UPLOAD FILES
   ✓ Upload semua file ke folder di cPanel
   ✓ Extract jika dalam bentuk .tar.gz

2. INSTALL DEPENDENCIES DI SERVER
   ✓ Buka "Setup Node.js App" di cPanel
   ✓ Create application dengan startup file: server.js
   ✓ Klik "Run NPM Install" (akan install dependencies otomatis)
   
   ATAU via SSH:
   $ cd /path/to/your/folder
   $ npm install --omit=dev

3. SETUP ENVIRONMENT
   ✓ Rename .env.example → .env
   ✓ Edit sesuai konfigurasi server Anda

4. START APPLICATION
   ✓ Klik "Restart" di cPanel Node.js App

═══════════════════════════════════════════════════════════════

⚠️ CATATAN:
- Package ini lebih kecil (~10-20MB vs ~200MB dengan node_modules)
- Cocok untuk server dengan memory cukup untuk npm install
- Jika npm install gagal (killed), gunakan deploy.sh biasa

═══════════════════════════════════════════════════════════════
EOF

# Create archive
echo -e "${BLUE}Creating archive...${NC}"
tar -czf "$ARCHIVE_NAME" -C "$PACKAGE_DIR" .

FILE_SIZE=$(du -h "$ARCHIVE_NAME" | cut -f1)

echo -e "${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║    LIGHTWEIGHT PACKAGE CREATED!                       ║${NC}"
echo -e "${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║${NC}"
echo -e "${GREEN}║${NC} 📦 Package: ${BLUE}$ARCHIVE_NAME${NC}"
echo -e "${GREEN}║${NC} 📊 Size: ${BLUE}$FILE_SIZE${NC} (tanpa node_modules!)"
echo -e "${GREEN}║${NC} 📁 Location: ${BLUE}$(pwd)/$ARCHIVE_NAME${NC}"
echo -e "${GREEN}║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}📋 Next: Upload ke cPanel dan run 'npm install' di server${NC}"

# Cleanup
read -p "Keep uncompressed folder? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    rm -rf "$PACKAGE_DIR"
fi
