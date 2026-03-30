/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-solutions. Base: cards.
 * Source: https://business.adobe.com/jp/
 * Generated: 2026-03-23
 *
 * Source DOM: .brick.grid-span-6 elements in solutions section
 *   Each .brick has:
 *     .background .desktop-only picture → card background image
 *     .brick-text h3 → heading
 *     .brick-text .body-m:not(.action-area) → description
 *     .brick-text .action-area a → CTA link
 *
 * Block library cards structure (2 columns):
 *   Each row: Image | Text (heading + description + CTA)
 */
export default function parse(element, { document }) {
  // Collect all sibling bricks in the section
  const parent = element.closest('.section, [class*="section"]');
  const allBricks = parent
    ? Array.from(parent.querySelectorAll(':scope > .brick'))
    : [element];

  // Only process on first brick; remove subsequent ones
  if (allBricks[0] !== element) {
    element.remove();
    return;
  }

  const cells = allBricks.map((brick) => {
    const image = brick.querySelector('.background .desktop-only picture')
      || brick.querySelector('.background picture');

    const textContainer = document.createElement('div');
    const heading = brick.querySelector('.brick-text h3, .brick-text h2');
    const desc = brick.querySelector('.brick-text .body-m:not(.action-area)');
    const cta = brick.querySelector('.brick-text .action-area a');

    if (heading) textContainer.append(heading);
    if (desc) textContainer.append(desc);
    if (cta) textContainer.append(cta);

    return [image || '', textContainer];
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-solutions', cells });
  element.replaceWith(block);

  // Remove remaining bricks that were consumed
  allBricks.slice(1).forEach((b) => b.remove());
}
