/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: rerdade inner page cleanup.
 * Removes header, footer, sidebar, and WordPress boilerplate from inner pages.
 * Works for staff profiles, news articles, all-staff directory, and news listing.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    WebImporter.DOMUtils.remove(element, [
      '.skip-link',
      '.c-bully',
    ]);
  }
  if (hookName === H.after) {
    // Remove header, footer, sidebar, navigation, comment form
    WebImporter.DOMUtils.remove(element, [
      '#header-section',
      'header#masthead',
      'footer#colophon',
      '#secondary',
      'aside',
      '.sidebar',
      '#comments',
      '.comment-respond',
      'nav.post-navigation',
      'nav.navigation',
      '.entry-meta',
      'iframe',
      'link',
      'noscript',
      'script',
    ]);

    // Clean up data attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
    });
  }
}
