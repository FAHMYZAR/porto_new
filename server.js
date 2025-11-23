import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Helper function to parse markdown frontmatter
function parseFrontmatter(content) {
    const parts = content.split('---');
    if (parts.length < 3) return { frontmatter: {}, body: content };

    const frontmatterText = parts[1];
    const body = parts.slice(2).join('---');
    const frontmatter = {};

    frontmatterText.split('\n').forEach(line => {
        const match = line.match(/^(\w+):\s*(.+)$/);
        if (match) {
            frontmatter[match[1]] = match[2].replace(/^["']|["']$/g, '');
        }
    });

    return { frontmatter, body };
}

// Serve static files from the 'dist' directory (Vite build output)
app.use(express.static(path.join(__dirname, 'dist')));

// SSR Middleware for article pages with clean URLs
app.get('/article/:slug', (req, res) => {
    const slug = req.params.slug;
    const mdPath = path.join(__dirname, 'src', 'content', 'blog', `${slug}.md`);
    const htmlPath = path.join(__dirname, 'dist', 'article.html');

    // Check if markdown file exists
    if (!fs.existsSync(mdPath)) {
        return res.sendFile(htmlPath); // Fallback to client-side rendering
    }

    try {
        // Read markdown file
        const mdContent = fs.readFileSync(mdPath, 'utf-8');
        const { frontmatter } = parseFrontmatter(mdContent);

        // Read HTML template
        let html = fs.readFileSync(htmlPath, 'utf-8');

        // Build SEO meta tags
        const domain = `${req.protocol}://${req.get('host')}`;
        const url = `${domain}${req.url}`;
        const title = `${frontmatter.title || slug} - Fahmyzzx Web`;
        const desc = frontmatter.excerpt || frontmatter.title || '';
        const image = (frontmatter.image || frontmatter.image_url)
            ? (frontmatter.image?.startsWith('http') ? frontmatter.image : `${domain}${frontmatter.image}`)
            : `${domain}/assets/images/default-og.jpg`;
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

        // Inject SEO tags
        html = html.replace('<!-- SSR_META -->', seoTags);

        // Remove default title
        html = html.replace('<title>Artikel - Fahmyzzx Web</title>', '');

        res.send(html);
    } catch (error) {
        console.error('SSR Error:', error);
        res.sendFile(htmlPath); // Fallback to client-side rendering
    }
});

// Route for blogs page
app.get('/blogs', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'blogs.html'));
});

// Route for home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 404 handler - if no route matches, send 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
