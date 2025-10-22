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
exports.defaultizeAxis = defaultizeAxis;
var constants_1 = require("../../../../constants");
function defaultizeAxis(inAxis, dataset, axisName) {
    var DEFAULT_AXIS_KEY = axisName === 'rotation' ? constants_1.DEFAULT_ROTATION_AXIS_KEY : constants_1.DEFAULT_RADIUS_AXIS_KEY;
    var inputAxes = inAxis && inAxis.length > 0 ? inAxis : [{ id: DEFAULT_AXIS_KEY }];
    return inputAxes.map(function (axisConfig, index) {
        var id = "defaultized-".concat(axisName, "-axis-").concat(index);
        var dataKey = axisConfig.dataKey;
        if (dataKey === undefined || axisConfig.data !== undefined) {
            return __assign({ id: id }, axisConfig);
        }
        if (dataset === undefined) {
            throw new Error("MUI X Charts: ".concat(axisName, "-axis uses `dataKey` but no `dataset` is provided."));
        }
        return __assign({ id: id, data: dataset.map(function (d) { return d[dataKey]; }) }, axisConfig);
    });
}
