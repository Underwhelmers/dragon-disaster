function createMoodItem(file, pos = {}) {
  if (!file.type.startsWith('image/')) return;
  const AREA = 300*300; 

  const item = UI.make('div').childOf(board).class('item').style({
    left: pos.left ?? ((Math.random() * 60 + 10) + '%'),
    top : pos.top ?? ((Math.random() * 60 + 10) + '%'),
  }).withChilds(
    UI.make('button').id('remove').class('remove-btn').textContent('X').on(
      'click', () => { item.remove(); }
    )
  ).getElement();


  const img = UI.make('img').childOf(item).class('file-img').attrs({
      src: URL.createObjectURL(file)
    })
    .on('load', () => {
      const ratio = img.naturalWidth / img.naturalHeight;

      const width  = Math.sqrt(AREA * ratio);
      const height = Math.sqrt(AREA / ratio);

      item.style.width = width + "px";
      item.style.height = height + "px";
      console.log("w:{0}, h:{1}",width, height)

      fileToBase64(file, (rsp) => {
        img.dataset.src = rsp;
      })

      URL.revokeObjectURL(img.src);
    })
    .getElement();

  makeDraggable(item);
}