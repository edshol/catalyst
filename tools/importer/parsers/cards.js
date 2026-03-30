/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block.
 * Base: cards. Source: https://rerdade.com/
 * Used for: staff members (#staff .row), sponsors (#sponsor .keen-slider), news (#news .blog-entry)
 * Block library: Each row = [image | title + description + optional CTA]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect which cards context based on parent section
  const inStaff = !!element.closest('#staff');
  const inSponsor = !!element.closest('#sponsor');
  const inNews = !!element.closest('#news');

  if (inStaff) {
    // Staff cards: .service-item contains .service-image img, .service-title, .service-content p
    const items = element.querySelectorAll('.service-item');
    items.forEach((item) => {
      const img = item.querySelector('.service-image img, img');
      const title = item.querySelector('.service-title, h4');
      const desc = item.querySelector('.service-content p, p');
      const link = item.querySelector('.service-link');

      const textCell = [];
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        textCell.push(strong);
      }
      if (desc) textCell.push(desc);
      if (link && link.href) {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = title ? title.textContent.trim() : 'Read more';
        textCell.push(a);
      }

      cells.push([img || '', textCell]);
    });
  } else if (inSponsor) {
    // Sponsor cards: .keen-slider__slide contains img, .name, .desc, .slider-link
    const slides = element.querySelectorAll('.keen-slider__slide');
    slides.forEach((slide) => {
      const img = slide.querySelector('img');
      const name = slide.querySelector('.name, h3');
      const desc = slide.querySelector('.desc, span.desc');
      const link = slide.querySelector('.slider-link, a');

      const textCell = [];
      if (name) {
        const strong = document.createElement('strong');
        strong.textContent = name.textContent.trim();
        textCell.push(strong);
      }
      if (desc && desc.textContent.trim() && desc.textContent.trim() !== '...') {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        textCell.push(p);
      }
      if (link && link.href && link.href !== '#') {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = name ? name.textContent.trim() : 'Visit';
        textCell.push(a);
      }

      cells.push([img || '', textCell]);
    });
  } else if (inNews) {
    // News cards: article contains .list-article-thumb img, .entry-title a, .entry-excerpt p
    const articles = element.querySelectorAll('article, .blog-entry');
    const targets = articles.length > 0 ? articles : [element];
    targets.forEach((article) => {
      const img = article.querySelector('.list-article-thumb img, img');
      const titleLink = article.querySelector('.entry-title a, .entry-title');
      const excerpt = article.querySelector('.entry-excerpt p, .entry-excerpt');

      const textCell = [];
      if (titleLink) {
        const strong = document.createElement('strong');
        if (titleLink.tagName === 'A') {
          const a = document.createElement('a');
          a.href = titleLink.href;
          a.textContent = titleLink.textContent.trim();
          strong.appendChild(a);
        } else {
          strong.textContent = titleLink.textContent.trim();
        }
        textCell.push(strong);
      }
      if (excerpt) textCell.push(excerpt);

      cells.push([img || '', textCell]);
    });
  } else {
    // Generic fallback: look for repeated items with image + text
    const items = element.querySelectorAll(':scope > div, :scope > li, :scope > article');
    items.forEach((item) => {
      const img = item.querySelector('img');
      const text = item.querySelector('h3, h4, strong, p');
      cells.push([img || '', text || '']);
    });
  }

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
  element.replaceWith(block);
}
