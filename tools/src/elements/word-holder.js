function add_wordList(divholder, list, title, placeholder) {
  let taglist = null;
  const mydiv = UI.make('div').class('option-category').childOf(divholder).withChilds(
    UI.make('lavel').textContent(title+":"),
    UI.make('div').class(title.toLowerCase() + '-list').execute(cont => {
      taglist = cont;
      if (list) list.forEach(val => addArrayInput(cont, placeholder, val));
    }),
    UI.make('button').textContent('New').on('click',(e) => {
      e.preventDefault();
      addArrayInput(taglist, placeholder);
    })
  ).getElement();
  return mydiv;
}

function addArrayInput(container, placeholder, value = '') {
  const div = UI.make('div').class('array-input','oneline').childOf(container).withChilds(
    UI.make('input').ofType('text').placeholder(placeholder).value(value).focus(),
    UI.make('button').class('btnrmv').textContent('Remove').on('click', () => div.remove())
  ).getElement();
}