import { initCommon, setupAnimations } from '../common.js';
import { getPost, getAllPosts } from '../utils.js';
import { marked } from 'marked';

// Initialize common functionality
initCommon();

// Observe related articles cards with stagger
function observeRelatedCards() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('#related-articles-container > div').forEach((card, index) => {
        card.classList.add('fade-in');
        if (index % 2 === 1) card.classList.add('fade-in-delay-1');
        observer.observe(card);
    });
}


// Load Article
async function loadArticle() {
    const params = new URLSearchParams(window.location.search);
    let articleId = params.get('id');

    // Support clean URL /article/slug
    if (!articleId) {
        const path = window.location.pathname;
        const match = path.match(/\/article\/([^\/]+)/);
        if (match) {
            articleId = match[1];
        }
    }

    if (!articleId) {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('error-message').classList.remove('hidden');
        return;
    }

    // Check if content is already pre-rendered (SEO/SSR)
    const contentContainer = document.getElementById('article-content-text');
    // Ensure content is not just the SSR marker
    const hasContent = contentContainer &&
        contentContainer.innerHTML.trim().length > 0 &&
        !contentContainer.innerHTML.includes('<!-- SSR_BODY -->');

    if (hasContent) {
        // Content exists, just hydrate (setup comments, etc)
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('article-content').classList.remove('hidden');

        // Setup comments
        loadComments(articleId);
        setupCommentForm(articleId);

        // Track views
        try {
            const views = JSON.parse(localStorage.getItem('articleViews') || '{}');
            views[articleId] = (views[articleId] || 0) + 1;
            localStorage.setItem('articleViews', JSON.stringify(views));
        } catch (e) { console.error(e); }

        return;
    }

    try {
        console.warn('DEBUG: Loading article ID:', articleId);
        const article = await getPost(articleId);
        console.warn('DEBUG: Found article:', article);

        if (!article) {
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('error-message').classList.remove('hidden');
            return;
        }

        // Auto SEO
        document.title = `${article.title} - Fahmyzzx Web`;
        document.querySelector('meta[name="description"]')?.setAttribute('content', article.excerpt || article.title);

        // Track Views (Local Storage)
        try {
            const views = JSON.parse(localStorage.getItem('articleViews') || '{}');
            views[articleId] = (views[articleId] || 0) + 1;
            localStorage.setItem('articleViews', JSON.stringify(views));
            console.log(`View count for ${articleId}: ${views[articleId]}`);
        } catch (e) {
            console.error('Error updating view count:', e);
        }

        // Generate keywords from tags
        const keywords = article.tags ? (Array.isArray(article.tags) ? article.tags.join(', ') : article.tags) : '';
        let keywordsMeta = document.querySelector('meta[name="keywords"]');
        if (!keywordsMeta) {
            keywordsMeta = document.createElement('meta');
            keywordsMeta.name = 'keywords';
            document.head.appendChild(keywordsMeta);
        }
        keywordsMeta.setAttribute('content', keywords);

        // Update DOM elements
        // Populate content
        document.getElementById('article-category').textContent = article.category || 'Blog';
        document.getElementById('article-title').textContent = article.title;

        // Author with Verified Badge
        const authorEl = document.getElementById('article-author');
        authorEl.innerHTML = `
            ${article.author || 'Admin'}
            <svg class="w-4 h-4 text-blue-500 inline-block ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10.602 3.008c-1.082-.496-2.35 0-2.88 1.053l-.56 1.11a1.003 1.003 0 0 1-1.175.487l-1.21-.36c-1.163-.346-2.333.34-2.618 1.503l-.285 1.16a1.003 1.003 0 0 1-.908.76l-1.25.13c-1.198.124-1.95 1.257-1.66 2.41l.3 1.18a1.003 1.003 0 0 1-.36 1.13l-1.02.83c-.96.78-.96 2.27 0 3.05l1.02.83a1.003 1.003 0 0 1 .36 1.13l-.3 1.18c-.29 1.153.462 2.286 1.66 2.41l1.25.13c.428.044.808.32.908.76l.285 1.16c.285 1.163 1.455 1.85 2.618 1.503l1.21-.36a1.003 1.003 0 0 1 1.175.487l.56 1.11c.53 1.053 1.798 1.549 2.88 1.053l1.13-.52c.39-.18.84-.18 1.23 0l1.13.52c1.082.496 2.35 0 2.88-1.053l.56-1.11a1.003 1.003 0 0 1 1.175-.487l1.21.36c1.163.346 2.333-.34 2.618-1.503l.285-1.16a1.003 1.003 0 0 1 .908-.76l1.25-.13c1.198-.124 1.95-1.257 1.66-2.41l-.3-1.18a1.003 1.003 0 0 1 .36-1.13l1.02-.83c.96-.78.96-2.27 0-3.05l-1.02-.83a1.003 1.003 0 0 1-.36-1.13l.3-1.18c.29-1.153-.462-2.286-1.66-2.41l-1.25-.13a1.003 1.003 0 0 1-.908-.76l-.285-1.16c-.285-1.163-1.455-1.85-2.618-1.503l-1.21.36a1.003 1.003 0 0 1-1.175-.487l-.56-1.11c-.53-1.053-1.798-1.549-2.88-1.053l-1.13.52a1.003 1.003 0 0 1-1.23 0l-1.13-.52Z" />
                <path fill="#fff" d="m9.09 13.04 1.83 1.83 4.24-4.24-1.41-1.41-2.83 2.83-1.42-1.42-1.41 1.41Z"/>
            </svg>
        `;

        document.getElementById('article-excerpt').textContent = article.excerpt || '';

        const date = new Date(article.date).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('article-date').textContent = date;
        document.getElementById('article-author').textContent = article.author || 'Admin';

        // Render Markdown Content
        const contentText = document.getElementById('article-content-text');

        // Use marked for robust markdown rendering
        if (article.body && article.body.children) {
            // If TinaCMS returns rich text JSON, we might need a different parser or convert it to markdown first.
            // But usually for "markdown" collections, it returns raw markdown in `article.body` if configured as such,
            // OR `article.content` (from our utils.js parser).
            // Our utils.js parser returns `content` as the raw string.
            // So we should prefer `article.content`.
            contentText.innerHTML = marked.parse(article.content || '');
        } else {
            // Raw markdown
            const rawContent = article.content || '';
            // Configure marked to handle images with base path if needed (optional)
            contentText.innerHTML = marked.parse(rawContent);
        }

        // Image handling with fallback
        const imgEl = document.getElementById('article-image');
        const placeholder = 'https://placehold.co/800x400';

        // Logic: Try local image -> Try external URL -> Use placeholder
        if (article.image) {
            imgEl.src = article.image;
            imgEl.onerror = () => {
                console.warn('Local image failed, trying external URL...');
                if (article.image_url) {
                    imgEl.src = article.image_url;
                    imgEl.onerror = () => { imgEl.src = placeholder; };
                } else {
                    imgEl.src = placeholder;
                }
            };
        } else if (article.image_url) {
            imgEl.src = article.image_url;
            imgEl.onerror = () => { imgEl.src = placeholder; };
        } else {
            imgEl.src = placeholder;
        }

        imgEl.alt = article.title;

        // Populate tags
        const tagsContainer = document.getElementById('tags-container');
        if (article.tags) {
            const tagsList = Array.isArray(article.tags) ? article.tags : article.tags.split(',').map(t => t.trim());
            tagsContainer.innerHTML = tagsList.map(tag =>
                `<span class="inline-block px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full hover:bg-primary/20 transition-colors">${tag}</span>`
            ).join('');
        }

        // Load related articles
        const allPosts = getAllPosts();
        loadRelatedArticles(allPosts, articleId);

        // Load Comments
        loadComments(articleId);
        setupCommentForm(articleId);

        // Hide loading, show content
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('article-content').classList.remove('hidden');

        // Trigger fade-in animation for article content
        setTimeout(() => {
            document.querySelector('#article-content .fade-in')?.classList.add('visible');
        }, 100);

    } catch (error) {
        console.error('Error loading article:', error);
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('error-message').classList.remove('hidden');
    }
}

// Load Related Articles
function loadRelatedArticles(articles, currentArticleId) {
    // Filter out current article and get 2 random related articles
    const relatedArticles = articles
        .filter(a => a.id !== currentArticleId)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

    const relatedContainer = document.getElementById('related-articles-container');

    if (relatedArticles.length === 0) {
        document.getElementById('related-articles').classList.add('hidden');
        return;
    }

    relatedContainer.innerHTML = relatedArticles.map(relatedArticle => {
        const date = new Date(relatedArticle.date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const image = relatedArticle.image || relatedArticle.image_url || 'https://placehold.co/400x250';

        return `
            <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div class="h-48 bg-cover bg-center" style="background-image: url('${image}'); background-color: #14b8a6;">
                    <div class="h-full bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                        <span class="text-white text-xs font-semibold bg-primary px-3 py-1 rounded-full">${relatedArticle.category}</span>
                    </div>
                </div>
                <div class="p-5 md:p-6">
                    <h4 class="font-bold text-dark text-base md:text-lg mb-2 line-clamp-2 leading-tight">${relatedArticle.title}</h4>
                    <p class="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">${relatedArticle.excerpt}</p>
                    <div class="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span class="text-xs text-slate-500">${date}</span>
                        <a href="article.html?id=${relatedArticle.id}" class="text-primary font-semibold text-sm hover:underline flex items-center gap-1">
                            Baca <span>→</span>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Observe related cards after they're loaded
    setTimeout(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('#related-articles-container > div').forEach(card => {
            card.classList.add('fade-in');
            observer.observe(card);
        });
    }, 100);
}

// Comments System
function loadComments(articleId) {
    const commentsContainer = document.getElementById('comments-list');
    const comments = JSON.parse(localStorage.getItem(`comments_${articleId}`)) || [];

    document.getElementById('comments-count').textContent = `${comments.length} Komentar`;

    if (comments.length === 0) {
        commentsContainer.innerHTML = '<p class="text-slate-500 text-sm italic">Belum ada komentar. Jadilah yang pertama berkomentar!</p>';
        return;
    }

    commentsContainer.innerHTML = comments.map(comment => `
        <div class="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div class="flex items-center justify-between mb-2">
                <h5 class="font-bold text-dark text-sm">${escapeHtml(comment.name)}</h5>
                <span class="text-xs text-slate-400">${new Date(comment.date).toLocaleDateString()}</span>
            </div>
            <p class="text-slate-600 text-sm">${escapeHtml(comment.text)}</p>
        </div>
    `).join('');
}

function setupCommentForm(articleId) {
    const form = document.getElementById('comment-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('comment-name');
        const textInput = document.getElementById('comment-text');

        const name = nameInput.value.trim();
        const text = textInput.value.trim();

        if (!name || !text) return;

        const newComment = {
            name,
            text,
            date: new Date().toISOString()
        };

        const comments = JSON.parse(localStorage.getItem(`comments_${articleId}`)) || [];
        comments.unshift(newComment); // Add to top
        localStorage.setItem(`comments_${articleId}`, JSON.stringify(comments));

        // Reset form
        nameInput.value = '';
        textInput.value = '';

        // Reload comments
        loadComments(articleId);

        // Show success feedback (optional)
        alert('Komentar berhasil dikirim!');
    });
}

// Security: Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Load article on page load
document.addEventListener('DOMContentLoaded', () => {
    loadArticle();
});
