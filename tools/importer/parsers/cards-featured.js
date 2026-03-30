/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-featured. Base: cards.
 * Source: https://business.adobe.com/jp/
 * Generated: 2026-03-23
 *
 * Source DOM: .brick elements inside .section.static-links.xl-spacing-top
 *   Each .brick has:
 *     .background .desktop-only picture → card image
 *     .brick-text .detail-l → eyebrow text
 *     .brick-text h2 → heading
 *     .brick-text .body-m:not(.action-area) → description
 *     .brick-text .action-area a → CTA link
 *
 * Block library cards structure (2 columns):
 *   Each row: Image | Text (heading + description + CTA)
 */
export default function parse(element, { document }) {
  // Collect all sibling bricks to create one cards block
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
    // Image: desktop picture from background
    const image = brick.querySelector('.background .desktop-only picture')
      || brick.querySelector('.background picture');

    // Text content container
    const textContainer = document.createElement('div');
    const eyebrow = brick.querySelector('.brick-text .detail-l, .brick-text [class*="detail"]');
    const heading = brick.querySelector('.brick-text h2, .brick-text h3');
    const desc = brick.querySelector('.brick-text .body-m:not(.action-area)');
    const cta = brick.querySelector('.brick-text .action-area a');

    if (eyebrow) textContainer.append(eyebrow);
    if (heading) textContainer.append(heading);
    if (desc) textContainer.append(desc);
    if (cta) textContainer.append(cta);

    return [image || '', textContainer];
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-featured', cells });
  element.replaceWith(block);

  // Remove remaining bricks that were consumed
  allBricks.slice(1).forEach((b) => b.remove());
}
