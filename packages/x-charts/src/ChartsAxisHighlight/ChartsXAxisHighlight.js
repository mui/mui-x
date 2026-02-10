"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChartsXHighlight;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var useScale_1 = require("../hooks/useScale");
var scaleGuards_1 = require("../internals/scaleGuards");
var useStore_1 = require("../internals/store/useStore");
var useChartCartesianAxis_1 = require("../internals/plugins/featurePlugins/useChartCartesianAxis");
var hooks_1 = require("../hooks");
var ChartsAxisHighlightPath_1 = require("./ChartsAxisHighlightPath");
/**
 * @ignore - internal component.
 */
function ChartsXHighlight(props) {
    var type = props.type, classes = props.classes;
    var _a = (0, hooks_1.useDrawingArea)(), top = _a.top, height = _a.height;
    var store = (0, useStore_1.useStore)();
    var axisXValues = store.use(useChartCartesianAxis_1.selectorChartsHighlightXAxisValue);
    var xAxes = store.use(useChartCartesianAxis_1.selectorChartXAxis);
    if (axisXValues.length === 0) {
        return null;
    }
    return axisXValues.map(function (_a) {
        var axisId = _a.axisId, value = _a.value;
        var xAxis = xAxes.axis[axisId];
        var xScale = xAxis.scale;
        var getXPosition = (0, useScale_1.getValueToPositionMapper)(xScale);
        var isXScaleOrdinal = type === 'band' && value !== null && (0, scaleGuards_1.isOrdinalScale)(xScale);
        if (process.env.NODE_ENV !== 'production') {
            var isError = isXScaleOrdinal && xScale(value) === undefined;
            if (isError) {
                console.error([
                    "MUI X Charts: The position value provided for the axis is not valid for the current scale.",
                    "This probably means something is wrong with the data passed to the chart.",
                    "The ChartsAxisHighlight component will not be displayed.",
                ].join('\n'));
            }
        }
        return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [isXScaleOrdinal && xScale(value) !== undefined && ((0, jsx_runtime_1.jsx)(ChartsAxisHighlightPath_1.ChartsAxisHighlightPath, { d: "M ".concat(xScale(value) - (xScale.step() - xScale.bandwidth()) / 2, " ").concat(top, " l ").concat(xScale.step(), " 0 l 0 ").concat(height, " l ").concat(-xScale.step(), " 0 Z"), className: classes.root, ownerState: { axisHighlight: 'band' } })), type === 'line' && value !== null && ((0, jsx_runtime_1.jsx)(ChartsAxisHighlightPath_1.ChartsAxisHighlightPath, { d: "M ".concat(getXPosition(value), " ").concat(top, " L ").concat(getXPosition(value), " ").concat(top + height), className: classes.root, ownerState: { axisHighlight: 'line' } }))] }, "".concat(axisId, "-").concat(value)));
    });
}
