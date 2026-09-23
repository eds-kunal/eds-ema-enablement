/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-hero. Base: carousel.
 * Source: https://wknd.site/us/en.html (.carousel.cmp-carousel--hero)
 * Structure (library-description): 2 columns, one row per slide.
 *   Row cell 1 = image (mandatory). Row cell 2 = content (title, description, CTA).
 * Generated: 2026-09-23
 */
export default function parse(element, { document }) {
  // Each carousel item is a slide. Fall back to teaser wrappers if item class differs.
  let slides = Array.from(element.querySelectorAll('.cmp-carousel__item'));
  if (!slides.length) {
    slides = Array.from(element.querySelectorAll('.teaser.cmp-teaser--hero, .cmp-teaser'));
  }

  const cells = [];

  slides.forEach((slide) => {
    // Image cell (mandatory) - the slide's teaser image.
    const image = slide.querySelector('.cmp-teaser__image img, .cmp-image__image, img');

    // Content cell - title, description, CTA.
    const heading = slide.querySelector('.cmp-teaser__title, h1, h2, h3, h4, h5, h6');
    const description = slide.querySelector('.cmp-teaser__description, p');
    const ctaLinks = Array.from(slide.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a'));

    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    contentCell.push(...ctaLinks);

    // Only emit a slide row when it has real content.
    if (image || contentCell.length) {
      cells.push([image || '', contentCell]);
    }
  });

  // Empty-block guard: nothing extracted.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
