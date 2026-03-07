function makeDraggable(el) {
	let offsetX = 0;
  let offsetY = 0;
  let oldZ = 0;
  
  const pointermove = e => {
    e.preventDefault();
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;

    el.style.left = x + 'px';
    el.style.top  = y + 'px';
  }
  const poinerup = () => {
    el.style.zIndex = oldZ;
    document.removeEventListener('pointermove', pointermove);
    document.removeEventListener('pointerup', poinerup);
    console.log('dragend');
  }

  const pointerdown = e => {
    if (e.button !== 0) return;
		if (e.target.closest('.remove-btn')) return;

    console.log('dragstart');

		activeItem = el;
		isDragging = true;

		const rect = el.getBoundingClientRect();
		offsetX = e.clientX - rect.left;
		offsetY = e.clientY - rect.top;
  
    oldZ = el.style.zIndex;
		el.style.zIndex = 999;
		e.preventDefault();
    
    document.addEventListener('pointermove', pointermove);
    document.addEventListener('pointerup', poinerup)
  }
  
  el.addEventListener('pointerdown', pointerdown);
}