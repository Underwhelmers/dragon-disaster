function add_tagList(divholder, list, title) {
  UI.make('div').class('option-category').style({flex:"1"}).childOf(divholder).withChilds(
    UI.make('label').textContent(title+':'),
    UI.make('div').class(title.toLowerCase() + '-list','tag-holder').execute(cont => {
      makeTagHolderDroppable(cont);
      if (list) list.forEach(val => addTagElm(cont, val));
    })
  );
}

function makeTagHolderDroppable(holder) {
  holder.addEventListener('dragover', (e) => {
    e.preventDefault();
    holder.classList.add('drag-over');
  });

  holder.addEventListener('dragleave', () => {
    holder.classList.remove('drag-over');
  });

  holder.addEventListener('drop', (e) => {
    e.preventDefault();
    holder.classList.remove('drag-over');

    const tagValue = e.dataTransfer.getData('text/plain')?.trim();
    if (!tagValue) return;

    // Prevent adding the same tag twice
    const alreadyHas = Array.from(holder.children).some(
      el => el.dataset.tag === tagValue
    );
    if (alreadyHas) return;

    addTagElm(holder, tagValue);
  });

  holder.addEventListener('dblclick', () => {
    const inpt = UI.make('input').ofType('text').placeholder('new tag...').childOf(holder).focus()
    .on('blur',() => {
      if (inpt && inpt.value && inpt.value.trim() !== '')
        addTagElm(holder, inpt.value.trim());
      inpt.remove();
    })
    .on('keydown', e => {
      if (e.key === 'Enter')  { e.preventDefault(); inpt.blur(); }
      if (e.key === 'Escape') { e.preventDefault(); inpt.blur(); }
    })
    .getElement();
  });
}