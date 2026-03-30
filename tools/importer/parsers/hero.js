/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block.
 * Base: hero. Source: https://rerdade.com/
 * Source DOM: #parallax-hero containing .parallax-bg img, section#hero with h2, p, CTAs
 * Block library: Row 1 = background image, Row 2 = heading + text + CTAs
 */
export default function parse(element, { document }) {
  // Extract background image from parallax-bg
  const bgImage = element.querySelector('.parallax-bg img, img[class*="hero"]');

  // Extract heading (found: h2.hero-large-text)
  const heading = element.querySelector('h2.hero-large-text, h2, h1');

  // Extract subtitle text (found: .hero-small-text p)
  const subtitle = element.querySelector('.hero-small-text p, .hero-small-text');

  // Extract CTA buttons (found: a.btn.btn-lg)
  const ctaLinks = Array.from(element.querySelectorAll('a.btn, a.button, .hero__content > a'));

  // Build cells matching hero block library structure:
  // Row 1: background image
  // Row 2: heading + subtitle + CTAs
  const cells = [];

  // Row 1: background image
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: content (heading, subtitle, CTAs)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subtitle) contentCell.push(subtitle);
  contentCell.push(...ctaLinks);
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
