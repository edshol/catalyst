/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-articles block
 *
 * Source: https://www.wknd-trendsetters.site/
 * Base Block: cards
 *
 * Block Structure:
 * - Row per article: Column 1 = Image, Column 2 = Tag + read time, heading, description, CTA
 *
 * Source HTML Pattern:
 * <div class="w-layout-grid grid-layout tablet-1-column grid-gap-md">
 *   <a href="..." class="utility-link-content-block ...">
 *     <div class="w-layout-grid grid-layout ...">
 *       <img alt="..." src="..." class="cover-image utility-aspect-1x1">
 *       <div>
 *         <div class="flex-horizontal ...">
 *           <div class="tag"><div>Category</div></div>
 *           <div class="paragraph-sm ...">X min read</div>
 *         </div>
 *         <h3 class="h4-heading">Title</h3>
 *         <p>Description</p>
 *         <div>Read</div>
 *       </div>
 *     </div>
 *   </a>
 * </div>
 *
 * Generated: 2026-01-19
 */
export default function parse(element, { document }) {
  // Extract article card links
  // Source HTML uses a.utility-link-content-block for each card
  const articleCards = element.querySelectorAll('a.utility-link-content-block');

  // Build cells array - one row per article card
  const cells = [];

  articleCards.forEach(card => {
    // Extract image
    const img = card.querySelector('img.cover-image, img.utility-aspect-1x1, img');

    // Extract tag/category
    const tag = card.querySelector('.tag div, .tag');
    const tagText = tag ? tag.textContent.trim() : '';

    // Extract read time
    const readTime = card.querySelector('.paragraph-sm');
    const readTimeText = readTime ? readTime.textContent.trim() : '';

    // Extract heading
    const heading = card.querySelector('h3, .h4-heading, h4');

    // Extract description
    const description = card.querySelector('p');

    // Extract link URL
    const href = card.getAttribute('href') || '';

    // Build content cell
    const contentCell = document.createElement('div');

    // Add tag and read time
    if (tagText || readTimeText) {
      const metaLine = document.createElement('p');
      metaLine.innerHTML = `<strong>${tagText}</strong> ${readTimeText}`;
      contentCell.appendChild(metaLine);
    }

    // Add heading
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      contentCell.appendChild(h3);
    }

    // Add description
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      contentCell.appendChild(p);
    }

    // Add CTA link
    if (href) {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = 'Read';
      contentCell.appendChild(link);
    }

    // Build row: [image, content]
    if (img) {
      const imgClone = img.cloneNode(true);
      cells.push([imgClone, contentCell]);
    } else {
      cells.push([contentCell]);
    }
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Articles', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
