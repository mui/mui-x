"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getLabel_1 = require("../../internals/getLabel");
var legendGetter = function (params) {
    var seriesOrder = params.seriesOrder, series = params.series;
    return seriesOrder.reduce(function (acc, seriesId) {
        series[seriesId].data.forEach(function (item, dataIndex) {
            var _a, _b;
            var formattedLabel = (0, getLabel_1.getLabel)(item.label, 'legend');
            if (formattedLabel === undefined) {
                return;
            }
            var id = (_a = item.id) !== null && _a !== void 0 ? _a : dataIndex;
            acc.push({
                type: 'pie',
                markType: (_b = item.labelMarkType) !== null && _b !== void 0 ? _b : series[seriesId].labelMarkType,
                seriesId: seriesId,
                itemId: id,
                dataIndex: dataIndex,
                color: item.color,
                label: formattedLabel,
            });
        });
        return acc;
    }, []);
};
exports.default = legendGetter;
