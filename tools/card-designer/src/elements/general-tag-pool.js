const elmTagCloud = UI.get('modal-tag-cloud');

// Collects ALL unique tags from the current event being edited
function getAllEventTags() {
  const tags = new Set();
  
  for (evkey in events) {
    var evnt = events[evkey];
    getAllEventTags_process(evnt?.req, tags);

    if (!evnt?.ops) continue;
    for (var op of evnt.ops) {
      getAllEventTags_process(op.eff?.adds, tags);
      getAllEventTags_process(op.eff?.removes, tags);
      getAllEventTags_process(op.eff?.triggers, tags);
      getAllEventTags_process(op.req, tags);
    }
  }

  return [...tags].sort(); // sorted for nicer display
}

function getAllEventTags_process(list, tagSet) {
  if (!list || list.length == 0) return;
  for (const tag of list) {
    if (tag[0] === '!')
      tagSet.add(tag.substring(1));
    else tagSet.add(tag);
  }
}

// Renders chips in the fixed pool (read-only, no X, no drag yet)
function renderModalTagPool() {
  elmTagCloud.innerHTML = '';
  const uniqueTags = getAllEventTags();

  if (uniqueTags.length === 0) {
    elmTagCloud.innerHTML = '<div class="tag-placeholder" style="color:#666; text-align:center; padding:12px;">No tags used yet</div>';
    return;
  }

  uniqueTags.forEach(tag => {
    addTagElm(elmTagCloud,tag);
  });
}

// Call this when opening the modal (both new & edit)
function showModalTagPool() {
  modal.classList.add('active');
  renderModalTagPool();
  UI.get('modal-tag-pool').style.display = 'block';
}

// Call this when closing/clearing modal
function hideModalTagPool() {
  modal.classList.remove('active');
  UI.get('modal-tag-pool').style.display = 'none';
  elmTagCloud.innerHTML = '';
}

function showTagInput() {
  const placeholder = elmTagCloud.querySelector('.tag-placeholder');
  if (placeholder) placeholder.style.display = 'none';

  const handle = () => {
    const value = input.value.trim();
    if (!value)  {
      if (placeholder) placeholder.style.display ='block';
      input.remove();
      return;
    }

    addTagElm(elmTagCloud, value);

    input.removeEventListener("blur", handle);
    input.removeEventListener("keydown", keyhandle);
    input.remove();
  }

  const keyhandle = (e) => {
    if (e.key === "Enter")
      handle();
  }

  const input = UI.make('input').ofType('text').placeholder('Write new tag').class('tag-input').childOf(elmTagCloud).focus()
    .on('keydown', keyhandle)
    .on('blur', handle)
    .getElement();
}