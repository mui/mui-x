import { createSelector } from '@mui/x-data-grid-pro/internals';
import { gridSidebarStateSelector, GridSidebarValue } from '../sidebar';

export const gridCopilotPanelOpenSelector = createSelector(
  gridSidebarStateSelector,
  (sidebar) => sidebar.value === GridSidebarValue.Copilot && sidebar.open,
);
