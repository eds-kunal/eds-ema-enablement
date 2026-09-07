import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  [...row.children].forEach((col) => {
    if (col.querySelector('picture')) col.className = 'team-profile-intro';
    else col.className = 'team-profile-bio';
  });

  // the name lives in the paragraph that has no picture inside the intro cell
  const intro = block.querySelector('.team-profile-intro');
  if (intro) {
    intro.querySelectorAll(':scope > p').forEach((p) => {
      if (!p.querySelector('picture')) p.classList.add('team-profile-name');
    });
  }

  block.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    );
  });
}
