"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PIE_CHART_PRO_PLUGINS = void 0;
var internals_1 = require("@mui/x-charts/internals");
var useChartProExport_1 = require("../internals/plugins/useChartProExport");
exports.PIE_CHART_PRO_PLUGINS = __spreadArray(__spreadArray([], internals_1.PIE_CHART_PLUGINS, true), [
    useChartProExport_1.useChartProExport,
], false);
