# Fahmyzzx Portfolio Website

Modern, responsive portfolio website built with Vite, Tailwind CSS, and TinaCMS.

## 🚀 Project Structure

```
portonew/
├── public/                    # Static assets
│   └── assets/
│       ├── images/           # All images (organized)
│       │   ├── profile/     # Profile photos
│       │   ├── gallery/     # Gallery images
│       │   └── blog/        # Blog post images
│       └── icons/           # Icons & logos
│
├── src/                      # Source code
│   ├── views/               # HTML pages
│   │   ├── index.html       # Home page
│   │   ├── blogs.html       # Blog listing page
│   │   └── article.html     # Article detail page
│   │
│   ├── styles/              # CSS files
│   │   └── main.css         # Main Tailwind entry point
│   │
│   ├── scripts/             # JavaScript modules
│   │   ├── common.js        # Shared functionality
│   │   ├── utils.js         # Helper functions
│   │   └── pages/          # Page-specific scripts
│   │       ├── home.js
│   │       ├── blogs.js
│   │       └── article.js
│   │
│   └── content/             # Content files (managed by TinaCMS)
│       ├── blog/            # Blog posts (Markdown)
│       └── gallery/         # Gallery items (JSON)
│
├── admin/                    # TinaCMS admin panel
├── tina/                     # TinaCMS configuration
└── dist/                     # Production build (auto-generated)
```

## 📦 Tech Stack

- **Build Tool**: Vite
- **CSS Framework**: Tailwind CSS v4
- **CMS**: TinaCMS
- **JavaScript**: ES6+ Modules
- **Content**: Markdown (blog posts) + JSON (gallery)

## 🛠️ Development

### Prerequisites
- Node.js >= 16.x
- npm >= 8.x

### Installation

```bash
# Install dependencies
npm install
```

### Development Commands

```bash
# Start dev server (http://localhost:5173)
npm run dev

# Start dev server with TinaCMS admin
npm run tina:dev

# Build for production
npm run build

# Preview production build
npm run preview

# Build with TinaCMS
npm run tina:build
```

## 🗂️ Key Features

- ✅ **Modern Folder Structure**: Clean, organized, and scalable
- ✅ **Hot Module Replacement (HMR)**: Instant updates during development
- ✅ **Content Management**: TinaCMS for easy content editing
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **SEO Optimized**: Auto-generated meta tags
- ✅ **Comment System**: LocalStorage-based commenting
- ✅ **Production Ready**: Optimized builds with Vite

## 📝 Content Management

### Add New Blog Post

1. Start TinaCMS admin: `npm run tina:dev`
2. Navigate to `/admin`
3. Login and create new post
4. Content saved in `content/blog/`

### Add Gallery Item

1. Access TinaCMS admin
2. Go to Gallery collection
3. Add new item with image and tags
4. Content saved in `content/gallery/`

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

For detailed deployment instructions to cPanel or other hosting platforms, see [DEPLOY.md](DEPLOY.md).

### Quick Production Build

```bash
npm run build
```

This creates a `dist/` folder with your optimized static files.

### Running Production Server Locally

```bash
npm start
```

This starts the Express server on port 3000 serving the built files.

## 📝 License

MIT License - feel free to use this project for your own portfolio!

---

Made with ❤️ by Nuriskha Ainun Fahmi (@fahmyzzx) 
**Portfolio**: [https://fahmyzzx.com](https://fahmyzzx.my.id)
