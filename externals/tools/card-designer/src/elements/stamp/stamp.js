let currentEditingKey = null;

// When opening the modal for edit
function editEvent(key) {
  currentEditingKey = key;
  loadFormStamp(key);
  hideDeleteIfNewEvent();   // ← show delete button
  modal.style.display = 'block';
  showModalTagPool();
}

// Also call it when form is cleared just to be safe
function clearForm() {
    UI.get('event-key').value = '';
    isParametrized.checked = false;
    paramsSection.style.display = 'none';
    paramsList.innerHTML = '';
    reqList.innerHTML = '';
    commonAddsList.innerHTML = ''
    commonRemovesList.innerHTML = ''
    commonTriggersList.innerHTML = ''
    eventText.value = '';
    opsList.innerHTML = '';
    hideDeleteIfNewEvent();
}

function openFormForNew() {
  currentEditingKey = null;
  clearForm();
  UI.get('event-key').value = UI.get('filename').value + ": ";

  hideDeleteIfNewEvent();
  modal.style.display = 'block';
  showModalTagPool();
};

function closeStamp() {
  saveFormStamp();
  renderEvents();
  modal.style.display = 'none';
  hideModalTagPool();
}

function renderEvents() {
  const list = UI.get('event-list');
  list.innerHTML = '';
  Object.keys(events).forEach(key => {
    if (!key) return;
    const event = events[key];
    const stamp = document.createElement('div');
    stamp.className = 'stamp';
    stamp.innerHTML = `
      <h3>${key}</h3>
      <p>${event.text}</p>
      <ul>
        ${event.ops?.map(op => `<li>${op.text}</li>`)?.join('')}
      </ul>
    `;
    stamp.onclick = () => editEvent(key);
    list.appendChild(stamp);
  });
}

function hideDeleteIfNewEvent() {
  // make sure delete is hidden for new events
  UI.get('delete-event-btn').style.display = currentEditingKey ? 'inline-block' : 'none';
}

function tryDeleteEvent() {
  if (!currentEditingKey) return;

  if (!confirm(`Really delete "${currentEditingKey}"?\nThis event will be gone forever.`)) {
    return;
  }

  delete events[currentEditingKey];
  renderEvents();
  modal.style.display = 'none';
};