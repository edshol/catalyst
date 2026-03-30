/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-cta. Base: columns.
 * Source: https://www.jp-life.japanpost.jp/
 * Selectors: .box__bgarea__002 ul.disp_flex.list__none li
 * Target: multi-column - each column has icon + CTA link
 * Generated: 2026-03-23
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll(':scope > li'));
  const row = [];

  items.forEach((item) => {
    const link = item.querySelector('a');
    if (!link) return;

    const cell = [];
    const small = link.querySelector('small');
    const span = link.querySelector('span');

    if (small) {
      const p = document.createElement('p');
      p.textContent = small.textContent.trim();
      cell.push(p);
    }
    if (span) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = span.textContent.trim();
      const p = document.createElement('p');
      p.append(a);
      cell.push(p);
    } else {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim();
      cell.push(a);
    }

    row.push(cell);
  });

  const cells = [row];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-cta', cells });
  element.replaceWith(block);
}
