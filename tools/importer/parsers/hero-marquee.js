/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-marquee. Base: hero.
 * Source: https://business.adobe.com/jp/
 * Generated: 2026-03-23
 *
 * Source DOM: .hero-marquee element with:
 *   .background .desktop-only picture → background image
 *   .foreground .copy .detail-l → eyebrow text
 *   .foreground .copy h1 → heading
 *   .foreground .copy .body-m:not(.action-area) → description
 *   .foreground .copy .action-area a → CTA buttons
 *
 * Block library hero structure:
 *   Row 1: Background image
 *   Row 2: Content (heading + subheading + CTAs)
 */
export default function parse(element, { document }) {
  const bgPicture = element.querySelector('.background .desktop-only picture')
    || element.querySelector('.background picture');

  const eyebrow = element.querySelector('.foreground .detail-l, .foreground [class*="detail"]');
  const heading = element.querySelector('.foreground h1, .foreground h2');
  const description = element.querySelector('.foreground .body-m:not(.action-area)');
  const ctaLinks = Array.from(element.querySelectorAll('.foreground .action-area a'));

  const cells = [];

  // Row 1: Background image
  if (bgPicture) {
    cells.push([bgPicture]);
  }

  // Row 2: Content (eyebrow + heading + description + CTAs)
  const contentCell = [];
  if (eyebrow) contentCell.push(eyebrow);
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  contentCell.push(...ctaLinks);
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-marquee', cells });
  element.replaceWith(block);
}
