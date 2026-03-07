function saveBoard() {
  const items = [];
  document.querySelectorAll('.item').forEach(item => {
    const img = item.querySelector('img');

    items.push({
      src: img.dataset.src,
      left: item.style.left,
      top: item.style.top,
      width: item.style.width,
      height: item.style.height
    });
  });

  localStorage.setItem("moodboard", JSON.stringify(items));
}

function loadBoard() {
  const data = JSON.parse(localStorage.getItem("moodboard") || "[]");

  data.forEach(item => {
    createMoodItemFromData(item.src, item);
  });
}


function fileToBase64(file, callback) {
  const reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.readAsDataURL(file);
}

function createMoodItemFromData(src, pos = {}) {
  const item = UI.make('div').childOf(board).class('item').style({
    left: pos.left ?? (Math.random()*60+10)+'%',
    top: pos.top ?? (Math.random()*60+10)+'%',
    width: pos.width ?? '200px',
    height: pos.height ?? '200px'
  }).withChilds(
    UI.make('button').class('remove-btn').textContent('X').on(
      'click', () => item.remove()
    )
  ).getElement();

  const img = UI.make('img').childOf(item).attrs({src}).getElement();

  img.dataset.src = src;

  makeDraggable(item);
}