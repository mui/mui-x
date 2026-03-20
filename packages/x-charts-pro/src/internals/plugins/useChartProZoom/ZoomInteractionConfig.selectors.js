"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorIsZoomBrushEnabled = exports.selectorPanInteractionConfig = exports.selectorZoomInteractionConfig = void 0;
var store_1 = require("@mui/x-internals/store");
var internals_1 = require("@mui/x-charts/internals");
var useChartProZoom_selectors_1 = require("./useChartProZoom.selectors");
exports.selectorZoomInteractionConfig = (0, store_1.createSelector)(useChartProZoom_selectors_1.selectorChartZoomState, function (zoomState, interactionName) { var _a; return (_a = zoomState.zoomInteractionConfig.zoom[interactionName]) !== null && _a !== void 0 ? _a : null; });
exports.selectorPanInteractionConfig = (0, store_1.createSelector)(useChartProZoom_selectors_1.selectorChartZoomState, function (zoomState, interactionName) { var _a; return (_a = zoomState.zoomInteractionConfig.pan[interactionName]) !== null && _a !== void 0 ? _a : null; });
exports.selectorIsZoomBrushEnabled = (0, store_1.createSelector)(internals_1.selectorChartZoomOptionsLookup, function (state) { return (0, exports.selectorZoomInteractionConfig)(state, 'brush'); }, function (zoomOptions, zoomInteractionConfig) {
    return (Object.keys(zoomOptions).length > 0 && zoomInteractionConfig) || false;
});
