import { initCommon } from '../common.js';
import { getAllPosts } from '../utils.js';

initCommon();

document.addEventListener('DOMContentLoaded', () => {
    loadAllPosts();
    // Initialize AOS
    if (window.AOS) {
        window.AOS.init();
    }
});

async function loadAllPosts() {
    const articles = getAllPosts();
    const blogGrid = document.getElementById('blog-grid');

    if (articles.length === 0) {
        blogGrid.innerHTML = '<div class="col-span-full text-center text-slate-500">Belum ada artikel.</div>';
        return;
    }

    blogGrid.innerHTML = articles.map((article, index) => {
        const date = new Date(article.date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const tags = article.tags ? article.tags.map(tag =>
            `<span class="px-2 py-1 bg-primary/10 text-primary text-xs rounded">${tag}</span>`
        ).join('') : '';

        // Image handling logic
        const placeholder = 'https://placehold.co/400x250';
        let imageSrc = placeholder;
        let imageOnError = '';

        if (article.image) {
            imageSrc = article.image;
            // If local fails, try external, then placeholder
            const fallback = article.image_url ? article.image_url : placeholder;
            imageOnError = `onerror="this.onerror=null; this.src='${fallback}'; if('${fallback}' !== '${placeholder}' && '${article.image_url}') { this.onerror = function() { this.src='${placeholder}' } }"`;
        } else if (article.image_url) {
            imageSrc = article.image_url;
            imageOnError = `onerror="this.onerror=null; this.src='${placeholder}'"`;
        }

        // Stagger animation delay
        const delayClass = index % 3 === 1 ? 'data-aos-delay="100"' : index % 3 === 2 ? 'data-aos-delay="200"' : '';

        return `
            <article class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group border border-slate-100 overflow-hidden h-full flex flex-col" ${delayClass}>
                <!-- Image Container -->
                <div class="relative h-48 sm:h-56 overflow-hidden">
                    <a href="article.html?id=${article.slug}" class="block w-full h-full">
                        <img src="${imageSrc}" ${imageOnError} alt="${article.title}" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500">
                        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    </a>
                    <div class="absolute bottom-4 left-4">
                        <span class="text-white text-xs font-semibold bg-primary px-3 py-1.5 rounded-full">${article.category}</span>
                    </div>
                </div>
                <div class="p-6 flex-grow flex flex-col">
                    <h3 class="font-bold text-dark text-xl mb-3 leading-tight">${article.title}</h3>
                    <p class="text-slate-600 text-sm mb-4 flex-grow leading-relaxed line-clamp-3">${article.excerpt}</p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${tags}
                    </div>
                    <div class="flex items-center justify-between pt-4 border-t border-slate-200">
                        <span class="text-xs text-slate-500">${date}</span>
                        <a href="article.html?id=${article.slug}" class="text-primary font-semibold text-sm hover:underline flex items-center gap-1">
                            Baca <span>→</span>
                        </a>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    // Refresh AOS after adding content
    if (window.AOS) {
        setTimeout(() => {
            window.AOS.refresh();
        }, 100);
    }
}
