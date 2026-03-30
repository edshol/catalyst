/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-articles. Base: cards.
 * Source: https://www.jp-life.japanpost.jp/
 * Selectors: .list__panel li
 * Target: 2-column cards - image | text (title + description + link)
 * Generated: 2026-03-23
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll(':scope > li'));
  const cells = [];

  items.forEach((item) => {
    const link = item.querySelector('a');
    const img = item.querySelector('img');

    const contentCell = [];

    const titleEl = item.querySelector('.list__panel__title, h3, [class*="title"]');
    const descEl = item.querySelector('.list__panel__text, p:not([class*="title"])', item);

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

    if (link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = titleEl ? titleEl.textContent.trim() : link.textContent.trim();
      const pLink = document.createElement('p');
      pLink.append(a);
      contentCell.push(pLink);
    }

    if (img && contentCell.length > 0) {
      cells.push([img, contentCell]);
    } else if (contentCell.length > 0) {
      cells.push([contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-articles', cells });
  element.replaceWith(block);
}
