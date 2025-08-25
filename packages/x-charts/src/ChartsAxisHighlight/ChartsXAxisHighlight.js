"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChartsXHighlight;
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
function ChartsXHighlight(props) {
    var type = props.type, classes = props.classes;
    var _a = (0, hooks_1.useDrawingArea)(), top = _a.top, height = _a.height;
    var store = (0, useStore_1.useStore)();
    var axisXValues = (0, useSelector_1.useSelector)(store, useChartCartesianAxis_1.selectorChartsHighlightXAxisValue);
    var xAxes = (0, useSelector_1.useSelector)(store, useChartCartesianAxis_1.selectorChartXAxis);
    if (axisXValues.length === 0) {
        return null;
    }
    return axisXValues.map(function (_a) {
        var axisId = _a.axisId, value = _a.value;
        var xAxis = xAxes.axis[axisId];
        var xScale = xAxis.scale;
        var getXPosition = (0, useScale_1.getValueToPositionMapper)(xScale);
        var isBandScaleX = type === 'band' && value !== null && (0, isBandScale_1.isBandScale)(xScale);
        if (process.env.NODE_ENV !== 'production') {
            var isError = isBandScaleX && xScale(value) === undefined;
            if (isError) {
                console.error([
                    "MUI X Charts: The position value provided for the axis is not valid for the current scale.",
                    "This probably means something is wrong with the data passed to the chart.",
                    "The ChartsAxisHighlight component will not be displayed.",
                ].join('\n'));
            }
        }
        return (<React.Fragment key={"".concat(axisId, "-").concat(value)}>
        {isBandScaleX && xScale(value) !== undefined && (<ChartsAxisHighlightPath_1.ChartsAxisHighlightPath d={"M ".concat(xScale(value) - (xScale.step() - xScale.bandwidth()) / 2, " ").concat(top, " l ").concat(xScale.step(), " 0 l 0 ").concat(height, " l ").concat(-xScale.step(), " 0 Z")} className={classes.root} ownerState={{ axisHighlight: 'band' }}/>)}

        {type === 'line' && value !== null && (<ChartsAxisHighlightPath_1.ChartsAxisHighlightPath d={"M ".concat(getXPosition(value), " ").concat(top, " L ").concat(getXPosition(value), " ").concat(top + height)} className={classes.root} ownerState={{ axisHighlight: 'line' }}/>)}
      </React.Fragment>);
    });
}
