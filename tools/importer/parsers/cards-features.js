/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-features. Base: cards.
 * Source: https://www.jp-life.japanpost.jp/
 * Selectors: .box__bgimage__001 .feature__slick .slick-slide
 * Target: 2-column cards - image | text (title + description)
 * Generated: 2026-03-23
 */
export default function parse(element, { document }) {
  const slides = Array.from(element.querySelectorAll('.slick-slide:not(.slick-cloned)'));
  const cells = [];
  const seen = new Set();

  slides.forEach((slide) => {
    const img = slide.querySelector('img');
    if (!img) return;
    const src = img.getAttribute('src');
    if (seen.has(src)) return;
    seen.add(src);

    const titleEl = slide.querySelector('.feature__title, h3, h2, [class*="title"]');
    const descEl = slide.querySelector('.feature__text, p, [class*="text"]');

    const contentCell = [];
    if (titleEl) {
      const h3 = document.createElement('h3');
      h3.textContent = titleEl.textContent.trim();
      contentCell.push(h3);
    }
    if (descEl && descEl !== titleEl) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.trim();
      contentCell.push(p);
    }

    if (contentCell.length > 0) {
      cells.push([img, contentCell]);
    } else {
      cells.push([img]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-features', cells });
  element.replaceWith(block);
}
