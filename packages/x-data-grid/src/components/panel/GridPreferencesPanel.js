"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridPreferencesPanel = GridPreferencesPanel;
var jsx_runtime_1 = require("react/jsx-runtime");
var gridColumnsSelector_1 = require("../../hooks/features/columns/gridColumnsSelector");
var useGridSelector_1 = require("../../hooks/utils/useGridSelector");
var gridPreferencePanelSelector_1 = require("../../hooks/features/preferencesPanel/gridPreferencePanelSelector");
var gridPreferencePanelsValue_1 = require("../../hooks/features/preferencesPanel/gridPreferencePanelsValue");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var GridPanelContext_1 = require("./GridPanelContext");
function GridPreferencesPanel() {
    var _a, _b;
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var columns = (0, useGridSelector_1.useGridSelector)(apiRef, gridColumnsSelector_1.gridColumnDefinitionsSelector);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var preferencePanelState = (0, useGridSelector_1.useGridSelector)(apiRef, gridPreferencePanelSelector_1.gridPreferencePanelStateSelector);
    var _c = (0, GridPanelContext_1.useGridPanelContext)(), columnsPanelTriggerRef = _c.columnsPanelTriggerRef, filterPanelTriggerRef = _c.filterPanelTriggerRef, aiAssistantPanelTriggerRef = _c.aiAssistantPanelTriggerRef;
    var panelContent = apiRef.current.unstable_applyPipeProcessors('preferencePanel', null, (_a = preferencePanelState.openedPanelValue) !== null && _a !== void 0 ? _a : gridPreferencePanelsValue_1.GridPreferencePanelsValue.filters);
    var target = null;
    switch (preferencePanelState.openedPanelValue) {
        case gridPreferencePanelsValue_1.GridPreferencePanelsValue.filters:
            target = filterPanelTriggerRef.current;
            break;
        case gridPreferencePanelsValue_1.GridPreferencePanelsValue.columns:
            target = columnsPanelTriggerRef.current;
            break;
        case gridPreferencePanelsValue_1.GridPreferencePanelsValue.aiAssistant:
            target = aiAssistantPanelTriggerRef.current;
            break;
        default:
    }
    return ((0, jsx_runtime_1.jsx)(rootProps.slots.panel, __assign({ id: preferencePanelState.panelId, open: columns.length > 0 && preferencePanelState.open, "aria-labelledby": preferencePanelState.labelId, target: target, onClose: function () { return apiRef.current.hidePreferences(); } }, (_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.panel, { children: panelContent })));
}
