"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridPreferencePanelSelectorWithLabel = exports.gridPreferencePanelStateSelector = void 0;
var createSelector_1 = require("../../../utils/createSelector");
exports.gridPreferencePanelStateSelector = (0, createSelector_1.createRootSelector)(function (state) { return state.preferencePanel; });
exports.gridPreferencePanelSelectorWithLabel = (0, createSelector_1.createSelector)(exports.gridPreferencePanelStateSelector, function (panel, labelId) {
    if (panel.open && panel.labelId === labelId) {
        return true;
    }
    return false;
});
