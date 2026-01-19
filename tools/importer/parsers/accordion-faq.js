/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-faq block
 *
 * Source: https://www.wknd-trendsetters.site/
 * Base Block: accordion
 *
 * Block Structure:
 * - Row per FAQ item: Column 1 = Question, Column 2 = Answer
 *
 * Source HTML Pattern:
 * <div class="flex-vertical ...">
 *   <div class="accordion transparent-accordion w-dropdown">
 *     <div class="... w-dropdown-toggle">
 *       <div class="dropdown-icon ..."></div>
 *       <div class="paragraph-lg">Question text?</div>
 *     </div>
 *     <nav class="accordion-content w-dropdown-list">
 *       <div class="...">
 *         <div class="rich-text w-richtext">
 *           <p>Answer text...</p>
 *         </div>
 *       </div>
 *     </nav>
 *   </div>
 * </div>
 *
 * Generated: 2026-01-19
 */
export default function parse(element, { document }) {
  // Extract accordion items
  // Source HTML uses .accordion.w-dropdown for each FAQ item
  const accordionItems = element.querySelectorAll('.accordion.w-dropdown, .w-dropdown');

  // Build cells array - one row per FAQ item
  const cells = [];

  accordionItems.forEach(item => {
    // Extract question from toggle
    const toggle = item.querySelector('.w-dropdown-toggle, [class*="toggle"]');
    const questionEl = toggle ? toggle.querySelector('.paragraph-lg, div:not(.dropdown-icon):not(.w-icon-dropdown-toggle)') : null;

    // Filter out icon elements and get actual question text
    let questionText = '';
    if (toggle) {
      const allDivs = toggle.querySelectorAll('div');
      for (const div of allDivs) {
        if (!div.classList.contains('dropdown-icon') &&
            !div.classList.contains('w-icon-dropdown-toggle') &&
            div.textContent.trim().length > 0) {
          questionText = div.textContent.trim();
          break;
        }
      }
    }

    // Extract answer from dropdown list
    const answerContainer = item.querySelector('.accordion-content, .w-dropdown-list');
    let answerText = '';
    if (answerContainer) {
      const richText = answerContainer.querySelector('.w-richtext p, .rich-text p, p');
      if (richText) {
        answerText = richText.textContent.trim();
      } else {
        answerText = answerContainer.textContent.trim();
      }
    }

    // Only add if we have both question and answer
    if (questionText && answerText) {
      cells.push([questionText, answerText]);
    }
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Accordion-FAQ', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
