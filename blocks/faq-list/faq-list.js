export default function decorate(block) {
  [...block.children].forEach((row) => {
    const [questionCell, answerCell] = row.children;
    if (!questionCell || !answerCell) return;

    const details = document.createElement('details');
    details.className = 'faq-list-item';

    const summary = document.createElement('summary');
    summary.className = 'faq-list-question';
    summary.append(...questionCell.childNodes);

    const answer = document.createElement('div');
    answer.className = 'faq-list-answer';
    answer.append(...answerCell.childNodes);

    details.append(summary, answer);
    row.replaceWith(details);
  });
}
