"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getLabel_1 = require("../../internals/getLabel");
var legendGetter = function (params) {
    var seriesOrder = params.seriesOrder, series = params.series;
    return seriesOrder.reduce(function (acc, seriesId) {
        var _a;
        var formattedLabel = (0, getLabel_1.getLabel)(series[seriesId].label, 'legend');
        if (formattedLabel === undefined) {
            return acc;
        }
        acc.push({
            type: 'radar',
            seriesId: seriesId,
            color: series[seriesId].color,
            label: formattedLabel,
            markType: (_a = series[seriesId].labelMarkType) !== null && _a !== void 0 ? _a : 'square',
        });
        return acc;
    }, []);
};
exports.default = legendGetter;
