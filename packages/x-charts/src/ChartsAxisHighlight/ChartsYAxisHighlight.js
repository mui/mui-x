"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChartsYHighlight;
var React = require("react");
var useScale_1 = require("../hooks/useScale");
var isBandScale_1 = require("../internals/isBandScale");
var useSelector_1 = require("../internals/store/useSelector");
var useStore_1 = require("../internals/store/useStore");
var useChartCartesianAxis_1 = require("../internals/plugins/featurePlugins/useChartCartesianAxis");
var hooks_1 = require("../hooks");
var ChartsAxisHighlightPath_1 = require("./ChartsAxisHighlightPath");
/**
 * @ignore - internal component.
 */
function ChartsYHighlight(props) {
    var type = props.type, classes = props.classes;
    var _a = (0, hooks_1.useDrawingArea)(), left = _a.left, width = _a.width;
    var store = (0, useStore_1.useStore)();
    var axisYValues = (0, useSelector_1.useSelector)(store, useChartCartesianAxis_1.selectorChartsHighlightYAxisValue);
    var yAxes = (0, useSelector_1.useSelector)(store, useChartCartesianAxis_1.selectorChartYAxis);
    if (axisYValues.length === 0) {
        return null;
    }
    return axisYValues.map(function (_a) {
        var axisId = _a.axisId, value = _a.value;
        var yAxis = yAxes.axis[axisId];
        var yScale = yAxis.scale;
        var getYPosition = (0, useScale_1.getValueToPositionMapper)(yScale);
        var isBandScaleY = type === 'band' && value !== null && (0, isBandScale_1.isBandScale)(yScale);
        if (process.env.NODE_ENV !== 'production') {
            var isError = isBandScaleY && yScale(value) === undefined;
            if (isError) {
                console.error([
                    "MUI X Charts: The position value provided for the axis is not valid for the current scale.",
                    "This probably means something is wrong with the data passed to the chart.",
                    "The ChartsAxisHighlight component will not be displayed.",
                ].join('\n'));
            }
        }
        return (<React.Fragment key={"".concat(axisId, "-").concat(value)}>
        {isBandScaleY && yScale(value) !== undefined && (<ChartsAxisHighlightPath_1.ChartsAxisHighlightPath d={"M ".concat(left, " ").concat(yScale(value) - (yScale.step() - yScale.bandwidth()) / 2, " l 0 ").concat(yScale.step(), " l ").concat(width, " 0 l 0 ").concat(-yScale.step(), " Z")} className={classes.root} ownerState={{ axisHighlight: 'band' }}/>)}

        {type === 'line' && value !== null && (<ChartsAxisHighlightPath_1.ChartsAxisHighlightPath d={"M ".concat(left, " ").concat(getYPosition(value), " L ").concat(left + width, " ").concat(getYPosition(value))} className={classes.root} ownerState={{ axisHighlight: 'line' }}/>)}
      </React.Fragment>);
    });
}
