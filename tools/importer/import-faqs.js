/* eslint-disable */
/* global WebImporter */

import faqListParser from './parsers/faq-list.js';

import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-sections.js';

const parsers = {
  'faq-list': faqListParser,
};

const PAGE_TEMPLATE = {
    "name": "faqs",
    "description": "WKND FAQs page: heading, intro, a Q&A accordion, and a need-more-help contact note.",
    "urls": [
      "https://wknd.site/us/en/faqs.html"
    ],
    "blocks": [
      {
        "name": "faq-list",
        "instances": [
          ".accordion.panelcontainer"
        ]
      }
    ],
    "sections": [
      {
        "id": "s1",
        "name": "faqs-main",
        "selector": [
          ".accordion.panelcontainer",
          "main.cmp-layout-container--fixed"
        ],
        "style": null,
        "blocks": [
          "faq-list"
        ],
        "defaultContent": [
          "h1",
          ".title",
          ".image",
          ".text"
        ]
      },
      {
        "id": "s2",
        "name": "need-more-help",
        "selector": [
          "aside",
          ".cmp-layoutcontainer--sidebar"
        ],
        "style": null,
        "blocks": [],
        "defaultContent": [
          ".title",
          ".text"
        ]
      }
    ]
  };

const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try { transformerFn.call(null, hookName, element, enhancedPayload); }
    catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      elements.forEach((element) => { pageBlocks.push({ name: blockDef.name, selector, element, section: blockDef.section || null }); });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;
    executeTransformers('beforeTransform', main, payload);
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) { try { parser(block.element, { document, url, params }); } catch (e) { console.error(`Failed to parse ${block.name}:`, e); } }
      else { console.warn(`No parser found for block: ${block.name}`); }
    });
    executeTransformers('afterTransform', main, payload);
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
    const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);
    return [{ element: main, path, report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) } }];
  },
};
