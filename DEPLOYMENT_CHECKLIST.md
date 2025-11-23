# Quick Deployment Checklist

## ✅ Pre-Deployment

- [x] Blue checkmark added to author names
- [x] SEO meta tags (Open Graph, Twitter Cards) implemented
- [x] Server-side rendering for article pages configured
- [x] Production build script configured
- [x] Express server created (`server.js`)
- [x] Environment variables example created (`.env.example`)

## 📦 Files to Upload to cPanel

Upload these files/folders to your hosting:

```
dist/                  # Built static files (after running npm run build)
server.js             # Production server
package.json          # Dependencies list
package-lock.json     # Locked dependency versions
.env                  # Your environment variables (create from .env.example)
```

**DO NOT upload:**
- `node_modules/` (will be installed on server)
- `src/` (source files, not needed in production)
- `.git/` (version control)

## 🔧 cPanel Setup Steps

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Upload files** via File Manager or FTP

3. **Setup Node.js App** in cPanel:
   - Application Root: `/home/username/portfolio` (your folder)
   - Application Startup File: `server.js`
   - Node.js Version: 18.x or higher

4. **Install dependencies:**
   - Click "Run NPM Install" in cPanel
   - OR via SSH: `npm install --production`

5. **Set environment variables** in cPanel Node.js App settings:
   - `PORT=3000`
   - `SITE_URL=https://yourdomain.com`

6. **Start the application**

## 🎯 Post-Deployment

- Test all pages (Home, Blog, Articles)
- Verify SEO meta tags with "View Page Source"
- Test social media sharing (Facebook, Twitter, LinkedIn)
- Check mobile responsiveness

## 🔐 TinaCMS Note

Current setup uses **local/file-based** TinaCMS. For production content editing:

**Option 1: Git-based workflow (Recommended)**
- Edit content locally
- Commit and push to Git
- Rebuild and redeploy

**Option 2: TinaCMS Cloud**
- Sign up at tina.io
- Add credentials to `.env`
- Use `npm run build:tina`

**Option 3: Self-hosted database** (Advanced)
- Requires MySQL/PostgreSQL setup
- See TinaCMS self-hosted docs
- Not recommended for cPanel shared hosting

## ✨ Features Implemented

- ✅ Responsive design with Tailwind CSS v4
- ✅ Blog system with Markdown support
- ✅ SEO-optimized with comprehensive meta tags
- ✅ Server-side rendering for better indexing
- ✅ Image gallery with lazy loading
- ✅ Comment system (localStorage-based)
- ✅ Article view tracking
- ✅ Verified badge for authors
- ✅ Clean URLs (`/article/slug`)
