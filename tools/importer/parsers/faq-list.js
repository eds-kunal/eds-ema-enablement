/* eslint-disable */
/* global WebImporter */
/**
 * Parser for faq-list. Base: faq-list.
 * Source: https://wknd.site/us/en/faqs.html (.accordion.panelcontainer)
 * Generated: 2026-09-23
 *
 * Source is an AEM accordion (.accordion.panelcontainer) with one
 * .cmp-accordion__item per Q&A pair. Each item exposes the question in
 * .cmp-accordion__title and the answer body in .cmp-accordion__panel.
 *
 * The faq-list block (blocks/faq-list/faq-list.js) reads each row's two
 * children as [questionCell, answerCell] and builds a <details>/<summary>
 * accordion, so this parser emits ONE ROW PER Q&A pair: [question, answer].
 */
export default function parse(element, { document }) {
  // One item per Q&A pair. Fallbacks cover minor markup variations.
  const items = Array.from(
    element.querySelectorAll('.cmp-accordion__item, [class*="accordion__item"]'),
  );

  const cells = [];

  items.forEach((item) => {
    // Question: the accordion title text.
    const titleEl = item.querySelector(
      '.cmp-accordion__title, [class*="accordion__title"]',
    );

    // Answer: the panel body. Prefer the inner text component(s); otherwise
    // fall back to the whole panel's content nodes.
    const panel = item.querySelector(
      '.cmp-accordion__panel, [class*="accordion__panel"]',
    );

    if (!titleEl && !panel) return;

    // Build the question cell as a heading (preserves semantics for summary).
    const question = document.createElement('p');
    if (titleEl) question.textContent = titleEl.textContent.trim();

    // Build the answer cell contents.
    const answerNodes = [];
    if (panel) {
      const textEls = panel.querySelectorAll(
        '.cmp-text, [class*="cmp-text"]',
      );
      if (textEls.length) {
        textEls.forEach((t) => {
          // Move the meaningful child nodes (paragraphs, headings, etc.).
          answerNodes.push(...Array.from(t.childNodes));
        });
      } else {
        // Fallback: take the panel's own content nodes.
        answerNodes.push(...Array.from(panel.childNodes));
      }
    }

    // Skip empty pairs.
    if (!titleEl && answerNodes.length === 0) return;

    cells.push([question, answerNodes]);
  });

  // Empty-block guard: nothing extracted, unwrap in place.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'faq-list',
    cells,
  });
  element.replaceWith(block);
}
