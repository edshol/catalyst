/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-products. Base: tabs.
 * Source: https://business.adobe.com/jp/
 * Generated: 2026-03-23
 *
 * Source DOM: .tabs.center element with:
 *   .tabList button[role="tab"] → tab labels (6 tabs)
 *   .tabpanel → tab content panels, each containing:
 *     .brick-text h3 → main heading
 *     .brick-text .body-m → description
 *     .icon-stack-area a → product links
 *     .cta-container a → "See all products" link
 *
 * Block library tabs structure (2 columns):
 *   Each row: Tab Label | Tab Content
 */
export default function parse(element, { document }) {
  const tabs = Array.from(element.querySelectorAll('[role="tab"]'));
  const panels = Array.from(element.querySelectorAll('[role="tabpanel"]'));

  const cells = [];

  tabs.forEach((tab, index) => {
    const label = tab.textContent.trim();
    const panel = panels[index];

    if (!panel) {
      cells.push([label, '']);
      return;
    }

    const contentContainer = document.createElement('div');

    // Main heading from first brick
    const mainHeading = panel.querySelector('.brick-text h3, .brick-text h2, h3, h2');
    if (mainHeading) contentContainer.append(mainHeading.cloneNode(true));

    // Description
    const desc = panel.querySelector('.brick-text .body-m, .body-m');
    if (desc) contentContainer.append(desc.cloneNode(true));

    // Product links from icon-stack list
    const productLinks = panel.querySelectorAll('.icon-stack-area a, ul a');
    if (productLinks.length > 0) {
      const ul = document.createElement('ul');
      productLinks.forEach((link) => {
        const li = document.createElement('li');
        li.append(link.cloneNode(true));
        ul.append(li);
      });
      contentContainer.append(ul);
    }

    // "See all products" link
    const seeAllLink = panel.querySelector('.cta-container a, .action-area a');
    if (seeAllLink) contentContainer.append(seeAllLink.cloneNode(true));

    cells.push([label, contentContainer]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-products', cells });
  element.replaceWith(block);
}
