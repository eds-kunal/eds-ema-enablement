export default function decorate(block) {
  [...block.children].forEach((row) => {
    const [numberCell, bodyCell] = row.children;
    row.classList.add('editorial-index-item');
    if (numberCell) numberCell.classList.add('editorial-index-number');
    if (bodyCell) bodyCell.classList.add('editorial-index-body');
  });
}
