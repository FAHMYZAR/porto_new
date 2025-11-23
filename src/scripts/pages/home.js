import { initCommon, setupAnimations } from '../common.js';
import { getAllPosts, getAllGalleryItems } from '../utils.js';

// Initialize common functionality
initCommon();

// Observe gallery and blog cards with stagger effect
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
        }
    });
}, observerOptions);

// Observe cards after they're loaded
function observeCards() {
    document.querySelectorAll('#gallery-container > div, #blog-container > div').forEach((card, index) => {
        card.classList.add('fade-in');
        if (index % 3 === 1) card.classList.add('fade-in-delay-1');
        if (index % 3 === 2) card.classList.add('fade-in-delay-2');
        cardObserver.observe(card);
    });
}

// Load Blog Posts from Markdown
// Load Blog Posts from Markdown
async function loadBlogPosts() {
    const articles = getAllPosts();
    const blogContainer = document.getElementById('blog-container');
    if (!blogContainer) return;

    // 1. Get 2 Latest Articles
    // articles are already sorted by date in getAllPosts()
    const latestArticles = articles.slice(0, 2);

    // 2. Get 1 Popular Article
    // Get views from local storage
    const views = JSON.parse(localStorage.getItem('articleViews') || '{}');

    // Sort all articles by views (descending)
    const popularSorted = [...articles].sort((a, b) => {
        const viewA = views[a.slug] || 0;
        const viewB = views[b.slug] || 0;
        return viewB - viewA;
    });

    // Find the most popular article that is NOT in the latest 2
    let popularArticle = popularSorted.find(p => !latestArticles.some(l => l.slug === p.slug));

    // Fallback: If no popular article found (e.g. only 2 articles exist), take the 3rd latest
    if (!popularArticle && articles.length > 2) {
        popularArticle = articles[2];
    }

    // Combine: [Latest 1, Latest 2, Popular]
    const displayArticles = [...latestArticles];
    if (popularArticle) {
        // Add a flag to identify the popular one for styling (optional)
        popularArticle.is_popular_display = true;
        displayArticles.push(popularArticle);
    }

    const renderCard = (article) => {
        const date = new Date(article.date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const tags = article.tags ? article.tags.slice(0, 2).map(tag => // Limit tags to 2
            `<span class="px-2 py-1 bg-primary/10 text-primary text-xs rounded">${tag}</span>`
        ).join('') : '';

        const image = article.image || article.image_url || 'https://placehold.co/400x250';

        // Badge for popular article
        const popularBadge = article.is_popular_display
            ? `<div class="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-md z-10 flex items-center gap-1">
                 <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                 Populer
               </div>`
            : '';

        return `
            <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1 relative group border border-slate-100">
                ${popularBadge}
                <div class="h-56 bg-cover bg-center flex-shrink-0 relative overflow-hidden">
                    <img src="${image}" alt="${article.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <span class="text-white text-xs font-semibold bg-primary px-3 py-1.5 rounded-full shadow-sm">${article.category}</span>
                    </div>
                </div>
                <div class="p-6 flex-grow flex flex-col">
                    <h3 class="font-bold text-dark text-xl mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">${article.title}</h3>
                    <p class="text-slate-600 text-sm mb-4 flex-grow leading-relaxed line-clamp-3">${article.excerpt}</p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${tags}
                    </div>
                    <div class="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                        <span class="text-xs text-slate-500 flex items-center gap-1">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            ${date}
                        </span>
                        <a href="article.html?id=${article.slug}" class="text-primary font-semibold text-sm hover:underline flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Baca <span>→</span>
                        </a>
                    </div>
                </div>
            </div>
        `;
    };

    blogContainer.innerHTML = displayArticles.map(renderCard).join('');
}

// Load Gallery from JSON
async function loadGallery() {
    const galleryItems = getAllGalleryItems();
    const galleryContainer = document.getElementById('gallery-container');

    galleryContainer.innerHTML = galleryItems.map(item => {
        const tags = item.tags ? item.tags.map(tag =>
            `<span class="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">${tag}</span>`
        ).join('') : '';

        return `
            <div class="gallery-card bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 h-full flex flex-col cursor-pointer hover:shadow-xl transform hover:-translate-y-1" data-image="${item.image}" data-title="${item.title}">
                <div class="h-56 bg-cover bg-center flex-shrink-0" style="background-image: url('${item.image}');">
                    <div class="h-full bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div class="p-6 flex-grow flex flex-col">
                    <h3 class="font-bold text-dark text-xl mb-3 leading-tight">${item.title}</h3>
                    <p class="text-slate-600 text-sm mb-4 flex-grow leading-relaxed line-clamp-3">${item.description}</p>
                    <div class="flex flex-wrap gap-2">
                        ${tags}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Add click handler for lightbox
    const galleryCards = document.querySelectorAll('.gallery-card');
    galleryCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const image = card.getAttribute('data-image');
            const title = card.getAttribute('data-title');
            if (image && title) {
                openLightbox(image, title);
            }
        });
    });
}

// Lightbox Functions
function openLightbox(imageSrc, title) {
    const modal = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');

    if (!modal || !lightboxImage || !lightboxTitle) {
        console.error('Lightbox elements not found');
        return;
    }

    lightboxImage.src = imageSrc;
    lightboxImage.alt = title;
    lightboxTitle.textContent = title;

    // Show modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    // Animate in
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
    });
}

function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
    }, 300);
}

// Setup lightbox event handlers after DOM is ready
function setupLightboxHandlers() {
    const closeBtn = document.getElementById('close-lightbox');
    const modal = document.getElementById('lightbox-modal');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'lightbox-modal' || e.target === modal) {
                closeLightbox();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('lightbox-modal');
            if (modal && !modal.classList.contains('hidden')) {
                closeLightbox();
            }
        }
    });
}

// Load content
document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts().then(() => {
        setTimeout(observeCards, 100);
    });
    loadGallery().then(() => {
        setTimeout(observeCards, 100);
    });
    setupLightboxHandlers();
});
