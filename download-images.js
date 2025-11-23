const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

const CONTENT_DIR = path.join(__dirname, 'src/content/blog');
const IMAGE_DIR = path.join(__dirname, 'public/assets/images/blog');

// Ensure image directory exists
if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

// Helper to download image
function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                const file = fs.createWriteStream(filepath);
                res.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve(true);
                });
            } else {
                reject(new Error(`Status code: ${res.statusCode}`));
            }
        }).on('error', (err) => {
            reject(err);
        });
    });
}

// Helper to parse frontmatter
function parseFrontmatter(content) {
    const match = content.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]*([\s\S]*)$/);
    if (!match) return null;
    return { frontmatter: match[1], body: match[2] };
}

async function processFiles() {
    const files = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.md'));

    console.log(`Found ${files.length} markdown files.`);

    for (const file of files) {
        const filePath = path.join(CONTENT_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const parsed = parseFrontmatter(content);

        if (!parsed) continue;

        let frontmatter = parsed.frontmatter;
        let needsUpdate = false;

        // Extract image_url
        const imageUrlMatch = frontmatter.match(/image_url:\s*['"]?(https?:\/\/[^'"\n]+)['"]?/);
        const imageMatch = frontmatter.match(/image:\s*['"]?([^'"\n]+)['"]?/);

        if (imageUrlMatch) {
            const imageUrl = imageUrlMatch[1];
            const currentImage = imageMatch ? imageMatch[1] : '';

            // Check if we need to download
            // If image is empty, OR image is local but file doesn't exist
            let shouldDownload = false;
            if (!currentImage || currentImage.trim() === '') {
                shouldDownload = true;
            } else if (currentImage.startsWith('/assets/')) {
                const localPath = path.join(__dirname, 'public', currentImage);
                if (!fs.existsSync(localPath)) {
                    shouldDownload = true;
                }
            }

            if (shouldDownload) {
                console.log(`Downloading image for ${file}: ${imageUrl}`);

                try {
                    // Generate filename from URL or slug
                    const urlObj = new URL(imageUrl);
                    const ext = path.extname(urlObj.pathname) || '.jpg';
                    const slug = file.replace('.md', '');
                    const filename = `${slug}${ext}`;
                    const savePath = path.join(IMAGE_DIR, filename);
                    const publicPath = `/assets/images/blog/${filename}`;

                    // Check duplicate/replace logic
                    if (fs.existsSync(savePath)) {
                        console.log(`  File ${filename} exists. Overwriting...`);
                    }

                    await downloadImage(imageUrl, savePath);
                    console.log(`  Saved to ${savePath}`);

                    // Update frontmatter
                    // Replace or add image field
                    if (frontmatter.includes('image:')) {
                        frontmatter = frontmatter.replace(/image:\s*.*/, `image: ${publicPath}`);
                    } else {
                        frontmatter += `\nimage: ${publicPath}`;
                    }

                    needsUpdate = true;
                } catch (error) {
                    console.error(`  Failed to download: ${error.message}`);
                }
            }
        }

        if (needsUpdate) {
            const newContent = `---\n${frontmatter}\n---\n${parsed.body}`;
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`  Updated ${file}`);
        }
    }
}

processFiles().catch(console.error);
