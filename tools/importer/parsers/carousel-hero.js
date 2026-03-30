/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-hero. Base: carousel.
 * Source: https://www.jp-life.japanpost.jp/
 * Selectors: .main__slick .slick-slide (PC carousel slides)
 * Target: 2-column table - image | text content per slide
 * Generated: 2026-03-23
 */
export default function parse(element, { document }) {
  // Get all non-cloned slides from the Slick carousel
  const slides = Array.from(element.querySelectorAll('.slick-slide:not(.slick-cloned)'));

  const cells = [];
  const seen = new Set();

  slides.forEach((slide) => {
    const link = slide.querySelector('a');
    const img = slide.querySelector('img');
    if (!img) return;

    // Deduplicate by image src
    const src = img.getAttribute('src');
    if (seen.has(src)) return;
    seen.add(src);

    // Carousel block: col1 = image, col2 = text (alt as description, link as CTA)
    const altText = img.getAttribute('alt') || '';
    const contentCell = [];

    if (altText) {
      const p = document.createElement('p');
      p.textContent = altText;
      contentCell.push(p);
    }

    if (link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = altText || 'Learn more';
      contentCell.push(a);
    }

    if (contentCell.length > 0) {
      cells.push([img, contentCell]);
    } else {
      cells.push([img]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
