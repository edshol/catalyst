/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Adobe Business JP cleanup.
 * Selectors from captured DOM at https://business.adobe.com/jp/
 * Removes non-authorable Milo/Franklin elements from captured page.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent (OneTrust - common on Adobe sites)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '[class*="onetrust"]',
      '.dialog-modal',
      '.locale-modal',
    ]);

    // Unwrap .fragment containers - preserve content, remove wrapper
    const fragments = element.querySelectorAll('.fragment');
    fragments.forEach((frag) => {
      while (frag.firstChild) {
        frag.parentNode.insertBefore(frag.firstChild, frag);
      }
      frag.remove();
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'noscript',
      'link',
      'iframe',
    ]);

    // Remove Milo-specific non-authorable elements
    WebImporter.DOMUtils.remove(element, [
      '.section-metadata',
      '.card-metadata',
      '.foreground-media',
      '.pause-play-wrapper',
      '.paddle',
      '.nav-grad',
      'video',
    ]);

    // Clean tracking attributes from all elements
    element.querySelectorAll('[daa-lh], [daa-ll], [daa-state], [daa-im]').forEach((el) => {
      el.removeAttribute('daa-lh');
      el.removeAttribute('daa-ll');
      el.removeAttribute('daa-state');
      el.removeAttribute('daa-im');
    });
  }
}
