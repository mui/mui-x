"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsAxisHighlight = ChartsAxisHighlight;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var composeClasses_1 = require("@mui/utils/composeClasses");
var chartsAxisHighlightClasses_1 = require("./chartsAxisHighlightClasses");
var ChartsYAxisHighlight_1 = require("./ChartsYAxisHighlight");
var ChartsXAxisHighlight_1 = require("./ChartsXAxisHighlight");
var useUtilityClasses = function () {
    var slots = {
        root: ['root'],
    };
    return (0, composeClasses_1.default)(slots, chartsAxisHighlightClasses_1.getAxisHighlightUtilityClass);
};
/**
 * Demos:
 *
 * - [Custom components](https://mui.com/x/react-charts/components/)
 *
 * API:
 *
 * - [ChartsAxisHighlight API](https://mui.com/x/api/charts/charts-axis-highlight/)
 */
function ChartsAxisHighlight(props) {
    var xAxisHighlight = props.x, yAxisHighlight = props.y;
    var classes = useUtilityClasses();
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [xAxisHighlight && xAxisHighlight !== 'none' && ((0, jsx_runtime_1.jsx)(ChartsXAxisHighlight_1.default, { type: xAxisHighlight, classes: classes })), yAxisHighlight && yAxisHighlight !== 'none' && ((0, jsx_runtime_1.jsx)(ChartsYAxisHighlight_1.default, { type: yAxisHighlight, classes: classes }))] }));
}
ChartsAxisHighlight.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    x: prop_types_1.default.oneOf(['band', 'line', 'none']),
    y: prop_types_1.default.oneOf(['band', 'line', 'none']),
};
