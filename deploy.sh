#!/bin/bash

# Deployment Package Creator for cPanel
# This script creates a production-ready package for deployment

echo "🚀 Creating deployment package for cPanel..."

# Variables
PACKAGE_NAME="portonew-production-$(date +%Y%m%d-%H%M%S)"
PACKAGE_DIR="deployment-package"
ARCHIVE_NAME="${PACKAGE_NAME}.tar.gz"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Clean previous package if exists
if [ -d "$PACKAGE_DIR" ]; then
    echo -e "${YELLOW}Removing old package directory...${NC}"
    rm -rf "$PACKAGE_DIR"
fi

# Create package directory
echo -e "${BLUE}Creating package directory...${NC}"
mkdir -p "$PACKAGE_DIR"

# Build the project
echo -e "${BLUE}Building production files...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Build failed! Exiting...${NC}"
    exit 1
fi

# Ask if user wants to include node_modules (for shared hosting)
echo ""
read -p "Include node_modules in package? (Recommended for shared hosting with memory limits) (y/n) " -n 1 -r
echo ""
INCLUDE_NODE_MODULES=$REPLY

# Install production dependencies if including node_modules
if [[ $INCLUDE_NODE_MODULES =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Installing production dependencies...${NC}"
    npm install --omit=dev
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}npm install failed! Continuing anyway...${NC}"
    fi
fi

# Copy necessary files
echo -e "${BLUE}Copying files to package...${NC}"

# Copy dist folder
cp -r dist "$PACKAGE_DIR/"

# Copy node_modules if requested
if [[ $INCLUDE_NODE_MODULES =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Copying node_modules (this may take a while)...${NC}"
    cp -r node_modules "$PACKAGE_DIR/"
fi

# Copy server and config files
cp server.js "$PACKAGE_DIR/"
cp package.json "$PACKAGE_DIR/"
cp package-lock.json "$PACKAGE_DIR/"

# Copy environment example
# cp .env.example "$PACKAGE_DIR/"

# Copy documentation
cp DEPLOY.md "$PACKAGE_DIR/"
cp DEPLOYMENT_CHECKLIST.md "$PACKAGE_DIR/"
cp README.md "$PACKAGE_DIR/"

# Copy database schema
cp database.sql "$PACKAGE_DIR/"

# Create installation instructions
cat > "$PACKAGE_DIR/INSTALL.txt" << 'EOF'
╔═══════════════════════════════════════════════════════════════╗
║         INSTALASI PORTFOLIO FAHMYZZX - CPANEL                 ║
╔═══════════════════════════════════════════════════════════════╗

📋 LANGKAH-LANGKAH INSTALASI:

1. UPLOAD FILES
   ✓ Login ke cPanel File Manager
   ✓ Buat folder baru (contoh: "portfolio")
   ✓ Upload semua file dari package ini ke folder tersebut
   ✓ Extract jika dalam bentuk zip/tar.gz

2. SETUP DATABASE (Opsional - untuk TinaCMS self-hosted)
   ✓ Buka "MySQL Databases" di cPanel
   ✓ Buat database baru (contoh: portfolio_db)
   ✓ Buat user baru dan set password
   ✓ Tambahkan user ke database dengan ALL PRIVILEGES
   ✓ Buka phpMyAdmin
   ✓ Pilih database yang baru dibuat
   ✓ Import file "database.sql"

3. KONFIGURASI ENVIRONMENT
   ✓ Rename ".env.example" menjadi ".env"
   ✓ Edit file .env:
     - PORT=3000
     - SITE_URL=https://yourdomain.com
     - DB_NAME=portfolio_db (nama database Anda)
     - DB_USER=portfolio_user (user database Anda)
     - DB_PASSWORD=your_password (password database Anda)

4. SETUP NODE.JS APPLICATION
   ✓ Buka "Setup Node.js App" di cPanel
   ✓ Klik "Create Application"
   ✓ Isi form:
     - Node.js Version: 18.x atau lebih baru
     - Application Mode: Production
     - Application Root: /home/username/portfolio (sesuaikan)
     - Application URL: pilih domain Anda
     - Application Startup File: server.js
   ✓ Klik "Create"

5. INSTALL DEPENDENCIES
   ✓ Setelah aplikasi dibuat, scroll ke bawah
   ✓ Klik "Run NPM Install"
   ✓ Tunggu sampai selesai (bisa 2-5 menit)
   
   ATAU via SSH:
   $ cd /home/username/portfolio
   $ npm install --production

6. START APPLICATION
   ✓ Klik tombol "Restart" atau "Start"
   ✓ Buka website Anda di browser
   ✓ Website sudah live! 🎉

═══════════════════════════════════════════════════════════════

📝 CATATAN PENTING:

• JANGAN upload folder "node_modules" - akan diinstall otomatis
• JANGAN upload folder "src" - tidak diperlukan di production
• Pastikan Node.js version minimal 18.x
• Untuk TinaCMS tanpa database, skip langkah 2
• Default admin password di database.sql: "admin123" 
  ⚠️ WAJIB DIGANTI setelah instalasi!

═══════════════════════════════════════════════════════════════

🔧 TROUBLESHOOTING:

Q: Aplikasi tidak mau start?
A: Cek error log di cPanel Node.js App, pastikan semua 
   environment variables sudah benar

Q: Database connection error?
A: Pastikan DB_HOST, DB_NAME, DB_USER, DB_PASSWORD benar
   di file .env

Q: Port sudah digunakan?
A: Ganti PORT di .env ke nomor lain (contoh: 3001)

Q: SEO meta tags tidak muncul?
A: Pastikan mengakses via URL bersih: /article/slug
   bukan article.html?id=slug

═══════════════════════════════════════════════════════════════

📞 SUPPORT:

Email: mbahicbear@gmail.com
Telegram: @iCBear
GitHub: github.com/FAHMYZAR

═══════════════════════════════════════════════════════════════

✨ FITUR YANG SUDAH AKTIF:

✓ Responsive Design (Mobile, Tablet, Desktop)
✓ Blog System dengan Markdown
✓ SEO Optimized (Open Graph, Twitter Cards)
✓ Server-Side Rendering untuk artikel
✓ Image Gallery dengan lazy loading
✓ Comment System (localStorage)
✓ Article View Tracking
✓ Verified Badge untuk author
✓ Clean URLs (/article/slug)

═══════════════════════════════════════════════════════════════

Made with ❤️ by Nuriskha Ainun Fahmi (@fahmyzzx)
EOF

# Create archive
echo -e "${BLUE}Creating compressed archive...${NC}"
tar -czf "$ARCHIVE_NAME" -C "$PACKAGE_DIR" .

# Get file size
FILE_SIZE=$(du -h "$ARCHIVE_NAME" | cut -f1)

# Success message
echo -e "${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         DEPLOYMENT PACKAGE CREATED!                   ║${NC}"
echo -e "${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║${NC}"
echo -e "${GREEN}║${NC} 📦 Package: ${BLUE}$ARCHIVE_NAME${NC}"
echo -e "${GREEN}║${NC} 📊 Size: ${BLUE}$FILE_SIZE${NC}"
echo -e "${GREEN}║${NC} 📁 Location: ${BLUE}$(pwd)/$ARCHIVE_NAME${NC}"
echo -e "${GREEN}║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo -e "  1. Upload ${BLUE}$ARCHIVE_NAME${NC} to your cPanel"
echo -e "  2. Extract the archive"
echo -e "  3. Follow instructions in ${BLUE}INSTALL.txt${NC}"
echo ""
echo -e "${GREEN}✨ Ready for deployment!${NC}"

# Optional: Clean up package directory
read -p "Do you want to keep the uncompressed package directory? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    rm -rf "$PACKAGE_DIR"
    echo -e "${BLUE}Cleaned up package directory.${NC}"
fi
