/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-detail. Base: tabs.
 * Source: https://wknd.site/us/en/adventures/bali-surf-camp.html (.tabs.panelcontainer)
 * Structure (library-description): 2 columns, one row per tab.
 *   Cell 1 = tab label (mandatory). Cell 2 = tab panel content (mandatory).
 *   Reference blocks/tabs-detail/tabs-detail.js: first cell = label, second = panel content.
 * Generated: 2026-09-23
 */
export default function parse(element, { document }) {
  // Tab labels live in the tablist; each panel corresponds by order.
  const labels = Array.from(element.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab, .cmp-tabs__tablist li'));
  const panels = Array.from(element.querySelectorAll('.cmp-tabs__tabpanel'));

  const cells = [];

  panels.forEach((panel, i) => {
    // Label text for this tab (fall back to a generic label if missing).
    const label = labels[i];
    const labelText = label ? label.textContent.trim() : '';

    // Content cell: prefer the content-fragment body, else the whole panel content.
    const contentSource = panel.querySelector('.cmp-contentfragment__elements') || panel;
    const contentCell = Array.from(contentSource.children);

    // Only emit a row when there is a label or real content.
    if (labelText || contentCell.length) {
      cells.push([labelText, contentCell.length ? contentCell : '']);
    }
  });

  // Empty-block guard: nothing extracted.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-detail', cells });
  element.replaceWith(block);
}
