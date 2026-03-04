function triggerInputLoad() {
  UI.get('file-input').click()
}

function loadEvents(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    events = JSON.parse(ev.target.result);
    for (const ev of Object.values(events)) {
      if (!ev.ops) continue;

      for (const op of ev.ops) { // ops is array
        if (op.req) op.req = new Set(op.req);

        if (!op.eff) continue;
        if (op.eff.adds)     op.eff.adds     = new Set(op.eff.adds);
        if (op.eff.removes)  op.eff.removes  = new Set(op.eff.removes);
        if (op.eff.triggers) op.eff.triggers = new Set(op.eff.triggers);
      }
    }
    renderEvents();
  };
  reader.readAsText(file);
}

function downloadEvents() {
  const jsonEvents = JSON.stringify(events, parseCustomValues, 2);
  const blob = new Blob([jsonEvents], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  UI.make('a').execute(a => {
    a.href = url;
    a.download = 'events.json';
    a.click();
  });
  
  URL.revokeObjectURL(url);
}

function parseCustomValues(key, value) {
  if (value instanceof Set) return [...value];
  return value;
}