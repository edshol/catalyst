/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-hero-images block
 *
 * Source: https://www.wknd-trendsetters.site/
 * Base Block: columns
 *
 * Block Structure:
 * - Row 1: Two images side-by-side (one per column)
 *
 * Source HTML Pattern:
 * <div class="w-layout-grid grid-layout ...">
 *   <div class="utility-aspect-1x1">
 *     <img src="..." alt="..." class="image cover-image">
 *   </div>
 *   <div class="utility-aspect-1x1">
 *     <img src="..." alt="..." class="image cover-image">
 *   </div>
 * </div>
 *
 * Generated: 2026-01-19
 */
export default function parse(element, { document }) {
  // Extract images from the grid layout
  // Source HTML uses .utility-aspect-1x1 divs containing .cover-image images
  const imageContainers = element.querySelectorAll('.utility-aspect-1x1');

  // Fallback: try direct img children if no aspect containers
  let images = [];
  if (imageContainers.length > 0) {
    imageContainers.forEach(container => {
      const img = container.querySelector('img.cover-image, img.image, img');
      if (img) {
        images.push(img.cloneNode(true));
      }
    });
  } else {
    // Direct image extraction fallback
    images = Array.from(element.querySelectorAll(':scope > div > img, :scope img.cover-image'));
  }

  // Build cells array - each image in its own column
  const cells = [];

  if (images.length >= 2) {
    // Row with two images side-by-side
    cells.push([images[0], images[1]]);
  } else if (images.length === 1) {
    // Single image fallback
    cells.push([images[0]]);
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Hero-Images', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
