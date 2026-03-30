/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: rerdade cleanup.
 * Selectors from captured DOM of https://rerdade.com/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Move #parallax-hero out of #header-section before cleanup
    // DOM structure: #header-section > .followWrap + #parallax-hero
    // Hero is authorable content nested inside header wrapper
    const heroSection = element.querySelector('#parallax-hero');
    const headerSection = element.querySelector('#header-section');
    if (heroSection && headerSection && headerSection.parentElement) {
      headerSection.parentElement.insertBefore(heroSection, headerSection.nextSibling);
    }

    // Remove skip link (found: a.skip-link)
    // Remove side navigation dots (found: div.c-bully)
    // Remove parallax divider between staff and gallery (found: div.section-parallax)
    WebImporter.DOMUtils.remove(element, [
      '.skip-link',
      '.c-bully',
      '.section-parallax',
    ]);
  }
  if (hookName === H.after) {
    // Remove header chrome (found: #header-section containing #masthead, nav)
    // Remove footer (found: footer#colophon)
    // Remove empty feature items in about section (found: .feature-item with empty content)
    // Remove iframes, noscript, link tags
    WebImporter.DOMUtils.remove(element, [
      '#header-section',
      'footer#colophon',
      '.feature-item',
      'iframe',
      'link',
      'noscript',
    ]);

    // Clean up data attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
      el.removeAttribute('data-wow-duration');
    });
  }
}
