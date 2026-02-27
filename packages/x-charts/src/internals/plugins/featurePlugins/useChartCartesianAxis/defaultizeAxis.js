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
exports.defaultizeXAxis = defaultizeXAxis;
exports.defaultizeYAxis = defaultizeYAxis;
var defaultizeZoom_1 = require("./defaultizeZoom");
var constants_1 = require("../../../../constants");
function defaultizeXAxis(inAxes, dataset, axesGap) {
    var offsets = {
        top: 0,
        bottom: 0,
        none: 0,
    };
    var inputAxes = inAxes && inAxes.length > 0
        ? inAxes
        : [{ id: constants_1.DEFAULT_X_AXIS_KEY, scaleType: 'linear' }];
    var parsedAxes = inputAxes.map(function (axisConfig, index) {
        var _a, _b, _c, _d;
        var dataKey = axisConfig.dataKey;
        // The first x-axis is defaultized to the bottom
        var defaultPosition = index === 0 ? 'bottom' : 'none';
        var position = (_a = axisConfig.position) !== null && _a !== void 0 ? _a : defaultPosition;
        var defaultHeight = constants_1.DEFAULT_AXIS_SIZE_HEIGHT + (axisConfig.label ? constants_1.AXIS_LABEL_DEFAULT_HEIGHT : 0);
        var id = (_b = axisConfig.id) !== null && _b !== void 0 ? _b : "defaultized-x-axis-".concat(index);
        var sharedConfig = __assign(__assign({ offset: offsets[position] }, axisConfig), { id: id, position: position, height: (_c = axisConfig.height) !== null && _c !== void 0 ? _c : defaultHeight, zoom: (0, defaultizeZoom_1.defaultizeZoom)(axisConfig.zoom, id, 'x', axisConfig.reverse) });
        // Increment the offset for the next axis
        if (position !== 'none') {
            offsets[position] += sharedConfig.height + axesGap;
            if ((_d = sharedConfig.zoom) === null || _d === void 0 ? void 0 : _d.slider.enabled) {
                offsets[position] += sharedConfig.zoom.slider.size;
            }
        }
        // If `dataKey` is NOT provided
        if (dataKey === undefined || axisConfig.data !== undefined) {
            return sharedConfig;
        }
        if (dataset === undefined) {
            throw new Error("MUI X Charts: x-axis uses `dataKey` but no `dataset` is provided.");
        }
        // If `dataKey` is provided
        return __assign(__assign({}, sharedConfig), { data: dataset.map(function (d) { return d[dataKey]; }) });
    });
    return parsedAxes;
}
function defaultizeYAxis(inAxes, dataset, axesGap) {
    var offsets = { right: 0, left: 0, none: 0 };
    var inputAxes = inAxes && inAxes.length > 0
        ? inAxes
        : [{ id: constants_1.DEFAULT_Y_AXIS_KEY, scaleType: 'linear' }];
    var parsedAxes = inputAxes.map(function (axisConfig, index) {
        var _a, _b, _c, _d;
        var dataKey = axisConfig.dataKey;
        // The first y-axis is defaultized to the left
        var defaultPosition = index === 0 ? 'left' : 'none';
        var position = (_a = axisConfig.position) !== null && _a !== void 0 ? _a : defaultPosition;
        var defaultWidth = constants_1.DEFAULT_AXIS_SIZE_WIDTH + (axisConfig.label ? constants_1.AXIS_LABEL_DEFAULT_HEIGHT : 0);
        var id = (_b = axisConfig.id) !== null && _b !== void 0 ? _b : "defaultized-y-axis-".concat(index);
        var sharedConfig = __assign(__assign({ offset: offsets[position] }, axisConfig), { id: id, position: position, width: (_c = axisConfig.width) !== null && _c !== void 0 ? _c : defaultWidth, zoom: (0, defaultizeZoom_1.defaultizeZoom)(axisConfig.zoom, id, 'y', axisConfig.reverse) });
        // Increment the offset for the next axis
        if (position !== 'none') {
            offsets[position] += sharedConfig.width + axesGap;
            if ((_d = sharedConfig.zoom) === null || _d === void 0 ? void 0 : _d.slider.enabled) {
                offsets[position] += sharedConfig.zoom.slider.size;
            }
        }
        // If `dataKey` is NOT provided
        if (dataKey === undefined || axisConfig.data !== undefined) {
            return sharedConfig;
        }
        if (dataset === undefined) {
            throw new Error("MUI X Charts: y-axis uses `dataKey` but no `dataset` is provided.");
        }
        // If `dataKey` is provided
        return __assign(__assign({}, sharedConfig), { data: dataset.map(function (d) { return d[dataKey]; }) });
    });
    return parsedAxes;
}
