"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getLabel_1 = require("../../internals/getLabel");
var legendGetter = function (params) {
    var seriesOrder = params.seriesOrder, series = params.series;
    return seriesOrder.reduce(function (acc, seriesId) {
        series[seriesId].data.forEach(function (item, dataIndex) {
            var _a, _b, _c;
            var formattedLabel = (0, getLabel_1.getLabel)(item.label, 'legend');
            if (formattedLabel === undefined) {
                return;
            }
            acc.push({
                markType: (_a = item.labelMarkType) !== null && _a !== void 0 ? _a : series[seriesId].labelMarkType,
                id: (_b = item.id) !== null && _b !== void 0 ? _b : dataIndex,
                seriesId: seriesId,
                color: item.color,
                label: formattedLabel,
                itemId: (_c = item.id) !== null && _c !== void 0 ? _c : dataIndex,
            });
        });
        return acc;
    }, []);
};
exports.default = legendGetter;
