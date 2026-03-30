/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import cardsParser from './parsers/cards.js';

// TRANSFORMER IMPORTS
import rerdadeCleanupTransformer from './transformers/rerdade-cleanup.js';
import rerdadeSectionsTransformer from './transformers/rerdade-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero': heroParser,
  'cards': cardsParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  urls: [
    'https://rerdade.com/',
  ],
  description: 'Rerdade homepage - main landing page with hero, about, school info, staff, gallery, sponsors, news, and access sections',
  blocks: [
    {
      name: 'hero',
      instances: ['#parallax-hero'],
    },
    {
      name: 'cards',
      instances: ['#staff .row', '#sponsor .keen-slider', '#news .blog-entry'],
    },
  ],
  sections: [
    {
      id: 'hero',
      name: 'Hero',
      selector: ['#parallax-hero', 'section#hero'],
      style: 'dark',
      blocks: ['hero'],
      defaultContent: [],
    },
    {
      id: 'about',
      name: 'About',
      selector: 'section#about',
      style: null,
      blocks: [],
      defaultContent: ['#about .section-title', '#about .section-desc blockquote', '#about .section-desc p'],
    },
    {
      id: 'school',
      name: 'School Info',
      selector: 'section#school',
      style: null,
      blocks: [],
      defaultContent: ['#school .section-title', '#school .section-desc table', '#school .section-desc ul'],
    },
    {
      id: 'staff',
      name: 'Staff',
      selector: 'section#staff',
      style: null,
      blocks: ['cards'],
      defaultContent: ['#staff .section-title'],
    },
    {
      id: 'gallery',
      name: 'Gallery',
      selector: 'section#gallery',
      style: null,
      blocks: [],
      defaultContent: ['#gallery .section-title', '#gallery .g-item img'],
    },
    {
      id: 'sponsor',
      name: 'Sponsors',
      selector: 'section#sponsor',
      style: null,
      blocks: ['cards'],
      defaultContent: ['#sponsor .section-title'],
    },
    {
      id: 'news',
      name: 'News',
      selector: 'section#news',
      style: null,
      blocks: ['cards'],
      defaultContent: ['#news .section-title', '#news .all-news a'],
    },
    {
      id: 'access',
      name: 'Access / Contact',
      selector: 'section#access',
      style: null,
      blocks: [],
      defaultContent: ['#access .section-title', '#access .section-desc a', '#access .address-box'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  rerdadeCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [rerdadeSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
