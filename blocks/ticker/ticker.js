export default function decorate(block) {
  const source = block.querySelector(':scope > div > div') || block.firstElementChild;
  const items = [...source.children].map((el) => el.textContent.trim()).filter(Boolean);
  if (!items.length) return;

  const track = document.createElement('div');
  track.className = 'ticker-track';

  // duplicate the sequence so the marquee can loop seamlessly
  [0, 1].forEach(() => {
    const group = document.createElement('div');
    group.className = 'ticker-group';
    group.setAttribute('aria-hidden', 'false');
    items.forEach((text) => {
      const span = document.createElement('span');
      span.className = 'ticker-item';
      span.textContent = text;
      group.append(span);
    });
    track.append(group);
  });
  // the second copy is purely decorative
  track.children[1].setAttribute('aria-hidden', 'true');

  block.replaceChildren(track);
}
