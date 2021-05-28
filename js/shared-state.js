import { newGuid } from './util.js';

const sharedState = {
  selectedTool: "select",
  canvasObjects: []
}

// handle multiple arguments for props
export function getSharedState (prop) {
  const data = sharedState[prop] ? sharedState[prop] : undefined;
  if (Array.isArray(data)) {
    return data.slice();
  } else {
    return data;
  }
};

export function updateSharedState (event, payload) {
  switch (event) {
    case 'SELECT_TOOL':
      sharedState.selectedTool = payload.tool;
      break;
    case 'ADD_CANVAS_OBJECT':
      const newObjects = sharedState.canvasObjects.map(obj => ({ ...obj, isSelected: false }));
      newObjects.push({
        id: newGuid(),
        path: payload.path,
        isSelected: true,
        isBackground: false
      });
      sharedState.canvasObjects = newObjects;
      break;
    case 'DESELECT_ALL':
      sharedState.canvasObjects = sharedState.canvasObjects.map(obj => ({ ...obj, isSelected: false }));;
      break;
    default:
      throw new Error(`Unhandled event ${event}.`)
  }
};

