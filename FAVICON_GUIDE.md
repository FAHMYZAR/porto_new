# Favicon Setup Guide

## 📝 Cara Menambahkan Favicon Anda Sendiri:

### 1. Buat Favicon
Gunakan salah satu tool online ini:
- https://favicon.io/ (Recommended - bisa dari text/emoji/image)
- https://realfavicongenerator.net/ (Advanced - semua platform)

### 2. Generate Files
Tool akan menghasilkan beberapa file:
- `favicon.ico` (16x16, 32x32)
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` (180x180)
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`

### 3. Upload ke Folder `public/`
```
public/
├── favicon.ico
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
├── android-chrome-192x192.png
└── android-chrome-512x512.png
```

### 4. Build & Deploy
```bash
npm run build
```

File favicon otomatis ter-copy ke `dist/` saat build.

## ✅ Sudah Ditambahkan di:
- ✓ `index.html` (Home)
- ✓ `blogs.html` (Blog List)
- ✓ `article.html` (Article Page)

## 🎨 Tips Desain Favicon:
- Gunakan logo/inisial Anda
- Warna kontras agar terlihat di berbagai background
- Simple & recognizable (icon kecil 16x16px)
- Test di light & dark mode browser

## 📱 Favicon akan muncul di:
- Browser tab
- Bookmark
- Mobile home screen (jika di-add to home)
- Search engine results (Google, Bing)
