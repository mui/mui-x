import { createSelector, createRootSelector } from '../../../utils/createSelector';
export const gridPreferencePanelStateSelector = createRootSelector((state) => state.preferencePanel);
export const gridPreferencePanelSelectorWithLabel = createSelector(gridPreferencePanelStateSelector, (panel, labelId) => {
    if (panel.open && panel.labelId === labelId) {
        return true;
    }
    return false;
});
