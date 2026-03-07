function saveFormStamp() {
  const newKey = UI.get('event-key').value;
  const eventData = getFormData();
  eventData.parameters = getEventParameters();

  if (eventData.req.length === 0) eventData.req = undefined;
  if (eventData.ops.length === 0) eventData.ops = undefined;

  if (currentEditingKey && currentEditingKey !== newKey) {
    delete events[currentEditingKey];
  }
  events[newKey] = eventData;
}

function getFormData() {
  const data = {};
  data.text = eventText.value;
  data.req = Array.from(reqList.querySelectorAll('div.tag-chip')).map(sub => sub.dataset.tag ?? "").filter(v => v);

  const shared = {
    adds: Array.from(commonAddsList.querySelectorAll('div.tag-chip')).map(sub => sub.dataset.tag ?? "").filter(v => v),
    removes: Array.from(commonRemovesList.querySelectorAll('div.tag-chip')).map(sub => sub.dataset.tag ?? "").filter(v => v),
    triggers: Array.from(commonTriggersList.querySelectorAll('div.tag-chip')).map(sub => sub.dataset.tag ?? "").filter(v => v),
  };

  data.ops = Array.from(opsList.querySelectorAll('.nested-object')).map(div => processOption(div,shared));

  return data;
}

function processOption(div, sharedTags) {
  const ans = {};
  ans.text = div.querySelector('.opt-input').value ?? "";
  
  ans.eff = {};
  ans.eff.adds     = processExtendedList(div, 'adds'    , sharedTags.adds);
  ans.eff.removes  = processExtendedList(div, 'removes' , sharedTags.removes);
  ans.eff.triggers = processExtendedList(div, 'triggers', sharedTags.triggers);

  ans.eff.exec = processWordList(div,'scripts');
  ans.req = processTagList(div,'requires');
  ans.side = processSide(div,'side');
  
  //const inc = { val: parseFloat(div.querySelector('input[type="number"]:nth-of-type(1)').value) || 0 };
  //const red = { val: parseFloat(div.querySelector('input[type="number"]:nth-of-type(2)').value) || 0 };
  //if (inc.length > 0) ans.eff.inc = inc;
  //if (red.length > 0) ans.eff.red = red;

  return ans;
}

function processSide(div) {
  return div.querySelector('.side-picker input:checked').dataset.side;
}

function processWordList(div, key) {
  const list = Array.from(div.querySelectorAll('.'+key+'-list div input')).map(input => input.value ?? "");
  return list.length > 0 ? list : undefined;
}

function processTagList(div, key) {
  const list = Array.from(div.querySelectorAll('.'+key+'-list div.tag-chip')).map(sub => sub.dataset.tag ?? "");
  return list.length > 0 ? new Set(list) : undefined;
}

function processExtendedList(div, key, extension) {
  let list = processTagList(div, key) ?? new Set()
  for (const tag of extension) list.add(tag);
  return list.size == 0 ? undefined : list;
}

function getEventParameters() {
  if (!isParametrized.checked) return undefined;
  var params = {};
  Array.from(paramsList.querySelectorAll('.array-input')).forEach(div => {
    const paramName = div.querySelector('input[placeholder^="Parameter name"]').value;
    const values = div.querySelector('input[placeholder^="Comma-separated"]').value.split(',').map(v => v.trim()).filter(v => v);
    if (paramName) params[paramName] = values;
  });

  return params;
}
