"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
function getFirstCell(state) {
    var _a, _b;
    var seriesId = (_a = state.series.defaultizedSeries.heatmap) === null || _a === void 0 ? void 0 : _a.seriesOrder[0];
    var series = (_b = state.series.defaultizedSeries.heatmap) === null || _b === void 0 ? void 0 : _b.series[seriesId];
    var data = series === null || series === void 0 ? void 0 : series.data;
    if (!seriesId || !series || !data || data.length === 0) {
        return null;
    }
    return { type: 'heatmap', seriesId: seriesId, xIndex: 0, yIndex: 0 };
}
var updateCoordinates = function (newXIndex, newYIndex, currentItem) {
    return __assign(__assign({}, currentItem), { xIndex: newXIndex, yIndex: newYIndex });
};
var keyboardFocusHandler = function (event) {
    switch (event.key) {
        case 'ArrowRight':
            return function (currentItem, state) {
                var _a, _b;
                if (!currentItem) {
                    return getFirstCell(state);
                }
                var maxLength = (_b = (_a = state.cartesianAxis) === null || _a === void 0 ? void 0 : _a.x[0].data) === null || _b === void 0 ? void 0 : _b.length;
                if (currentItem.xIndex + 1 === (maxLength !== null && maxLength !== void 0 ? maxLength : 0)) {
                    return currentItem;
                }
                return updateCoordinates(currentItem.xIndex + 1, currentItem.yIndex, currentItem);
            };
        case 'ArrowLeft':
            return function (currentItem, state) {
                if (!currentItem) {
                    return getFirstCell(state);
                }
                if (currentItem.xIndex - 1 < 0) {
                    return currentItem;
                }
                return updateCoordinates(currentItem.xIndex - 1, currentItem.yIndex, currentItem);
            };
        case 'ArrowDown':
            return function (currentItem, state) {
                var _a, _b;
                if (!currentItem) {
                    return getFirstCell(state);
                }
                var maxLength = (_b = (_a = state.cartesianAxis) === null || _a === void 0 ? void 0 : _a.y[0].data) === null || _b === void 0 ? void 0 : _b.length;
                if (currentItem.yIndex + 1 === (maxLength !== null && maxLength !== void 0 ? maxLength : 0)) {
                    return currentItem;
                }
                return updateCoordinates(currentItem.xIndex, currentItem.yIndex + 1, currentItem);
            };
        case 'ArrowUp':
            return function (currentItem, state) {
                if (!currentItem) {
                    return getFirstCell(state);
                }
                if (currentItem.yIndex - 1 < 0) {
                    return currentItem;
                }
                return updateCoordinates(currentItem.xIndex, currentItem.yIndex - 1, currentItem);
            };
        default:
            return null;
    }
};
exports.default = keyboardFocusHandler;
