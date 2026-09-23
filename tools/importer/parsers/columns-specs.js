/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-specs. Base: columns.
 * Source: https://wknd.site/us/en/adventures/... (.cmp-contentfragment__elements)
 * Structure (library-description): multi-column columns block. For specs we emit
 *   one row per spec with 2 columns: [label, value].
 *   Reference blocks/columns-specs/columns-specs.js expects rows of [label cell, value cell].
 * Generated: 2026-09-23
 */
export default function parse(element, { document }) {
  // Each spec is a content-fragment element with a title (label) and a value.
  let specs = Array.from(element.querySelectorAll('.cmp-contentfragment__element'));
  // Fallback: some content fragments render as plain dt/dd pairs without wrappers.
  const cells = [];

  if (specs.length) {
    specs.forEach((spec) => {
      const label = spec.querySelector('.cmp-contentfragment__element-title, dt');
      const value = spec.querySelector('.cmp-contentfragment__element-value, dd');
      const labelText = label ? label.textContent.trim() : '';
      const valueText = value ? value.textContent.trim() : '';
      // Only emit a row when there is a label or value.
      if (labelText || valueText) {
        cells.push([labelText, valueText]);
      }
    });
  } else {
    // Fallback: pair sequential dt/dd children.
    const dts = Array.from(element.querySelectorAll('dt'));
    dts.forEach((dt) => {
      const dd = dt.nextElementSibling && dt.nextElementSibling.matches('dd')
        ? dt.nextElementSibling : null;
      const labelText = dt.textContent.trim();
      const valueText = dd ? dd.textContent.trim() : '';
      if (labelText || valueText) {
        cells.push([labelText, valueText]);
      }
    });
  }

  // Empty-block guard: nothing extracted.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-specs', cells });
  element.replaceWith(block);
}
