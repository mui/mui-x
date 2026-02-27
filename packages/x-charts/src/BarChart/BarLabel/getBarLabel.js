"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBarLabel = getBarLabel;
function getBarLabel(options) {
    var barLabel = options.barLabel, value = options.value, dataIndex = options.dataIndex, seriesId = options.seriesId, height = options.height, width = options.width;
    if (barLabel === 'value') {
        // We don't want to show the label if the value is 0
        return value ? value === null || value === void 0 ? void 0 : value.toString() : null;
    }
    return barLabel({ seriesId: seriesId, dataIndex: dataIndex, value: value }, { bar: { height: height, width: width } });
}
