/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards. Base: cards.
 * Handles TWO source structures, producing the same cards block table:
 *   1. Image list (.image-list.list) — home & adventures-2 pages.
 *      Each item has an image + title (+ optional description). Emitted as a
 *      2-column row per card: [image, title/description] (library "Cards").
 *   2. Up-next list (.list.cmp-list--upnext) — magazine articles.
 *      Each item is a link with a title + date, NO image. Emitted as a
 *      1-column row per card: [title-link + date] (library "Cards (no images)").
 * Sources:
 *   https://wknd.site/us/en.html (.image-list.list)
 *   https://wknd.site/us/en/magazine/arctic-surfing.html (.list.cmp-list--upnext)
 * Structure (library-description):
 *   "Cards": 2 columns — cell 1 image (mandatory), cell 2 text (title/desc/CTA).
 *   "Cards (no images)": 1 column — text only (heading/desc/CTA).
 * Generated: 2026-09-23
 */
export default function parse(element, { document }) {
  // Detect the up-next (.cmp-list) structure: items with no images, link + title + date.
  const upNextItems = Array.from(element.querySelectorAll('li.cmp-list__item, .cmp-list__item'));
  const isUpNext = upNextItems.length > 0
    && !element.querySelector('.cmp-image-list__item-image img, .cmp-image__image, img');

  const cells = [];

  if (isUpNext) {
    // --- Up-next list: 1-column, no images. Title (linked heading) + date. ---
    upNextItems.forEach((item) => {
      const link = item.querySelector('.cmp-list__item-link, a');
      const titleEl = item.querySelector('.cmp-list__item-title');
      const dateEl = item.querySelector('.cmp-list__item-date');
      const href = link && link.href;
      const titleText = (titleEl ? titleEl.textContent : (link ? link.textContent : '')).trim();

      const bodyCell = [];
      if (titleText) {
        // Linked heading preserves both the title and its destination.
        const heading = document.createElement('h3');
        if (href) {
          const a = document.createElement('a');
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
          const p = document.createElement('p');
          p.textContent = dateText;
          bodyCell.push(p);
        }
      }

      if (bodyCell.length) cells.push([bodyCell]);
    });
  } else {
    // --- Image list: 2-column, image + text (existing home/adventures-2 behavior). ---
    const items = Array.from(element.querySelectorAll('.cmp-image-list__item, li'));

    items.forEach((item) => {
      // Image cell.
      const image = item.querySelector('.cmp-image-list__item-image img, .cmp-image__image, img');

      // Text cell: title, description, and the card link (as CTA).
      const titleEl = item.querySelector('.cmp-image-list__item-title, h1, h2, h3, h4, h5, h6');
      const titleLinkHref = (item.querySelector('.cmp-image-list__item-title-link') || {}).href
        || (item.querySelector('.cmp-image-list__item-image-link') || {}).href;
      const description = item.querySelector('.cmp-image-list__item-description, p');

      const bodyCell = [];
      if (titleEl) {
        // Wrap the title text in a linked heading so both the title and its destination are preserved.
        const heading = document.createElement('h3');
        const titleText = titleEl.textContent.trim();
        if (titleLinkHref) {
          const a = document.createElement('a');
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
        cells.push([image || '', bodyCell]);
      }
    });
  }

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
  element.replaceWith(block);
}
