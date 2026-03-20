"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeatmapData = void 0;
var HeatmapData = /** @class */ (function () {
    function HeatmapData(data) {
        this.valueLookup = new Map();
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var _a = data_1[_i], xIndex = _a[0], yIndex = _a[1], value = _a[2];
            var column = this.valueLookup.get(xIndex);
            if (!column) {
                column = new Map();
                this.valueLookup.set(xIndex, column);
            }
            column.set(yIndex, value);
        }
    }
    HeatmapData.prototype.getValue = function (xIndex, yIndex) {
        var _a, _b;
        return (_b = (_a = this.valueLookup.get(xIndex)) === null || _a === void 0 ? void 0 : _a.get(yIndex)) !== null && _b !== void 0 ? _b : null;
    };
    return HeatmapData;
}());
exports.HeatmapData = HeatmapData;
