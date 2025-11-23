import yaml from 'js-yaml';

// Robust frontmatter parser using js-yaml
function parseFrontmatter(text) {
    const frontmatterRegex = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]*([\s\S]*)$/;
    const match = text.match(frontmatterRegex);

    if (!match) {
        return { content: text };
    }

    try {
        const frontmatter = yaml.load(match[1]);
        return { ...frontmatter, content: match[2].trim() };
    } catch (e) {
        console.error('Error parsing frontmatter:', e);
        return { content: match[2].trim() };
    }
}

export function getAllPosts() {
    const modules = import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default', eager: true });
    const posts = [];
    console.warn('DEBUG: All blog modules found:', Object.keys(modules));


    for (const path in modules) {
        const markdown = modules[path];
        const post = parseFrontmatter(markdown);

        // Add slug/id based on filename
        const slug = path.split('/').pop().replace('.md', '');

        // Ensure tags is an array
        let tags = post.tags || [];
        if (typeof tags === 'string') {
            tags = tags.split(',').map(tag => tag.trim());
        } else if (!Array.isArray(tags)) {
            tags = [];
        }

        // Fix image paths to use new assets folder
        let image = post.image || '';
        if (image.includes('dist/img/galeri/')) {
            image = image.replace(/.*dist\/img\/galeri\//, '/assets/images/gallery/');
        } else if (image.includes('dist/img/')) {
            image = image.replace(/.*dist\/img\//, '/assets/images/gallery/');
        }

        posts.push({ ...post, tags, image, id: slug, slug });
    }
    console.warn('DEBUG: Parsed posts slugs:', posts.map(p => p.slug));

    // Filter out posts without title or valid date
    return posts
        .filter(p => p.title && p.date)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getAllGalleryItems() {
    const modules = import.meta.glob('../content/gallery/*.json', { import: 'default', eager: true });
    const items = [];

    for (const path in modules) {
        const item = modules[path];
        // Handle comma-separated tags
        if (typeof item.tags === 'string') {
            item.tags = item.tags.split(',').map(tag => tag.trim());
        }

        // Fix image paths
        let image = item.image || '';
        if (image.includes('dist/img/galeri/')) {
            image = image.replace(/.*dist\/img\/galeri\//, '/assets/images/gallery/');
        } else if (image.includes('dist/img/')) {
            image = image.replace(/.*dist\/img\//, '/assets/images/gallery/');
        }
        item.image = image;

        items.push(item);
    }

    return items;
}

export async function getPost(slug) {
    try {
        const posts = getAllPosts();
        return posts.find(p => p.slug === slug);
    } catch (e) {
        console.error('Error getting post:', e);
        return null;
    }
}
