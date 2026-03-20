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
exports.AxisRoot = void 0;
var styles_1 = require("@mui/material/styles");
var axisClasses_1 = require("../../ChartsAxis/axisClasses");
exports.AxisRoot = (0, styles_1.styled)('g', {
    name: 'MuiChartsAxis',
    slot: 'Root',
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["& .".concat(axisClasses_1.axisClasses.tickLabel)] = __assign(__assign({}, theme.typography.caption), { fill: (theme.vars || theme).palette.text.primary }),
        _b["& .".concat(axisClasses_1.axisClasses.label)] = {
            fill: (theme.vars || theme).palette.text.primary,
        },
        _b["& .".concat(axisClasses_1.axisClasses.line)] = {
            stroke: (theme.vars || theme).palette.text.primary,
            shapeRendering: 'crispEdges',
            strokeWidth: 1,
        },
        _b["& .".concat(axisClasses_1.axisClasses.tick)] = {
            stroke: (theme.vars || theme).palette.text.primary,
            shapeRendering: 'crispEdges',
        },
        _b);
});
