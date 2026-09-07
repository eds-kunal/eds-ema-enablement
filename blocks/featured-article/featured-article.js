import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  [...row.children].forEach((col) => {
    if (col.querySelector('picture')) col.className = 'featured-article-image';
    else col.className = 'featured-article-body';
  });

  block.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    );
  });

  block.querySelectorAll('.featured-article-body a').forEach((a) => {
    a.classList.add('button', 'primary');
    const p = a.closest('p');
    if (p) p.classList.add('button-wrapper');
  });
}
