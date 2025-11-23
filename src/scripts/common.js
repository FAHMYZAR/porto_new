// Mobile Menu
export function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!hamburger || !mobileMenu) return;

    const hamburgerSpans = hamburger.querySelectorAll('span');

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');

        if (!mobileMenu.classList.contains('hidden')) {
            hamburgerSpans[0].style.transform = 'rotate(45deg) translateY(10px)';
            hamburgerSpans[1].style.opacity = '0';
            hamburgerSpans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
        } else {
            hamburgerSpans[0].style.transform = 'none';
            hamburgerSpans[1].style.opacity = '1';
            hamburgerSpans[2].style.transform = 'none';
        }
    });

    // Close mobile menu on link click
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            hamburgerSpans.forEach(span => span.style.transform = 'none');
            hamburgerSpans[1].style.opacity = '1';
        });
    });
}

// Smooth scroll with offset
export function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Animation Observer
export function setupAnimations() {
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

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    return observer;
}

// Navbar scroll effect
export function setupNavbarEffect() {
    const navbar = document.getElementById('navbar') || document.querySelector('nav');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.classList.add('shadow-lg');
        } else {
            navbar.classList.remove('shadow-lg');
        }
    });
}

export function initCommon() {
    setupMobileMenu();
    setupSmoothScroll();
    setupAnimations();
    setupNavbarEffect();
}
