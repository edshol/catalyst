/* Delayed Functionality
 * Loaded 3 seconds after page load for non-critical enhancements
 */

/**
 * Scroll-triggered reveal animations (replaces WOW.js)
 * Uses IntersectionObserver to animate elements as they enter viewport
 */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  // Mark elements for animation, then observe them
  document.querySelectorAll(
    '.section .default-content-wrapper, .section .cards-wrapper',
  ).forEach((el) => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });

  // Observe cards blocks directly for staggered child animation
  document.querySelectorAll('.cards').forEach((el) => observer.observe(el));

  // Enable animation CSS (elements hidden only after JS is ready)
  document.body.classList.add('scroll-animations');
}

/**
 * Back-to-top button
 * Shows a floating button when user scrolls past first viewport
 */
function initBackToTop() {
  const btn = document.createElement('a');
  btn.className = 'back-to-top';
  btn.href = '#';
  btn.setAttribute('aria-label', 'Scroll to top');
  btn.innerHTML = '\u25B2'; // triangle up
  document.body.appendChild(btn);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > window.innerHeight * 0.5) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * Gallery lightbox
 * Opens gallery images in a fullscreen overlay with prev/next navigation
 */
function initGalleryLightbox() {
  // Find all gallery image links (links that contain images)
  const galleryLinks = [...document.querySelectorAll(
    '.section > .default-content-wrapper > p > a:has(img)',
  )];

  if (galleryLinks.length === 0) return;

  // Create lightbox overlay
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = `
    <button class="lightbox-close" aria-label="Close">&times;</button>
    <button class="lightbox-nav lightbox-prev" aria-label="Previous">&lsaquo;</button>
    <img src="" alt="">
    <button class="lightbox-nav lightbox-next" aria-label="Next">&rsaquo;</button>
  `;
  document.body.appendChild(overlay);

  const img = overlay.querySelector('img');
  const closeBtn = overlay.querySelector('.lightbox-close');
  const prevBtn = overlay.querySelector('.lightbox-prev');
  const nextBtn = overlay.querySelector('.lightbox-next');
  let currentIndex = 0;

  function showImage(index) {
    currentIndex = ((index % galleryLinks.length) + galleryLinks.length) % galleryLinks.length;
    const link = galleryLinks[currentIndex];
    const src = link.href;
    const alt = link.querySelector('img')?.alt || '';
    img.src = src;
    img.alt = alt;
  }

  function open(index) {
    showImage(index);
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Attach click handlers to gallery links
  galleryLinks.forEach((link, i) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      open(i);
    });
  });

  // Lightbox controls
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex - 1); });
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex + 1); });
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });
}

/**
 * Smooth scroll for anchor links in navigation
 * Offsets for fixed header height
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"], a[href*="/#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      const hash = href.includes('#') ? href.substring(href.indexOf('#')) : '';
      if (!hash || hash === '#') return;

      const target = document.querySelector(hash)
        || document.getElementById(hash.substring(1));
      if (target) {
        e.preventDefault();
        const headerHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
          10,
        ) || 64;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top, behavior: 'smooth' });
        // Update URL hash without jumping
        window.history.pushState(null, '', hash);
      }
    });
  });
}

// Initialize all delayed features
initScrollAnimations();
initBackToTop();
initGalleryLightbox();
initSmoothScroll();
