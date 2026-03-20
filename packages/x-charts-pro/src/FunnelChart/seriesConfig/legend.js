"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internals_1 = require("@mui/x-charts/internals");
var legendGetter = function (params) {
    var seriesOrder = params.seriesOrder, series = params.series;
    return seriesOrder.reduce(function (acc, seriesId) {
        series[seriesId].data.forEach(function (item, dataIndex) {
            var _a;
            var formattedLabel = (0, internals_1.getLabel)(item.label, 'legend');
            if (formattedLabel === undefined) {
                return;
            }
            acc.push({
                type: 'funnel',
                markType: (_a = item.labelMarkType) !== null && _a !== void 0 ? _a : series[seriesId].labelMarkType,
                seriesId: seriesId,
                dataIndex: dataIndex,
                color: item.color,
                label: formattedLabel,
            });
        });
        return acc;
    }, []);
};
exports.default = legendGetter;
