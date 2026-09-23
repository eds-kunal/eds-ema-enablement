/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-magazine.js
  var import_magazine_exports = {};
  __export(import_magazine_exports, {
    default: () => import_magazine_default
  });

  // tools/importer/parsers/team-profile.js
  function parse(element, { document: document2 }) {
    const image = element.querySelector(".cmp-byline__image img, .cmp-image__image, img");
    const nameEl = element.querySelector(".cmp-byline__name, h1, h2, h3, h4, h5, h6");
    let nameP;
    if (nameEl) {
      const nameText = nameEl.textContent.trim();
      if (nameText) {
        nameP = document2.createElement("p");
        nameP.textContent = nameText;
      }
    }
    const roleEl = element.querySelector(".cmp-byline__occupations, p");
    if (!image && !nameP && !roleEl) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const introCell = [];
    if (image) introCell.push(image);
    if (nameP) introCell.push(nameP);
    const bioCell = [];
    if (roleEl) bioCell.push(roleEl);
    const cells = [[introCell, bioCell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "team-profile", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse2(element, { document: document2 }) {
    const upNextItems = Array.from(element.querySelectorAll("li.cmp-list__item, .cmp-list__item"));
    const isUpNext = upNextItems.length > 0 && !element.querySelector(".cmp-image-list__item-image img, .cmp-image__image, img");
    const cells = [];
    if (isUpNext) {
      upNextItems.forEach((item) => {
        const link = item.querySelector(".cmp-list__item-link, a");
        const titleEl = item.querySelector(".cmp-list__item-title");
        const dateEl = item.querySelector(".cmp-list__item-date");
        const href = link && link.href;
        const titleText = (titleEl ? titleEl.textContent : link ? link.textContent : "").trim();
        const bodyCell = [];
        if (titleText) {
          const heading = document2.createElement("h3");
          if (href) {
            const a = document2.createElement("a");
            a.href = href;
            a.textContent = titleText;
            heading.append(a);
          } else {
            heading.textContent = titleText;
          }
          bodyCell.push(heading);
        }
        if (dateEl) {
          const dateText = dateEl.textContent.trim();
          if (dateText) {
            const p = document2.createElement("p");
            p.textContent = dateText;
            bodyCell.push(p);
          }
        }
        if (bodyCell.length) cells.push([bodyCell]);
      });
    } else {
      const items = Array.from(element.querySelectorAll(".cmp-image-list__item, li"));
      items.forEach((item) => {
        const image = item.querySelector(".cmp-image-list__item-image img, .cmp-image__image, img");
        const titleEl = item.querySelector(".cmp-image-list__item-title, h1, h2, h3, h4, h5, h6");
        const titleLinkHref = (item.querySelector(".cmp-image-list__item-title-link") || {}).href || (item.querySelector(".cmp-image-list__item-image-link") || {}).href;
        const description = item.querySelector(".cmp-image-list__item-description, p");
        const bodyCell = [];
        if (titleEl) {
          const heading = document2.createElement("h3");
          const titleText = titleEl.textContent.trim();
          if (titleLinkHref) {
            const a = document2.createElement("a");
            a.href = titleLinkHref;
            a.textContent = titleText;
            heading.append(a);
          } else {
            heading.textContent = titleText;
          }
          bodyCell.push(heading);
        }
        if (description) bodyCell.push(description);
        if (image || bodyCell.length) {
          cells.push([image || "", bodyCell]);
        }
      });
    }
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        'iframe[id*="destination_publishing"]'
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.cmp-experiencefragment--header",
        "footer.cmp-experiencefragment--footer",
        "#toggleNav",
        "#mobileNav",
        ".cmp-navigation--mobile"
      ]);
      element.querySelectorAll("meta").forEach((el) => el.remove());
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-cmp-data-layer");
        el.removeAttribute("data-cmp-data-layer-enabled");
        el.removeAttribute("data-cmp-data-layer-name");
        el.removeAttribute("data-cmp-link-accessibility-enabled");
        el.removeAttribute("data-cmp-link-accessibility-text");
      });
    }
  }

  // tools/importer/transformers/wknd-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || querySection(element, section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-magazine.js
  var parsers = {
    "team-profile": parse,
    cards: parse2
  };
  var PAGE_TEMPLATE = {
    "name": "magazine",
    "description": "WKND magazine article: lead image, article body (default content), author profile, and up-next related stories.",
    "urls": [
      "https://wknd.site/us/en/magazine/arctic-surfing.html",
      "https://wknd.site/us/en/magazine/guide-la-skateparks.html",
      "https://wknd.site/us/en/magazine/san-diego-surf.html",
      "https://wknd.site/us/en/magazine/ski-touring.html",
      "https://wknd.site/us/en/magazine/western-australia.html"
    ],
    "blocks": [
      {
        "name": "team-profile",
        "instances": [
          ".cmp-byline"
        ]
      },
      {
        "name": "cards",
        "instances": [
          ".list.cmp-list--upnext"
        ]
      }
    ],
    "sections": [
      {
        "id": "s1",
        "name": "lead-image",
        "selector": [
          "main.cmp-layout-container--fixed > div > .aem-Grid > .image",
          "main.cmp-layout-container--fixed"
        ],
        "style": null,
        "blocks": [],
        "defaultContent": [
          ".image"
        ]
      },
      {
        "id": "s2",
        "name": "article-body",
        "selector": [
          "main.aem-GridColumn--default--8 .cmp-container",
          "main.cmp-layout-container--fixed"
        ],
        "style": null,
        "blocks": [
          "team-profile"
        ],
        "defaultContent": [
          "h1",
          ".text",
          ".title"
        ]
      },
      {
        "id": "s3",
        "name": "up-next",
        "selector": [
          ".list.cmp-list--upnext",
          "aside.cmp-layoutcontainer--sidebar"
        ],
        "style": null,
        "blocks": [
          "cards"
        ],
        "defaultContent": []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        elements.forEach((element) => {
          pageBlocks.push({ name: blockDef.name, selector, element, section: blockDef.section || null });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_magazine_default = {
    transform: (payload) => {
      const { document: document2, url, html, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{ element: main, path, report: { title: document2.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) } }];
    }
  };
  return __toCommonJS(import_magazine_exports);
})();
