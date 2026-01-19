/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block (standard variant)
 *
 * Source: https://www.wknd-trendsetters.site/
 * Base Block: columns
 *
 * Block Structure:
 * - Row with multiple columns, each containing mixed content
 *
 * Used for:
 * - Section 3: Eyebrow + heading + text | Browse button
 * - Section 6: Heading + subheading | Two stacked buttons
 *
 * Source HTML Pattern (Section 3):
 * <div class="w-layout-grid grid-layout ... y-bottom">
 *   <div>
 *     <div class="eyebrow">Hot right now</div>
 *     <h2 class="h2-heading">Style that never sleeps</h2>
 *     <p>Description...</p>
 *   </div>
 *   <a href="..." class="button">Browse</a>
 * </div>
 *
 * Source HTML Pattern (Section 6):
 * <div class="w-layout-grid grid-layout desktop-4-column ... y-center">
 *   <div>
 *     <h2>Join the style revolution</h2>
 *     <p class="subheading ...">Description...</p>
 *   </div>
 *   <div class="button-group ...">
 *     <a href="..." class="button">Sign up</a>
 *     <a href="..." class="button secondary-button">Connect</a>
 *   </div>
 * </div>
 *
 * Generated: 2026-01-19
 */
export default function parse(element, { document }) {
  // Get direct children that form columns
  const children = element.querySelectorAll(':scope > div, :scope > a');

  // Build cells array - single row with multiple columns
  const columnCells = [];

  children.forEach(child => {
    const cell = document.createElement('div');

    if (child.tagName === 'A') {
      // Direct link/button - clone it
      const link = child.cloneNode(true);
      cell.appendChild(link);
    } else if (child.classList.contains('button-group')) {
      // Button group - extract all buttons
      const buttons = child.querySelectorAll('a.button, a.w-button, button');
      buttons.forEach(btn => {
        const link = document.createElement('a');
        link.href = btn.getAttribute('href') || '#';
        link.textContent = btn.textContent.trim();
        cell.appendChild(link);
        cell.appendChild(document.createElement('br'));
      });
    } else {
      // Content div - extract heading, paragraph, links

      // Check for eyebrow
      const eyebrow = child.querySelector('.eyebrow');
      if (eyebrow) {
        const p = document.createElement('p');
        p.textContent = eyebrow.textContent.trim();
        cell.appendChild(p);
      }

      // Check for heading
      const heading = child.querySelector('h2, h3, .h2-heading, .h3-heading');
      if (heading) {
        const h2 = document.createElement('h2');
        h2.textContent = heading.textContent.trim();
        cell.appendChild(h2);
      }

      // Check for paragraph/description
      const paragraph = child.querySelector('p:not(.eyebrow), .subheading');
      if (paragraph) {
        const p = document.createElement('p');
        p.textContent = paragraph.textContent.trim();
        cell.appendChild(p);
      }

      // Check for buttons within this column
      const buttons = child.querySelectorAll('a.button, a.w-button');
      buttons.forEach(btn => {
        const link = document.createElement('a');
        link.href = btn.getAttribute('href') || '#';
        link.textContent = btn.textContent.trim();
        cell.appendChild(link);
      });
    }

    // Only add non-empty cells
    if (cell.childNodes.length > 0) {
      columnCells.push(cell);
    }
  });

  // Build cells array as single row with all columns
  const cells = [];
  if (columnCells.length > 0) {
    cells.push(columnCells);
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
