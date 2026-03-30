/* eslint-disable */
/* global WebImporter */

import rerdadeInnerCleanupTransformer from './transformers/rerdade-inner-cleanup.js';

const PAGE_TEMPLATE = {
  name: 'staff-profile',
  urls: [
    'https://rerdade.com/shinozaki-ryuki/',
    'https://rerdade.com/sugaya-kazutoshi/',
    'https://rerdade.com/nishimura-yuto/',
    'https://rerdade.com/fujiwara-koki/',
    'https://rerdade.com/harada-chisato/',
  ],
  description: 'Individual staff profile pages with biography, photo, and career history',
  blocks: [],
};

const transformers = [rerdadeInnerCleanupTransformer];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);
    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: [],
      },
    }];
  },
};
