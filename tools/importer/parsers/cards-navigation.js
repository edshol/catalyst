/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-navigation. Base: cards.
 * Source: https://www.jp-life.japanpost.jp/
 * Selectors: .box__bgarea__001 .block__row .block__size4
 * Target: 2-column cards - image | text (title + links)
 * Generated: 2026-03-23
 */
export default function parse(element, { document }) {
  const cardEls = Array.from(element.querySelectorAll(':scope > .block__size4'));
  const cells = [];

  cardEls.forEach((card) => {
    const icon = card.querySelector('.variable__contents_and_accordion__label img');
    const titleEl = card.querySelector('.variable__contents_and_accordion__label span');
    const links = Array.from(card.querySelectorAll('.variable__contents_and_accordion__contents_box a'));

    const contentCell = [];

    if (titleEl) {
      const h3 = document.createElement('h3');
      h3.textContent = titleEl.textContent.trim();
      contentCell.push(h3);
    }

    links.forEach((link) => {
      const text = link.textContent.trim();
      if (text) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = text;
        p.append(a);
        contentCell.push(p);
      }
    });

    if (icon && contentCell.length > 0) {
      cells.push([icon, contentCell]);
    } else if (contentCell.length > 0) {
      cells.push([contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-navigation', cells });
  element.replaceWith(block);
}
