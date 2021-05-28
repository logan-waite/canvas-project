import { getSharedState, updateSharedState } from './shared-state.js';
import { addEvent, getMousePosition } from './util.js';

const canvasState = {
  mouseDownPosition: undefined,
  selectionRect: undefined,
  tempCanvasObj: undefined
}

window.addEventListener('load', () => setTimeout(resizeCanvas, 50));
window.addEventListener('resize', resizeCanvas);
addEvent('#canvas-wrapper', 'mousedown', onCanvasMouseDown);
addEvent('#canvas-wrapper', 'mousemove', onCanvasMouseMove);
addEvent('#canvas-wrapper', 'mouseup', onCanvasMouseUp);

function resizeCanvas () {
  const canvases = document.querySelectorAll('.canvas');
  const wrapper = document.getElementById('canvas-wrapper');
  canvases.forEach((canvas) => {
    canvas.height = wrapper.clientHeight;
    canvas.width = wrapper.clientWidth;
  })

  renderCanvas();
}

function renderCanvas () {
  const objects = getSharedState('canvasObjects');
  objects.push({ isSelected: true, path: canvasState.selectionRect || new Path2D(), color: 'blue' });

  const { canvas: backgroundCanvas, ctx: backgroundCtx } = getCanvas('background');
  const { canvas: foregroundCanvas, ctx: foregroundCtx } = getCanvas('foreground');
  const { canvas: activeCanvas, ctx: activeCtx } = getCanvas('active');
  const { canvas: tempCanvas, ctx: tempCtx } = getCanvas('temp');

  backgroundCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
  foregroundCtx.clearRect(0, 0, foregroundCanvas.width, foregroundCanvas.height);
  activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
  tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

  objects.forEach((object) => {
    if (backgroundCanvas && object.isBackground) {

    }
    if (foregroundCanvas && !object.isSelected) {
      foregroundCtx.strokeStyle = 'black';
      foregroundCtx.lineWidth = '1';
      foregroundCtx.stroke(object.path);
    }
    if (activeCanvas && object.isSelected) {
      activeCtx.strokeStyle = object.color || 'black';
      activeCtx.lineWidth = '1';
      activeCtx.stroke(object.path);
    }
  })

  if (tempCanvas && canvasState.tempCanvasObj) {
    tempCtx.strokeStyle = 'slategrey';
    tempCtx.opacity = 0.5
    tempCtx.lineWidth = 1;
    tempCtx.stroke(canvasState.tempCanvasObj.path)
  }
}

function getCanvas (canvasId = '') {
  const canvas = document.getElementById(canvasId);
  return canvas ? { canvas, ctx: canvas.getContext('2d') } : undefined;
}

function onCanvasMouseDown (event) {
  const selectedTool = getSharedState('selectedTool');
  if (!selectedTool) return;

  canvasState.mouseDownPosition = getMousePosition(event);
  const path = new Path2D();

  switch (selectedTool) {
    case 'select':
      updateSharedState('DESELECT_ALL');
      break;
    case 'square':
      path.rect(canvasState.mouseDownPosition.x, canvasState.mouseDownPosition.y, 0, 0)
      break;
    case 'circle':
      path.arc(canvasState.mouseDownPosition.x, canvasState.mouseDownPosition.y, 0, 0, 2 * Math.PI);
      break;
    case 'line':
      path.moveTo(canvasState.mouseDownPosition.x, canvasState.mouseDownPosition.y);
  }

  canvasState.tempCanvasObj = { path, isSelected: true, color: 'red' };

  renderCanvas();
}

function onCanvasMouseMove (event) {
  const selectedTool = getSharedState('selectedTool');
  const startingMousePosition = canvasState.mouseDownPosition;

  if (!selectedTool || !startingMousePosition) return;

  const currentMousePosition = getMousePosition(event);
  const path = new Path2D();

  // Everything we draw will have a rectangle around it
  const boundingRect = new Path2D();
  const width = currentMousePosition.x - startingMousePosition.x;
  const height = currentMousePosition.y - startingMousePosition.y;
  boundingRect.rect(startingMousePosition.x, startingMousePosition.y, width, height);
  canvasState.selectionRect = boundingRect

  switch (selectedTool) {
    case 'square':
      path.rect(startingMousePosition.x, startingMousePosition.y, width, height);
      break;
    case 'circle':
      const centerX = (currentMousePosition.x - startingMousePosition.x) / 2;
      const centerY = (currentMousePosition.y - startingMousePosition.y) / 2;
      // const radius = Math.sqrt((centerX ** 2) + (centerY ** 2));
      const radiusX = width / 2;
      const radiusY = height / 2;
      path.ellipse(centerX + startingMousePosition.x, centerY + startingMousePosition.y, Math.abs(radiusX), Math.abs(radiusY), 0, 0, 2 * Math.PI);
      // path.arc(centerX + mouseDownPosition.x, centerY + mouseDownPosition.y, radius, 0, 2 * Math.PI);
      break;
    case 'line':
      path.moveTo(startingMousePosition.x, startingMousePosition.y);
      path.lineTo(currentMousePosition.x, currentMousePosition.y);
      break;
  }

  canvasState.tempCanvasObj = { path, isSelected: true };
  renderCanvas();
}

function onCanvasMouseUp (event) {
  const selectedTool = getSharedState('selectedTool');
  if (!selectedTool) return;
  switch (selectedTool) {
    case 'select':
      canvasState.selectionRect = undefined;
      break;
    default:
      updateSharedState('ADD_CANVAS_OBJECT', { path: canvasState.tempCanvasObj && canvasState.tempCanvasObj.path });
  }
  canvasState.mouseDownPosition = undefined;
  canvasState.tempCanvasObj = undefined;
  renderCanvas();
}