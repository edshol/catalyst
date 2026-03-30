/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for WKND Trendsetters website cleanup
 * Purpose: Remove navigation, footer, and non-content elements
 * Applies to: www.wknd-trendsetters.site (all templates)
 * Generated: 2026-01-19
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (cleaned.html)
 * - Page structure analysis from migration
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform'
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove navigation - EXTRACTED: Found <div class="nav secondary-nav"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.nav.secondary-nav',
      '.nav-container',
      '.w-nav',
      '.nav-mega-menu-dropdown-list',
      '.w-nav-overlay'
    ]);

    // Remove footer - EXTRACTED: Found <footer class="footer inverse-footer"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'footer.footer',
      '.inverse-footer'
    ]);

    // Remove dropdown menus and navigation overlays
    // EXTRACTED: Found various w-dropdown elements in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.w-dropdown-list',
      '.nav-menu-dropdown-list'
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove remaining non-content elements
    // Standard HTML elements safe to remove
    WebImporter.DOMUtils.remove(element, [
      'noscript',
      'link'
    ]);

    // Clean up Webflow-specific attributes
    // EXTRACTED: Found w-node-*, id="w-*" attributes in captured DOM
    const allElements = element.querySelectorAll('*');
    allElements.forEach(el => {
      // Remove Webflow node IDs
      const id = el.getAttribute('id');
      if (id && id.startsWith('w-')) {
        el.removeAttribute('id');
      }

      // Remove w-node-* attributes
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('w-node-')) {
          el.removeAttribute(attr.name);
        }
      });
    });
  }
}
