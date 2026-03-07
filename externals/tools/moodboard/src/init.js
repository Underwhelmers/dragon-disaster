// ─── Drag & Drop ──────────────────────────────────────
board.addEventListener('dragover', e => {
  e.preventDefault();
  document.body.classList.add('drag-over');
});

board.addEventListener('dragleave', () => {
  document.body.classList.remove('drag-over');
});

board.addEventListener('drop', e => {
  e.preventDefault();
  document.body.classList.remove('drag-over');

  const files = e.dataTransfer.files;
  for (const file of files) {
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      createMoodItem(file);
    }
  }
});

// ─── Buttons ──────────────────────────────────────────
document.getElementById('btn-clear').onclick = () => {
  if (confirm("Clear entire moodboard?")) {
    board.innerHTML = '';
  }
};
