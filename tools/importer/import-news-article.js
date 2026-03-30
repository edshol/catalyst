/* eslint-disable */
/* global WebImporter */

import rerdadeInnerCleanupTransformer from './transformers/rerdade-inner-cleanup.js';

const PAGE_TEMPLATE = {
  name: 'news-article',
  urls: [
    'https://rerdade.com/2026/02/20/3%e6%9c%88%e5%90%84%e3%82%a4%e3%83%99%e3%83%b3%e3%83%88%e3%81%ae%e3%81%94%e6%a1%88%e5%86%85/',
  ],
  description: 'Individual news article/blog post page',
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
