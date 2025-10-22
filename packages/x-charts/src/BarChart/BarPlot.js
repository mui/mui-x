"use strict";
'use client';
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarPlot = BarPlot;
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var barElementClasses_1 = require("./barElementClasses");
var BarElement_1 = require("./BarElement");
var hooks_1 = require("../hooks");
var BarClipPath_1 = require("./BarClipPath");
var BarLabelPlot_1 = require("./BarLabel/BarLabelPlot");
var useSkipAnimation_1 = require("../hooks/useSkipAnimation");
var useInternalIsZoomInteracting_1 = require("../internals/plugins/featurePlugins/useChartCartesianAxis/useInternalIsZoomInteracting");
var useBarPlotData_1 = require("./useBarPlotData");
var barClasses_1 = require("./barClasses");
var BarPlotRoot = (0, styles_1.styled)('g', {
    name: 'MuiBarPlot',
    slot: 'Root',
})((_a = {},
    _a["& .".concat(barElementClasses_1.barElementClasses.root)] = {
        transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
    },
    _a));
/**
 * Demos:
 *
 * - [Bars](https://mui.com/x/react-charts/bars/)
 * - [Bar demonstration](https://mui.com/x/react-charts/bar-demo/)
 * - [Stacking](https://mui.com/x/react-charts/stacking/)
 *
 * API:
 *
 * - [BarPlot API](https://mui.com/x/api/charts/bar-plot/)
 */
function BarPlot(props) {
    var inSkipAnimation = props.skipAnimation, onItemClick = props.onItemClick, borderRadius = props.borderRadius, barLabel = props.barLabel, other = __rest(props, ["skipAnimation", "onItemClick", "borderRadius", "barLabel"]);
    var isZoomInteracting = (0, useInternalIsZoomInteracting_1.useInternalIsZoomInteracting)();
    var skipAnimation = (0, useSkipAnimation_1.useSkipAnimation)(isZoomInteracting || inSkipAnimation);
    var xAxes = (0, hooks_1.useXAxes)().xAxis;
    var yAxes = (0, hooks_1.useYAxes)().yAxis;
    var _a = (0, useBarPlotData_1.useBarPlotData)((0, hooks_1.useDrawingArea)(), xAxes, yAxes), completedData = _a.completedData, masksData = _a.masksData;
    var withoutBorderRadius = !borderRadius || borderRadius <= 0;
    var classes = (0, barClasses_1.useUtilityClasses)();
    return (<BarPlotRoot className={classes.root}>
      {!withoutBorderRadius &&
            masksData.map(function (_a) {
                var id = _a.id, x = _a.x, y = _a.y, xOrigin = _a.xOrigin, yOrigin = _a.yOrigin, width = _a.width, height = _a.height, hasPositive = _a.hasPositive, hasNegative = _a.hasNegative, layout = _a.layout;
                return (<BarClipPath_1.BarClipPath key={id} maskId={id} borderRadius={borderRadius} hasNegative={hasNegative} hasPositive={hasPositive} layout={layout} x={x} y={y} xOrigin={xOrigin} yOrigin={yOrigin} width={width} height={height} skipAnimation={skipAnimation !== null && skipAnimation !== void 0 ? skipAnimation : false}/>);
            })}
      {completedData.map(function (_a) {
            var seriesId = _a.seriesId, data = _a.data;
            return (<g key={seriesId} data-series={seriesId} className={classes.series}>
            {data.map(function (_a) {
                    var dataIndex = _a.dataIndex, color = _a.color, maskId = _a.maskId, layout = _a.layout, x = _a.x, xOrigin = _a.xOrigin, y = _a.y, yOrigin = _a.yOrigin, width = _a.width, height = _a.height;
                    var barElement = (<BarElement_1.BarElement key={dataIndex} id={seriesId} dataIndex={dataIndex} color={color} skipAnimation={skipAnimation !== null && skipAnimation !== void 0 ? skipAnimation : false} layout={layout !== null && layout !== void 0 ? layout : 'vertical'} x={x} xOrigin={xOrigin} y={y} yOrigin={yOrigin} width={width} height={height} {...other} onClick={onItemClick &&
                            (function (event) {
                                onItemClick(event, { type: 'bar', seriesId: seriesId, dataIndex: dataIndex });
                            })}/>);
                    if (withoutBorderRadius) {
                        return barElement;
                    }
                    return (<g key={dataIndex} clipPath={"url(#".concat(maskId, ")")}>
                    {barElement}
                  </g>);
                })}
          </g>);
        })}
      {barLabel && (<BarLabelPlot_1.BarLabelPlot bars={completedData} skipAnimation={skipAnimation} barLabel={barLabel} {...other}/>)}
    </BarPlotRoot>);
}
BarPlot.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * If provided, the function will be used to format the label of the bar.
     * It can be set to 'value' to display the current value.
     * @param {BarItem} item The item to format.
     * @param {BarLabelContext} context data about the bar.
     * @returns {string} The formatted label.
     */
    barLabel: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['value']), prop_types_1.default.func]),
    /**
     * Defines the border radius of the bar element.
     */
    borderRadius: prop_types_1.default.number,
    /**
     * Callback fired when a bar item is clicked.
     * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
     * @param {BarItemIdentifier} barItemIdentifier The bar item identifier.
     */
    onItemClick: prop_types_1.default.func,
    /**
     * If `true`, animations are skipped.
     * @default undefined
     */
    skipAnimation: prop_types_1.default.bool,
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps: prop_types_1.default.object,
    /**
     * Overridable component slots.
     * @default {}
     */
    slots: prop_types_1.default.object,
};
