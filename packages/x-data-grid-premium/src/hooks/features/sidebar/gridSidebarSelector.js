"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridSidebarContentSelector = exports.gridSidebarOpenSelector = exports.gridSidebarStateSelector = void 0;
var internals_1 = require("@mui/x-data-grid-pro/internals");
exports.gridSidebarStateSelector = (0, internals_1.createRootSelector)(function (state) { return state.sidebar; });
exports.gridSidebarOpenSelector = (0, internals_1.createSelector)(exports.gridSidebarStateSelector, function (state) { return state.open; });
exports.gridSidebarContentSelector = (0, internals_1.createSelector)(exports.gridSidebarStateSelector, function (_a) {
    var sidebarId = _a.sidebarId, labelId = _a.labelId, value = _a.value;
    return ({
        sidebarId: sidebarId,
        labelId: labelId,
        value: value,
    });
});
