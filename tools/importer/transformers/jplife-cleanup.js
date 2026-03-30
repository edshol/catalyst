/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: jp-life cleanup.
 * Removes non-authorable content from www.jp-life.japanpost.jp pages.
 * Selectors verified from captured DOM (migration-work/cleaned.html).
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove elements that could interfere with block parsing
    // SP-only duplicate content (mobile-only sliders, duplicate nav)
    WebImporter.DOMUtils.remove(element, [
      '.first_view__contents__sp',
      '.disp_sp',
      'noscript',
      'link',
    ]);
  }

  if (hookName === H.after) {
    // Remove non-authorable site chrome (header, footer, nav)
    // Found in captured DOM: <header id="header">, <footer>
    WebImporter.DOMUtils.remove(element, [
      'header#header',
      'footer',
      '.bg__layer',
      '.header__block__global_navi__box',
    ]);

    // Remove tracking attributes
    element.querySelectorAll('[data-aalink]').forEach((el) => {
      el.removeAttribute('data-aalink');
    });
    element.querySelectorAll('[onclick]').forEach((el) => {
      el.removeAttribute('onclick');
    });
  }
}
