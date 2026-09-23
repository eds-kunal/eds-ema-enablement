/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-secure. Base: cards.
 * Source: https://wknd.site/us/en/magazine.html — "Members Only" grid.
 *   Selectors (page-templates.json instances[]):
 *     .list.cmp-list--members, .cmp-list--members-only
 *
 * NOTE: This structure is NOT present in the cached about-us cleaned.html, so
 * there is no cached source.html to validate against. The parser is built
 * defensively from the block model (blocks/cards-secure/cards-secure.js) and
 * mirrors the existing cards / featured-article parser patterns.
 *
 * Structure (library "Cards"): 2 columns, one row per card.
 *   Cell 1 = image / icon (mandatory when present).
 *   Cell 2 = text: title (heading), description, "Read More" CTA link.
 * Generated: 2026-09-23
 */
export default function parse(element, { document }) {
  // Locate the individual secure teaser/list items. AEM lists and teasers vary,
  // so try the common item wrappers in priority order and fall back to <li>.
  let items = Array.from(element.querySelectorAll(
    '.cmp-list__item, .cmp-teaser, .cmp-image-list__item',
  ));
  if (!items.length) {
    items = Array.from(element.querySelectorAll(':scope > li, li'));
  }
  // If the element itself IS a single teaser (selector matched one card), treat
  // it as the sole item.
  if (!items.length && element.matches('.cmp-teaser, .cmp-list__item')) {
    items = [element];
  }

  const cells = [];

  items.forEach((item) => {
    // Image cell — cover common teaser/list/image markup.
    const image = item.querySelector(
      '.cmp-teaser__image img, .cmp-list__item-image img, .cmp-image-list__item-image img, .cmp-image__image, img',
    );

    // Title — prefer teaser/list title classes, fall back to any heading.
    const titleEl = item.querySelector(
      '.cmp-teaser__title, .cmp-list__item-title, .cmp-image-list__item-title, .cmp-title__text, h1, h2, h3, h4, h5, h6',
    );

    // Title link (destination) so the heading stays clickable if present.
    const titleLink = item.querySelector(
      '.cmp-teaser__title-link, .cmp-list__item-title-link, .cmp-list__item-link, .cmp-image-list__item-title-link',
    );
    const titleLinkHref = titleLink && titleLink.getAttribute('href');

    // Description — teaser/list description, excluding the date/eyebrow.
    const description = item.querySelector(
      '.cmp-teaser__description, .cmp-list__item-description, .cmp-image-list__item-description, p:not(.cmp-teaser__pretitle):not(.cmp-list__item-date)',
    );

    // CTA — "Read More" / action links.
    const ctaLinks = Array.from(item.querySelectorAll(
      '.cmp-teaser__action-link, .cmp-teaser__action-container a, .cmp-list__item-cta, a.cmp-button',
    ));

    const bodyCell = [];
    if (titleEl) {
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
    ctaLinks.forEach((link) => {
      if (!link.getAttribute('href')) return;
      const a = document.createElement('a');
      a.href = link.getAttribute('href');
      const label = (link.querySelector('.cmp-button__text') || link).textContent.trim();
      a.textContent = label || 'Read More';
      const p = document.createElement('p');
      p.append(a);
      bodyCell.push(p);
    });

    if (image || bodyCell.length) {
      cells.push([image || '', bodyCell]);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-secure', cells });
  element.replaceWith(block);
}
