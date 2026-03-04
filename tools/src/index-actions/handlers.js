window.onclick = (event) => { 
  // click outside when stamp is open.
  if (event.target !== modal) return;
  
  if (form.checkValidity())
    closeStamp();
  else 
    form.reportValidity();
};

form.onsubmit = (e) => {
  e.preventDefault();
  closeStamp();
};

UI.get('add-event').onclick = () => openFormForNew();
UI.get('load-json').onclick = () => triggerInputLoad();
UI.get('file-input').onchange = (e) => loadEvents(e.target.files[0]);
UI.get('download-json').onclick = () => downloadEvents();

UI.get('modal-tag-pool-new-tag').onclick = () => showTagInput();

UI.get('add-op').onclick = () => addOptionInput();
UI.get('add-param').onclick = () => addParamInput();
UI.get('delete-event-btn').onclick = () => tryDeleteEvent();

isParametrized.onchange = () => {
  const display = isParametrized.checked ? 'block' : 'none';
  paramsSection.style.display = display;
};

UI.get('modal-close').onclick = () => {
  // close without saving
  modal.style.display = 'none'; 
  hideModalTagPool();
}

