"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridColumnSpanning = void 0;
var useGridApiMethod_1 = require("../../utils/useGridApiMethod");
var useGridEvent_1 = require("../../utils/useGridEvent");
/**
 * @requires useGridColumns (method, event)
 * @requires useGridParamsApi (method)
 */
var useGridColumnSpanning = function (apiRef) {
    var virtualizer = apiRef.current.virtualizer;
    var resetColSpan = virtualizer.api.resetColSpan;
    var getCellColSpanInfo = virtualizer.api.getCellColSpanInfo;
    var calculateColSpan = virtualizer.api.calculateColSpan;
    var columnSpanningPublicApi = {
        unstable_getCellColSpanInfo: getCellColSpanInfo,
    };
    var columnSpanningPrivateApi = {
        resetColSpan: resetColSpan,
        calculateColSpan: calculateColSpan,
    };
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, columnSpanningPublicApi, 'public');
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, columnSpanningPrivateApi, 'private');
    (0, useGridEvent_1.useGridEvent)(apiRef, 'columnOrderChange', resetColSpan);
};
exports.useGridColumnSpanning = useGridColumnSpanning;
