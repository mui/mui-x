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
exports.ReferenceLineRoot = exports.DEFAULT_SPACING_MIDDLE_OTHER_AXIS = exports.DEFAULT_SPACING = void 0;
var styles_1 = require("@mui/material/styles");
var chartsReferenceLineClasses_1 = require("./chartsReferenceLineClasses");
exports.DEFAULT_SPACING = 5;
exports.DEFAULT_SPACING_MIDDLE_OTHER_AXIS = 0;
exports.ReferenceLineRoot = (0, styles_1.styled)('g', {
    slot: 'internal',
    shouldForwardProp: undefined,
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["& .".concat(chartsReferenceLineClasses_1.referenceLineClasses.line)] = {
            fill: 'none',
            stroke: (theme.vars || theme).palette.text.primary,
            shapeRendering: 'crispEdges',
            strokeWidth: 1,
            pointerEvents: 'none',
        },
        _b["& .".concat(chartsReferenceLineClasses_1.referenceLineClasses.label)] = __assign({ fill: (theme.vars || theme).palette.text.primary, stroke: 'none', pointerEvents: 'none', fontSize: 12 }, theme.typography.body1),
        _b);
});
