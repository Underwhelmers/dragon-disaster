function addTagElm(container, value) {
  if (!value || typeof value !== 'string') return;

  const normalized = value.trim();
  const isNegated = normalized.startsWith('!');
  const cleanValue = isNegated ? normalized.slice(1) : normalized;

  const chip = UI.make('div').draggable(true).childOf(container)
    .class('tag-chip', (isNegated ? 'negated' : ''))
    .dataset({tag: normalized, cleanTag: cleanValue})
    .withChilds(
      UI.make('span').class('tag-name').innerHTML(normalized),
      UI.make('span').class('tag-remove').innerHTML('X').on('click',e => {
        e.stopPropagation(); chip.remove();
      })
    ).getElement();

  // Toggle negation on click
  const negateFunc = () => {
    const currentlyNegated = chip.dataset.tag.startsWith('!');
    const newValue = currentlyNegated ? cleanValue : '!' + cleanValue;

    chip.dataset.tag = newValue;
    chip.querySelector('.tag-name').innerHTML = newValue;
    chip.classList.toggle('negated', !currentlyNegated);
  };

  chip.ondblclick = (e) => {
    e.stopPropagation();
    negateFunc();
  };

  // Drag — always drag the CURRENT value (with or without !)
  chip.addEventListener('dragstart', (e) => {
    chip.classList.add('dragging');
    e.dataTransfer.setData('text/plain', chip.dataset.tag);
    e.dataTransfer.effectAllowed = 'move';
  });

  chip.addEventListener('dragend', () => {
    chip.classList.remove('dragging');
  });
}