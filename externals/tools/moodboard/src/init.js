// ─── Buttons ──────────────────────────────────────────
document.getElementById('btn-clear').onclick = () => {
  if (confirm("Clear entire moodboard?")) {
    board.innerHTML = '';
  }
};
