/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-contributor. Base: cards.
 * Source: https://wknd.site/us/en/about-us.html
 *   (.experiencefragment.cmp-experience-fragment--contributor)
 *
 * IMPORTANT: the selector matches EACH PERSON individually (7 contributors
 * across two grids on about-us). The importer therefore invokes this parser
 * once per person element. blocks/cards-contributor/cards-contributor.js
 * expects one ROW PER PERSON: [image cell (avatar), body cell (name, role,
 * social links)]. So each invocation emits a single-row card table for that
 * one person; the framework replaces each person element with its own block
 * (acceptable for DA — each becomes a card).
 *
 * Structure (library "Cards"): 2 columns.
 *   Cell 1 = avatar image (mandatory).
 *   Cell 2 = body: name (heading), role/occupations, social-media links.
 * Generated: 2026-09-23
 */
export default function parse(element, { document }) {
  // Avatar image cell.
  const image = element.querySelector('.cmp-image__image, .cmp-image img, img');

  // Titles: the source has two `.title` blocks per person — the first is the
  // NAME, the second is the ROLE/occupations line. The role's modifier class
  // varies across people (.cmp-title--black on some, plain .title on others),
  // so select positionally rather than by modifier. Restrict to titles OUTSIDE
  // the social button list so icon labels are never picked up as a title.
  const titleEls = Array.from(
    element.querySelectorAll('.title .cmp-title__text'),
  ).filter((t) => !t.closest('.cmp-buildingblock--btn-list'));
  const nameEl = titleEls[0]
    || element.querySelector('.cmp-title__text, h1, h2, h3, h4, h5, h6');
  const roleEl = titleEls[1] || null;

  // Social-media icon links (scoped to the button list).
  const socialLinks = Array.from(
    element.querySelectorAll('.cmp-buildingblock--btn-list a.cmp-button, .cmp-buildingblock--btn-list a[href]'),
  );

  const bodyCell = [];

  if (nameEl) {
    const heading = document.createElement('h3');
    heading.textContent = nameEl.textContent.trim();
    bodyCell.push(heading);
  }

  if (roleEl) {
    const role = document.createElement('p');
    role.textContent = roleEl.textContent.trim();
    bodyCell.push(role);
  }

  // Preserve each social link as an anchor (href + label). The source anchor
  // wraps an icon span and a text span; keep the visible label as link text.
  // Wrap each in its own paragraph: some people share one placeholder href
  // across all three links, and the markdown converter merges adjacent
  // same-href anchors into one — separate paragraphs keep them distinct.
  socialLinks.forEach((link) => {
    if (!link.getAttribute('href')) return;
    const a = document.createElement('a');
    a.href = link.getAttribute('href');
    const label = (link.querySelector('.cmp-button__text') || link).textContent.trim();
    a.textContent = label || link.getAttribute('href');
    const p = document.createElement('p');
    p.append(a);
    bodyCell.push(p);
  });

  // Empty-block guard.
  if (!image && !bodyCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[image || '', bodyCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-contributor', cells });
  element.replaceWith(block);
}
