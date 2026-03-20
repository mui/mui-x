"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridLine = exports.GridRoot = void 0;
var styles_1 = require("@mui/material/styles");
var chartsGridClasses_1 = require("./chartsGridClasses");
exports.GridRoot = (0, styles_1.styled)('g', {
    name: 'MuiChartsGrid',
    slot: 'Root',
    overridesResolver: function (props, styles) {
        var _a, _b;
        return [
            (_a = {}, _a["&.".concat(chartsGridClasses_1.chartsGridClasses.verticalLine)] = styles.verticalLine, _a),
            (_b = {}, _b["&.".concat(chartsGridClasses_1.chartsGridClasses.horizontalLine)] = styles.horizontalLine, _b),
            styles.root,
        ];
    },
})({});
exports.GridLine = (0, styles_1.styled)('line', {
    name: 'MuiChartsGrid',
    slot: 'Line',
})(function (_a) {
    var theme = _a.theme;
    return ({
        stroke: (theme.vars || theme).palette.divider,
        shapeRendering: 'crispEdges',
        strokeWidth: 1,
    });
});
