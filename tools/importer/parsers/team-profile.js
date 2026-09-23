/* eslint-disable */
/* global WebImporter */
/**
 * Parser for team-profile. Base: team-profile.
 * Source: https://wknd.site/us/en/magazine/arctic-surfing.html (.cmp-byline)
 * Structure (from blocks/team-profile/team-profile.js decorate):
 *   One row, 2 columns.
 *   Cell 1 (intro) = author portrait (picture/img) + name paragraph.
 *     decorate() flags the cell containing a <picture> as `.team-profile-intro`
 *     and the direct-child <p> without a picture as `.team-profile-name`, so
 *     the name is emitted as a <p> (not a heading).
 *   Cell 2 (bio) = role / occupations paragraph (the cell with no picture).
 * Generated: 2026-09-23
 */
export default function parse(element, { document }) {
  // Author portrait.
  const image = element.querySelector('.cmp-byline__image img, .cmp-image__image, img');

  // Author name (source is an <h2>; emit as a <p> so decorate tags it as the name).
  const nameEl = element.querySelector('.cmp-byline__name, h1, h2, h3, h4, h5, h6');
  let nameP;
  if (nameEl) {
    const nameText = nameEl.textContent.trim();
    if (nameText) {
      nameP = document.createElement('p');
      nameP.textContent = nameText;
    }
  }

  // Author role / occupations.
  const roleEl = element.querySelector('.cmp-byline__occupations, p');

  // Empty-block guard: nothing meaningful to render.
  if (!image && !nameP && !roleEl) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Intro cell: portrait + name paragraph (must be siblings for decorate()).
  const introCell = [];
  if (image) introCell.push(image);
  if (nameP) introCell.push(nameP);

  // Bio cell: role / occupations.
  const bioCell = [];
  if (roleEl) bioCell.push(roleEl);

  const cells = [[introCell, bioCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'team-profile', cells });
  element.replaceWith(block);
}
