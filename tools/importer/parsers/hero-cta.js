/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-cta. Base: hero.
 * Source: https://business.adobe.com/jp/
 * Generated: 2026-03-23
 *
 * Source DOM: .aside.small.dark element with:
 *   .foreground .text h2 → heading
 *   .foreground .text .action-area a → CTA button
 *   (No background image - solid black background via inline style)
 *
 * Note: Skips customer testimonial aside (.no-media class or blockquote)
 *
 * Block library hero structure:
 *   Row 1: Background image (optional)
 *   Row 2: Content (heading + CTAs)
 */
export default function parse(element, { document }) {
  // Skip customer testimonial aside (has blockquote or no-media class)
  if (element.querySelector('blockquote') || element.classList.contains('no-media')) {
    return;
  }

  const bgPicture = element.querySelector('.background .desktop-only picture')
    || element.querySelector('.background picture');

  const heading = element.querySelector('.text h2, .text h1, .foreground h2, .foreground h1');
  const ctaLinks = Array.from(
    element.querySelectorAll('.text .action-area a, .foreground .action-area a'),
  );

  const cells = [];

  // Row 1: Background image (optional - CTA banner uses solid bg color)
  if (bgPicture) {
    cells.push([bgPicture]);
  }

  // Row 2: Content (heading + CTAs)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  contentCell.push(...ctaLinks);
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-cta', cells });
  element.replaceWith(block);
}
