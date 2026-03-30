/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-news. Base: tabs.
 * Source: https://www.jp-life.japanpost.jp/
 * Selectors: .fp-plessin .variable__tab_and_accordion
 * Target: 2-column tabs - tab label | tab content
 * Generated: 2026-03-23
 */
export default function parse(element, { document }) {
  const tabLabels = Array.from(element.querySelectorAll('.variable__tab_and_accordion__label'));
  const tabContents = Array.from(element.querySelectorAll('.variable__tab_and_accordion__contents'));
  const cells = [];

  tabLabels.forEach((label, i) => {
    const labelText = label.textContent.trim();
    const content = tabContents[i];

    const contentCell = [];

    if (content) {
      const newsItems = Array.from(content.querySelectorAll('li'));
      newsItems.forEach((item) => {
        const dateEl = item.querySelector('time, .list__grid__ymd, [class*="ymd"]');
        const linkEl = item.querySelector('a');
        const tagEl = item.querySelector('.list__grid__tag_info, [class*="tag"]');

        if (linkEl) {
          const p = document.createElement('p');
          if (dateEl) {
            const em = document.createElement('em');
            em.textContent = dateEl.textContent.trim();
            p.append(em);
            p.append(document.createTextNode(' '));
          }
          if (tagEl && tagEl.textContent.trim()) {
            const strong = document.createElement('strong');
            strong.textContent = '[' + tagEl.textContent.trim() + '] ';
            p.append(strong);
          }
          const a = document.createElement('a');
          a.href = linkEl.href;
          a.textContent = linkEl.textContent.trim();
          p.append(a);
          contentCell.push(p);
        }
      });

      // Also check for link lists (like ご注意ください section)
      if (contentCell.length === 0) {
        const links = Array.from(content.querySelectorAll('a'));
        links.forEach((a) => {
          const p = document.createElement('p');
          const link = document.createElement('a');
          link.href = a.href;
          link.textContent = a.textContent.trim();
          p.append(link);
          contentCell.push(p);
        });
      }
    }

    if (contentCell.length > 0) {
      cells.push([labelText, contentCell]);
    } else {
      cells.push([labelText, '']);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-news', cells });
  element.replaceWith(block);
}
