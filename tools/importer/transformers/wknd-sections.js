/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND section breaks / section metadata.
 * Driven by payload.template.sections (see tools/importer/page-templates.json).
 * The "home" template defines 5 sections, so 4 section breaks (<hr>) are inserted
 * (one before every section except the first). All WKND home sections have
 * style: null, so no Section Metadata blocks are produced.
 *
 * Breaks are inserted in beforeTransform (while every section element still exists,
 * before block parsers can replace them). Section Metadata (for any styled section)
 * is anchored in afterTransform to a temporary marker <hr>. Both loops walk the
 * sections in reverse so live element references stay valid.
 * Selectors come directly from page-templates.json (DOM-verified in page analysis).
 */

const SECTION_MARKER_ATTR = 'data-excat-section-id';

// section.selector is an array of candidate selectors — try each in order, first match wins.
function querySection(root, selectors) {
  for (const sel of selectors) {
    const el = root.querySelector(sel);
    if (el) return el;
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const sections = (payload.template && payload.template.sections) || [];

  if (hookName === 'beforeTransform') {
    // Insert breaks now, before parsers can replace any section element.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (i === 0 && !section.style) continue; // first section: no leading break, no metadata
      const sectionEl = querySection(element, section.selector);
      if (!sectionEl) continue; // no selector matched on this page — skip, never guess

      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    // Parsers have now run and may have replaced section elements. Anchor each
    // styled section's Section Metadata block to whichever still exists: the
    // marker <hr> placed above, or (first section, no marker inserted) the
    // original element itself.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue; // WKND home: all styles null → no metadata blocks

      const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
      const anchor = marker || querySection(element, section.selector);
      if (!anchor) continue; // neither survived — skip, never guess

      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      anchor.after(metadataBlock);

      if (marker) {
        marker.removeAttribute(SECTION_MARKER_ATTR);
        if (i === 0) marker.remove(); // section 0 never gets a real leading break
      }
    }
  }
}
