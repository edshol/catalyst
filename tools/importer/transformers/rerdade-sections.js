/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: rerdade sections.
 * Adds section breaks (<hr>) and section-metadata blocks from template sections.
 * Selectors from captured DOM of https://rerdade.com/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to avoid offset issues
    const reversedSections = [...sections].reverse();

    for (const section of reversedSections) {
      // Find the section element using the selector
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }
      if (!sectionEl) continue;

      // Add section-metadata block if section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.append(metaBlock);
      }

      // Add <hr> before section (except the first section)
      if (section.id !== sections[0].id) {
        const hr = document.createElement('hr');
        if (sectionEl.parentElement) {
          sectionEl.parentElement.insertBefore(hr, sectionEl);
        }
      }
    }
  }
}
