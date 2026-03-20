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
exports.HeatmapCell = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var HeatmapCellRoot = (0, styles_1.styled)('rect', {
    name: 'MuiHeatmap',
    slot: 'Cell',
    overridesResolver: function (_, styles) { return styles.cell; },
})(function (_a) {
    var ownerState = _a.ownerState;
    return ({
        filter: (ownerState.isHighlighted && 'saturate(120%)') ||
            (ownerState.isFaded && 'saturate(80%)') ||
            undefined,
        fill: ownerState.color,
        shapeRendering: 'crispEdges',
    });
});
/**
 * Demos:
 *
 * - [Heatmap](https://mui.com/x/react-charts/heatmap/)
 *
 * API:
 *
 * - [HeatmapCell API](https://mui.com/x/api/charts/heatmap-cell/)
 */
var HeatmapCell = React.forwardRef(function HeatmapCell(props, ref) {
    return (0, jsx_runtime_1.jsx)(HeatmapCellRoot, __assign({ ref: ref }, props));
});
exports.HeatmapCell = HeatmapCell;
HeatmapCell.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    height: prop_types_1.default.number.isRequired,
    ownerState: prop_types_1.default.shape({
        classes: prop_types_1.default.object,
        color: prop_types_1.default.string.isRequired,
        isFaded: prop_types_1.default.bool.isRequired,
        isHighlighted: prop_types_1.default.bool.isRequired,
        seriesId: prop_types_1.default.string.isRequired,
        value: prop_types_1.default.number.isRequired,
    }).isRequired,
    width: prop_types_1.default.number.isRequired,
    x: prop_types_1.default.number.isRequired,
    y: prop_types_1.default.number.isRequired,
};
