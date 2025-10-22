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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scatter = Scatter;
var React = require("react");
var prop_types_1 = require("prop-types");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var useInteractionItemProps_1 = require("../hooks/useInteractionItemProps");
var useStore_1 = require("../internals/store/useStore");
var useSelector_1 = require("../internals/store/useSelector");
var useItemHighlightedGetter_1 = require("../hooks/useItemHighlightedGetter");
var useChartClosestPoint_1 = require("../internals/plugins/featurePlugins/useChartClosestPoint");
var ScatterMarker_1 = require("./ScatterMarker");
var scatterClasses_1 = require("./scatterClasses");
var useScatterPlotData_1 = require("./useScatterPlotData");
var ChartProvider_1 = require("../context/ChartProvider");
var useIsItemFocusedGetter_1 = require("../hooks/useIsItemFocusedGetter");
/**
 * Demos:
 *
 * - [Scatter](https://mui.com/x/react-charts/scatter/)
 * - [Scatter demonstration](https://mui.com/x/react-charts/scatter-demo/)
 *
 * API:
 *
 * - [Scatter API](https://mui.com/x/api/charts/scatter/)
 */
function Scatter(props) {
    var _a;
    var series = props.series, xScale = props.xScale, yScale = props.yScale, color = props.color, colorGetter = props.colorGetter, onItemClick = props.onItemClick, inClasses = props.classes, slots = props.slots, slotProps = props.slotProps;
    var instance = (0, ChartProvider_1.useChartContext)().instance;
    var store = (0, useStore_1.useStore)();
    var isVoronoiEnabled = (0, useSelector_1.useSelector)(store, useChartClosestPoint_1.selectorChartsIsVoronoiEnabled);
    var skipInteractionHandlers = isVoronoiEnabled || series.disableHover;
    var _b = (0, useItemHighlightedGetter_1.useItemHighlightedGetter)(), isFaded = _b.isFaded, isHighlighted = _b.isHighlighted;
    var isFocused = (0, useIsItemFocusedGetter_1.useIsItemFocusedGetter)();
    var scatterPlotData = (0, useScatterPlotData_1.useScatterPlotData)(series, xScale, yScale, instance.isPointInside);
    var Marker = (_a = slots === null || slots === void 0 ? void 0 : slots.marker) !== null && _a !== void 0 ? _a : ScatterMarker_1.ScatterMarker;
    var _c = (0, useSlotProps_1.default)({
        elementType: Marker,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.marker,
        additionalProps: {
            seriesId: series.id,
            size: series.markerSize,
        },
        ownerState: {},
    }), ownerState = _c.ownerState, markerProps = __rest(_c, ["ownerState"]);
    var classes = (0, scatterClasses_1.useUtilityClasses)(inClasses);
    return (<g data-series={series.id} className={classes.root}>
      {scatterPlotData.map(function (dataPoint) {
            var _a;
            var isItemHighlighted = isHighlighted(dataPoint);
            var isItemFaded = !isItemHighlighted && isFaded(dataPoint);
            var isItemFocused = isFocused({
                seriesType: 'scatter',
                seriesId: series.id,
                dataIndex: dataPoint.dataIndex,
            });
            return (<Marker key={(_a = dataPoint.id) !== null && _a !== void 0 ? _a : dataPoint.dataIndex} dataIndex={dataPoint.dataIndex} color={colorGetter ? colorGetter(dataPoint.dataIndex) : color} isHighlighted={isItemHighlighted} isFaded={isItemFaded} x={dataPoint.x} y={dataPoint.y} onClick={onItemClick &&
                    (function (event) {
                        return onItemClick(event, {
                            type: 'scatter',
                            seriesId: series.id,
                            dataIndex: dataPoint.dataIndex,
                        });
                    })} data-highlighted={isItemHighlighted || undefined} data-faded={isItemFaded || undefined} data-focused={isItemFocused || undefined} {...(skipInteractionHandlers
                ? undefined
                : (0, useInteractionItemProps_1.getInteractionItemProps)(instance, dataPoint))} {...markerProps}/>);
        })}
    </g>);
}
Scatter.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    classes: prop_types_1.default.object,
    color: prop_types_1.default.string.isRequired,
    colorGetter: prop_types_1.default.func,
    /**
     * Callback fired when clicking on a scatter item.
     * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
     * @param {ScatterItemIdentifier} scatterItemIdentifier The scatter item identifier.
     */
    onItemClick: prop_types_1.default.func,
    series: prop_types_1.default.object.isRequired,
    slotProps: prop_types_1.default.object,
    slots: prop_types_1.default.object,
    xScale: prop_types_1.default.func.isRequired,
    yScale: prop_types_1.default.func.isRequired,
};
