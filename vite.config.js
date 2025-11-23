import { defineConfig } from 'vite';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import { marked } from 'marked';
import yaml from 'js-yaml';

export default defineConfig({
    root: resolve(__dirname, 'src/views'),
    publicDir: resolve(__dirname, 'public'),
    plugins: [
        tailwindcss(),
        react(),
        {
            name: 'article-seo-middleware',
            configureServer(server) {
                server.middlewares.use(async (req, res, next) => {
                    if (req.url.startsWith('/article/')) {
                        const slug = req.url.split('/').pop();
                        const mdPath = resolve(__dirname, 'src/content/blog', `${slug}.md`);

                        if (fs.existsSync(mdPath)) {
                            try {
                                const fileContent = fs.readFileSync(mdPath, 'utf-8');
                                // Parse Frontmatter
                                const parts = fileContent.split('---');
                                const frontmatter = parts[1] ? yaml.load(parts[1]) : {};
                                const content = parts.slice(2).join('---');
                                const htmlContent = marked.parse(content);

                                // Read Template
                                let template = fs.readFileSync(resolve(__dirname, 'src/views/article.html'), 'utf-8');

                                // Inject Data using Markers (Robust)
                                template = template.replace('<!-- SSR_TITLE -->', frontmatter.title || '');
                                template = template.replace('<!-- SSR_EXCERPT -->', frontmatter.excerpt || '');
                                template = template.replace('<!-- SSR_BODY -->', htmlContent || '');

                                // Make Visible
                                template = template.replace('class="hidden"><!-- SSR_VISIBLE -->', 'class="">');

                                // --- POWERFUL SEO INJECTION ---
                                const domain = `http://${req.headers.host}`; // Auto-detect host for absolute URLs
                                const url = `${domain}${req.url}`;
                                const title = `${frontmatter.title} - Fahmyzzx Web`;
                                const desc = frontmatter.excerpt || frontmatter.title;
                                const image = (frontmatter.image || frontmatter.image_url)
                                    ? (frontmatter.image?.startsWith('http') ? frontmatter.image : `${domain}${frontmatter.image}`)
                                    : `${domain}/assets/images/default-og.jpg`; // Fallback image
                                const author = "Nuriskha Ainun Fahmi";
                                const keywords = frontmatter.tags ? frontmatter.tags.split(',').join(', ') : "blog, programming, tutorial";
                                const date = frontmatter.date ? new Date(frontmatter.date).toISOString() : new Date().toISOString();

                                const seoTags = `
    <!-- Primary Meta Tags -->
    <title>${title}</title>
    <meta name="title" content="${title}">
    <meta name="description" content="${desc}">
    <meta name="keywords" content="${keywords}">
    <meta name="author" content="${author}">
    <link rel="canonical" href="${url}">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${desc}">
    <meta property="og:image" content="${image}">
    <meta property="og:site_name" content="Fahmyzzx Web">
    <meta property="article:published_time" content="${date}">
    <meta property="article:author" content="${author}">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${url}">
    <meta property="twitter:title" content="${title}">
    <meta property="twitter:description" content="${desc}">
    <meta property="twitter:image" content="${image}">
                                `;

                                template = template.replace('<!-- SSR_META -->', seoTags);

                                // Clean up default title if it exists (since we added a new one)
                                template = template.replace('<title>Artikel - Fahmyzzx Web</title>', '');

                                // Inject Image into Body (if marker exists, or fallback to regex if marker missing)
                                if (frontmatter.image || frontmatter.image_url) {
                                    const imgUrl = frontmatter.image || frontmatter.image_url;
                                    // Try to replace src in the image tag
                                    template = template.replace(
                                        '<img id="article-image" src="" alt="" class="w-full h-full object-cover">',
                                        `<img id="article-image" src="${imgUrl}" alt="${frontmatter.title}" class="w-full h-full object-cover">`
                                    );
                                }

                                // Transform with Vite (injects scripts, HMR, etc)
                                const html = await server.transformIndexHtml(req.url, template);

                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'text/html');
                                res.end(html);
                                return;
                            } catch (e) {
                                console.error('Error serving article:', e);
                                next();
                            }
                        } else {
                            next();
                        }
                    } else {
                        next();
                    }
                });
            }
        },
        {
            name: 'watch-content',
            configureServer(server) {
                server.watcher.add(resolve(__dirname, 'src/content'));
                server.watcher.on('change', (path) => {
                    if (path.includes('src/content')) {
                        server.ws.send({ type: 'full-reload' });
                    }
                });
                server.watcher.on('add', (path) => {
                    if (path.includes('src/content')) {
                        server.ws.send({ type: 'full-reload' });
                    }
                });
            }
        }
    ],
    build: {
        outDir: resolve(__dirname, 'dist'),
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/views/index.html'),
                blogs: resolve(__dirname, 'src/views/blogs.html'),
                article: resolve(__dirname, 'src/views/article.html'),
            }
        },
        // Copy TinaCMS admin assets
        copyPublicDir: true,
    },
    server: {
        port: 5173,
        open: true,
        fs: {
            allow: ['..'] // Allow serving files from project root
        },
        watch: {
            // Watch content directory for changes
            ignored: ['!**/src/content/**']
        }
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '/styles': resolve(__dirname, 'src/styles'),
            '/scripts': resolve(__dirname, 'src/scripts'),
        }
    }
});
