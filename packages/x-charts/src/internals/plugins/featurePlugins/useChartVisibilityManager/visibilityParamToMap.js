"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visibilityParamToMap = void 0;
var serializeIdentifier_1 = require("../../corePlugins/useChartSeriesConfig/utils/serializeIdentifier");
var visibilityParamToMap = function (hiddenItems, seriesConfig) {
    var visibilityMap = new Map();
    if (hiddenItems) {
        hiddenItems.forEach(function (identifier) {
            var uniqueId = (0, serializeIdentifier_1.serializeIdentifier)(seriesConfig, identifier);
            visibilityMap.set(uniqueId, identifier);
        });
    }
    return visibilityMap;
};
exports.visibilityParamToMap = visibilityParamToMap;
