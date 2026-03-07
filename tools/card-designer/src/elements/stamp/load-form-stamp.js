function loadFormStamp(key) {
  const event = events[key];
  clearForm();

  UI.get('event-key').value = key;
  event.req?.forEach(req => addTagElm(reqList, req));
  eventText.value = event.text;

  if (event.params) {
    isParametrized.checked = true;
    paramsSection.style.display = 'block';
    Object.keys(event.params).forEach(param => addParamInput(param, event.params[param]));
  }
  
  if (event.ops) {
    const inall = getSharedTags(event.ops);
    inall.adds.forEach(req => addTagElm(commonAddsList, req));
    inall.removes.forEach(req => addTagElm(commonRemovesList, req));
    inall.triggers.forEach(req => addTagElm(commonTriggersList, req));

    event.ops.forEach(op => addOptionInput(op, inall));
  }
}

function getSharedTags(allOptions) {
  if (allOptions.length === 0 || allOptions.lenght === 1) {
    return { triggers: new Set(), adds: new Set(), removes: new Set() };
  }

  const common = {
    adds:     new Set(allOptions[0].eff?.adds     ?? []),
    removes:  new Set(allOptions[0].eff?.removes  ?? []),
    triggers: new Set(allOptions[0].eff?.triggers ?? []),
  };

  for (let i = 1; i < allOptions.length; i++) {
    const op = allOptions[i];
    common.adds     = intersectSets(common.adds,     op.eff?.adds);
    common.removes  = intersectSets(common.removes,  op.eff?.removes);
    common.triggers = intersectSets(common.triggers, op.eff?.triggers);
  }

  return common;
}

function intersectSets(setA, setB) {
  if (setA.lenght == 0 || !setB || setB.length == 0)
    return new Set();

  const result = new Set();
  
  for (const item of setA)
    if (setB.has(item)) 
      result.add(item);

  return result;
}