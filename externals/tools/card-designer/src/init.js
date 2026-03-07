let events = {};
let tags = {}; //id => name

renderEvents();

makeTagHolderDroppable(reqList);
makeTagHolderDroppable(commonAddsList);
makeTagHolderDroppable(commonRemovesList);
makeTagHolderDroppable(commonTriggersList);