/* eslint-disable */
/* global WebImporter */

import cardsContributorParser from './parsers/cards-contributor.js';
import featuredArticleParser from './parsers/featured-article.js';
import cardsParser from './parsers/cards.js';
import cardsSecureParser from './parsers/cards-secure.js';

import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-sections.js';

const parsers = {
  'cards-contributor': cardsContributorParser,
  'featured-article': featuredArticleParser,
  'cards': cardsParser,
  'cards-secure': cardsSecureParser,
};

const PAGE_TEMPLATE = {
    "name": "about-us",
    "description": "WKND about-us + magazine listing: contributor profile grids; magazine featured teaser, article grid, and members-only teasers.",
    "urls": [
      "https://wknd.site/us/en/about-us.html",
      "https://wknd.site/us/en/magazine.html"
    ],
    "blocks": [
      {
        "name": "cards-contributor",
        "instances": [
          ".experiencefragment.cmp-experience-fragment--contributor"
        ]
      },
      {
        "name": "featured-article",
        "instances": [
          ".teaser.cmp-teaser--featured"
        ]
      },
      {
        "name": "cards",
        "instances": [
          ".image-list.list"
        ]
      },
      {
        "name": "cards-secure",
        "instances": [
          ".teaser.cmp-teaser--secure"
        ]
      }
    ],
    "sections": [
      {
        "id": "a1",
        "name": "page-title",
        "selector": [
          "main.cmp-layout-container--fixed .title:nth-of-type(1)",
          "main.cmp-layout-container--fixed"
        ],
        "style": null,
        "blocks": [],
        "defaultContent": [
          "h1",
          ".title"
        ]
      },
      {
        "id": "a2",
        "name": "our-contributors",
        "selector": [
          "main.cmp-layout-container--fixed .aem-Grid"
        ],
        "style": null,
        "blocks": [
          "cards-contributor"
        ],
        "defaultContent": [
          ".title"
        ]
      },
      {
        "id": "a3",
        "name": "wknd-guides",
        "selector": [
          "main.cmp-layout-container--fixed .aem-Grid"
        ],
        "style": null,
        "blocks": [
          "cards-contributor"
        ],
        "defaultContent": [
          ".title"
        ]
      },
      {
        "id": "m1",
        "name": "mag-title",
        "selector": [
          ".title.cmp-title--underline"
        ],
        "style": null,
        "blocks": [],
        "defaultContent": [
          "h1",
          ".title"
        ]
      },
      {
        "id": "m2",
        "name": "mag-featured",
        "selector": [
          ".teaser.cmp-teaser--featured"
        ],
        "style": "grey",
        "blocks": [
          "featured-article"
        ],
        "defaultContent": []
      },
      {
        "id": "m3",
        "name": "mag-all-articles",
        "selector": [
          ".image-list.list"
        ],
        "style": null,
        "blocks": [
          "cards"
        ],
        "defaultContent": [
          ".title"
        ]
      },
      {
        "id": "m4",
        "name": "mag-members-only",
        "selector": [
          ".teaser.cmp-teaser--secure",
          ".title.cmp-title--underline:nth-of-type(5)"
        ],
        "style": null,
        "blocks": [
          "cards-secure"
        ],
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
      if (parser) { try { parser(block.element, { document, url, params }); } catch (e) { console.error(`Failed to parse ${block.name} (${block.selector}):`, e); } }
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
