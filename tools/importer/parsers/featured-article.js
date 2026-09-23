/* eslint-disable */
/* global WebImporter */
/**
 * Parser for featured-article. Base: featured-article (custom block).
 * Source: https://wknd.site/us/en.html (.teaser.cmp-teaser--featured)
 * Structure (from blocks/featured-article/featured-article.js): single row, 2 columns.
 *   Cell 1 = image. Cell 2 = body (eyebrow/pretitle, heading, description, CTA).
 * Generated: 2026-09-23
 */
export default function parse(element, { document }) {
  // Image cell.
  const image = element.querySelector('.cmp-teaser__image img, .cmp-image__image, img');

  // Body cell content.
  const eyebrow = element.querySelector('.cmp-teaser__pretitle');
  const heading = element.querySelector('.cmp-teaser__title, h1, h2, h3, h4, h5, h6');
  // Exclude the pretitle from the paragraph fallback so it is not double-selected as the description.
  const description = element.querySelector('.cmp-teaser__description, p:not(.cmp-teaser__pretitle)');
  const ctaLinks = Array.from(element.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a'));

  const bodyCell = [];
  if (eyebrow) bodyCell.push(eyebrow);
  if (heading) bodyCell.push(heading);
  if (description) bodyCell.push(description);
  bodyCell.push(...ctaLinks);

  // Empty-block guard.
  if (!image && !bodyCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[image || '', bodyCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'featured-article', cells });
  element.replaceWith(block);
}
