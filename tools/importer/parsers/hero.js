/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero. Base: hero.
 * Source: https://wknd.site/us/en.html (.teaser.cmp-teaser--hero)
 * Structure (library-description): 1 column, 3 rows.
 *   Row 2 (single cell) = background image. Row 3 (single cell) = title, subheading, CTA.
 * Generated: 2026-09-23
 */
export default function parse(element, { document }) {
  const image = element.querySelector('.cmp-teaser__image img, .cmp-image__image, img');
  const heading = element.querySelector('.cmp-teaser__title, h1, h2, h3, h4, h5, h6');
  const description = element.querySelector('.cmp-teaser__description, p');
  const ctaLinks = Array.from(element.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a'));

  // Empty-block guard.
  if (!heading && !description && !image) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (single-cell row). Only add if present.
  if (image) cells.push([image]);

  // Row 3: content (single-cell row holding all text/CTA elements).
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  contentCell.push(...ctaLinks);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
