/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-features block
 *
 * Source: https://www.wknd-trendsetters.site/
 * Base Block: cards
 *
 * Block Structure:
 * - Row per card: Single column with text (no images, icon-based features)
 *
 * Source HTML Pattern:
 * <div class="w-layout-grid grid-layout desktop-4-column ...">
 *   <div class="flex-horizontal flex-gap-xxs ...">
 *     <div><div class="icon"><img src="..."></div></div>
 *     <p class="utility-margin-bottom-0">Feature text...</p>
 *   </div>
 *   <!-- Repeats for each feature -->
 * </div>
 *
 * Generated: 2026-01-19
 */
export default function parse(element, { document }) {
  // Extract feature items from the grid
  // Source HTML uses .flex-horizontal.flex-gap-xxs divs for each feature
  const featureItems = element.querySelectorAll('.flex-horizontal.flex-gap-xxs');

  // Build cells array - one row per feature card
  const cells = [];

  featureItems.forEach(item => {
    // Extract the text content (paragraph)
    const textContent = item.querySelector('p, .utility-margin-bottom-0');

    if (textContent) {
      // Create cell with feature text
      const cell = document.createElement('div');
      cell.textContent = textContent.textContent.trim();
      cells.push([cell]);
    }
  });

  // If no items found with specific selector, try alternative
  if (cells.length === 0) {
    const gridItems = element.querySelectorAll(':scope > div[class*="flex"]');
    gridItems.forEach(item => {
      const text = item.querySelector('p');
      if (text) {
        const cell = document.createElement('div');
        cell.textContent = text.textContent.trim();
        cells.push([cell]);
      }
    });
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Features', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
