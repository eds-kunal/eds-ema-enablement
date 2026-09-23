import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-contributor-card-image';
      else div.className = 'cards-contributor-card-body';
    });
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });

  /* structure the card body: name (h3) + role (first <p>) + social links row */
  ul.querySelectorAll('.cards-contributor-card-body').forEach((body) => {
    const paras = [...body.querySelectorAll(':scope > p')];
    // social links = paragraphs whose only content is a single link
    const socialParas = paras.filter((p) => {
      const a = p.querySelector('a');
      return a && p.children.length === 1 && p.textContent.trim() === a.textContent.trim();
    });
    // the remaining leading paragraph is the role
    const rolePara = paras.find((p) => !socialParas.includes(p));
    if (rolePara) rolePara.className = 'cards-contributor-role';

    if (socialParas.length) {
      const social = document.createElement('p');
      social.className = 'cards-contributor-social';
      socialParas.forEach((p) => {
        const a = p.querySelector('a');
        a.setAttribute('aria-label', a.textContent.trim());
        social.append(a);
        p.remove();
      });
      body.append(social);
    }
  });

  block.textContent = '';
  block.append(ul);
}
