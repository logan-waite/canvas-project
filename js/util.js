export { addEvent, newGuid, getMousePosition }


function addEvent (selector = "", event = "", callback = (event) => { }, attachToAll = false) {
  try {
    if (attachToAll) {
      document.querySelectorAll(selector).forEach(x => x.addEventListener(event, callback));
    } else {
      document.querySelector(selector).addEventListener(event, callback);
    }
    return true
  } catch (err) {
    console.error(err);
    return false;
  }
}

function guidGenerator (seed = 0) {
  let startingSeed = seed;
  return function () {
    return startingSeed++;
  };
}

const newGuid = guidGenerator(0);

function getMousePosition (event) {
  const rect = event.currentTarget.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
}
