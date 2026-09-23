import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer fragment — metadata-independent: /content first (local), then root (DA/EDS prod)
  let footerPath = '/content/footer';
  try {
    const resp = await fetch(`${footerPath}.plain.html`);
    if (!resp.ok) footerPath = '/footer';
  } catch (e) {
    footerPath = '/footer';
  }
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);
}
