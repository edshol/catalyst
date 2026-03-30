/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-promo. Base: columns.
 * Source: https://www.jp-life.japanpost.jp/
 * Selectors: .box__bgarea__004 .column__top_unit
 * Target: 2-column - image+link | text+article links
 * Generated: 2026-03-23
 */
export default function parse(element, { document }) {
  const cardLink = element.querySelector('.column__top_card');
  const articleSection = element.querySelector('.column__top_article');

  const col1 = [];
  const col2 = [];

  if (cardLink) {
    const img = cardLink.querySelector('img');
    if (img) col1.push(img);
    const title = cardLink.querySelector('.column__top_card_title');
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title.textContent.trim();
      col1.push(h3);
    }
    const desc = cardLink.querySelector('.column__top_card_text');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      col1.push(p);
    }
    const a = document.createElement('a');
    a.href = cardLink.href;
    a.textContent = title ? title.textContent.trim() : 'Learn more';
    col1.push(a);
  }

  if (articleSection) {
    const subtitle = articleSection.querySelector('.column__top_subtitle');
    if (subtitle) {
      const h4 = document.createElement('h4');
      h4.textContent = subtitle.textContent.trim();
      col2.push(h4);
    }
    const articles = Array.from(articleSection.querySelectorAll('.column__article li a'));
    articles.forEach((a) => {
      const titleEl = a.querySelector('.column__article_title');
      const dateEl = a.querySelector('.column__article_date');
      const p = document.createElement('p');
      const link = document.createElement('a');
      link.href = a.href;
      link.textContent = titleEl ? titleEl.textContent.trim() : a.textContent.trim();
      p.append(link);
      if (dateEl) {
        const span = document.createElement('span');
        span.textContent = ' (' + dateEl.textContent.trim() + ')';
        p.append(span);
      }
      col2.push(p);
    });
  }

  const cells = [[col1, col2]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}
