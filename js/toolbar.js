import { addEvent } from './util.js';
import { getSharedState, updateSharedState } from './shared-state.js';

addEvent('.tool', 'click', onToolClick, true);
addEvent('.toggle', 'click', onToggleClick);
updateToolbar();

function onToolClick ({ currentTarget }) {
  updateSharedState('SELECT_TOOL', { tool: currentTarget.dataset.tool });
  updateToolbar();
}

function onToggleClick({currentTarget}) {
  updateSharedState('TOGGLE_TOOL', { tool: currentTarget.dataset.tool });
  updateToolbar();
}

function updateToolbar () {
  const selectedTool = getSharedState('selectedTool');
  const currentSelectedTool = document.querySelector('.selected-tool');
  currentSelectedTool && currentSelectedTool.classList.remove('selected-tool');
  const el = document.querySelector(`[data-tool='${selectedTool}']`);
  el && el.classList.add('selected-tool');
}