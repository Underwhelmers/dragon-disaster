class EventOptionEffect {
  constructor() {
    this.adds = new Set();
    this.removes = new Set();
    this.triggers = new Set();
    this.exec = [];
  }
}

class EventOption {
  constructor() {
    this.text = '';
    this.side = '';
    this.req = new Set();
    this.eff = new EventOptionEffect();
  };
}
let radioIdx = 0;

function addOptionInput(op = new EventOption(), sharedTags = new EventOptionEffect()) {
  const div = UI.make('div').class('nested-object').childOf(opsList).withChilds(
    UI.make('div').style({gap:'6px'}).class('oneline').withChilds(
      UI.make('div').style({gap: '6px', display:'flex'}).withChilds(
        UI.make('textarea').value(op.text).placeholder('Option text').class('opt-input').focus()
      ),
      UI.make('div').style({gap: '6px', flex:'1'}).class('oneline').execute((subdiv1) => {
        const radioName = 'side-'+ (radioIdx++);
        UI.make('div').class('side-picker').childOf(subdiv1).withChilds(
          UI.make('label').text('SIDE: '),
          UI.make('label').text('left').class('side-btn','side-left').withChilds(
            UI.make('input').ofType('radio').name(radioName).dataset({side:'left'})
              .checked(op.side !== 'right').on('change', () => op.side = 'left'),
          ),
          UI.make('label').text('right').class('side-btn','side-right').withChilds(
            UI.make('input').ofType('radio').name(radioName).dataset({side:'right'})
              .checked(op.side === 'right').on('change', () => op.side = 'right'),
          )
        )
        // make a radio button that holds "left" "right", takes the value form op.side (the default is the left)
        add_tagList(subdiv1, op.req, 'Requires');
        add_tagList(subdiv1, tagSetExcluding(op.eff.triggers, sharedTags.triggers), 'Triggers');
        add_tagList(subdiv1, tagSetExcluding(op.eff.adds    , sharedTags.adds    ), 'Adds');
        add_tagList(subdiv1, tagSetExcluding(op.eff.removes , sharedTags.removes ), 'Removes');
        var execDiv = add_wordList(subdiv1, op.eff.exec, 'Scripts', '0:Script name, 1+:params value');
        execDiv.style.flex = '1';
        execDiv.style.minWidth = '180px';
        execDiv.style.minHeight = '38px';
      })
    ),

    UI.make('button').class('rem-op-btn').ofType('button').textContent('Remove').on('click',() => div.remove())
  ).getElement();
}

function tagSetExcluding(set, excluded) {
  if (!set || set.size == 0) return new Set();
  if (excluded.size == 0) return new Set(set);

  const result = new Set();
  
  for (const item of set)
    if (!excluded.has(item)) 
      result.add(item);

  return result;
}