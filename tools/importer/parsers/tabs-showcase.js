/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-showcase block
 *
 * Source: https://www.wknd-trendsetters.site/
 * Base Block: tabs
 *
 * Block Structure:
 * - Row per tab: Column 1 = Tab label, Column 2 = Tab content (heading + image)
 *
 * Source HTML Pattern:
 * <div class="... w-tabs">
 *   <div class="... w-tab-menu">
 *     <a class="tab-menu-link-transparent w-tab-link ...">
 *       <div class="paragraph-lg ...">Tab Label</div>
 *     </a>
 *   </div>
 *   <div class="tabs-content w-tab-content">
 *     <div class="w-tab-pane ...">
 *       <div class="...">
 *         <h3 class="h2-heading ...">Heading</h3>
 *         <img src="..." alt="...">
 *       </div>
 *     </div>
 *   </div>
 * </div>
 *
 * Generated: 2026-01-19
 */
export default function parse(element, { document }) {
  // Extract tab labels from menu
  const tabMenuLinks = element.querySelectorAll('.w-tab-menu a.w-tab-link, .w-tab-menu .tab-menu-link-transparent');

  // Extract tab panes
  const tabPanes = element.querySelectorAll('.w-tab-content .w-tab-pane');

  // Build cells array - one row per tab
  const cells = [];

  // Match tab labels with their content panes
  tabMenuLinks.forEach((tabLink, index) => {
    // Extract tab label
    const labelEl = tabLink.querySelector('.paragraph-lg, div');
    const label = labelEl ? labelEl.textContent.trim() : `Tab ${index + 1}`;

    // Get corresponding pane
    const pane = tabPanes[index];

    // Build content cell
    const contentCell = document.createElement('div');

    if (pane) {
      // Extract heading from pane
      const heading = pane.querySelector('h3, h2, .h2-heading');
      if (heading) {
        const h3 = document.createElement('h3');
        h3.textContent = heading.textContent.trim();
        contentCell.appendChild(h3);
      }

      // Extract image from pane
      const img = pane.querySelector('img.cover-image, img.image, img');
      if (img) {
        const imgClone = img.cloneNode(true);
        contentCell.appendChild(imgClone);
      }
    }

    // Build row: [label, content]
    cells.push([label, contentCell]);
  });

  // Fallback if no specific selectors matched
  if (cells.length === 0) {
    // Try alternative tab structure
    const allTabs = element.querySelectorAll('[class*="tab"]');
    if (allTabs.length > 0) {
      cells.push(['Tab 1', 'Content placeholder']);
    }
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Tabs-Showcase', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
