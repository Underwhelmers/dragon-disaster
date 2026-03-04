function addParamInput(paramName = '', values = []) {
  const div = UI.make('div').class('array-input').childOf(paramsList).withChilds(
    UI.make('input').ofType('text').placeholder('Parameter name').value(paramName),
    UI.make('input').ofType('text').placeholder('Comma-separated values').value(values.join(',')),
    
    // The lambda in click, will not execute before the div is instantiated.
    UI.make('button').textContent('Remove').on('click', () => div.remove())
  ).getElement();
}