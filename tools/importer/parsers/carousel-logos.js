/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-logos. Base: carousel.
 * Source: https://business.adobe.com/jp/
 * Generated: 2026-03-23
 *
 * Source DOM: .action-scroller element with:
 *   .scroller .action-item → each item contains:
 *     a.main-image or a → link to customer story
 *     picture img → customer logo (SVG)
 *
 * Block library carousel structure (2 columns):
 *   Each row: Image | Text content (optional link)
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.action-item'));

  const cells = items.map((item) => {
    const link = item.querySelector('a');
    const picture = item.querySelector('picture');

    // Image cell: logo picture
    const imageCell = picture || '';

    // Text cell: link with alt text as label
    const textContainer = document.createElement('div');
    if (link) {
      const img = picture ? picture.querySelector('img') : null;
      const altText = img ? img.getAttribute('alt') : '';
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = altText || link.textContent.trim() || '';
      textContainer.append(a);
    }

    return [imageCell, textContainer];
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-logos', cells });
  element.replaceWith(block);
}
