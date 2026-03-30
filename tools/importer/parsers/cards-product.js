/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-product. Base: cards.
 * Source: https://www.jp-life.japanpost.jp/
 * Selectors: .box__bgimage__002 ul.list__box_variable li
 * Target: 1-column cards (no images) - product name + description + link
 * Generated: 2026-03-23
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll(':scope > li'));
  const cells = [];

  items.forEach((item) => {
    const link = item.querySelector('a');
    if (!link) return;

    const titleEl = item.querySelector('.list__box_variable__row, [class*="title"] [class*="row"]');
    const descEl = item.querySelector('.list__box_variable__text, [class*="text"]');

    const contentCell = [];

    if (titleEl) {
      const h3 = document.createElement('h3');
      h3.textContent = titleEl.textContent.trim();
      contentCell.push(h3);
    }
    if (descEl) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.trim();
      contentCell.push(p);
    }

    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = titleEl ? titleEl.textContent.trim() : link.textContent.trim();
    const pLink = document.createElement('p');
    pLink.append(a);
    contentCell.push(pLink);

    cells.push([contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);
}
