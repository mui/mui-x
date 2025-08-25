"use strict";
'use client';
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartFunnelAxis = void 0;
var React = require("react");
var warning_1 = require("@mui/x-internals/warning");
var internals_1 = require("@mui/x-charts/internals");
var useChartFunnelAxisRendering_selectors_1 = require("./useChartFunnelAxisRendering.selectors");
var useChartFunnelAxis = function (_a) {
    var params = _a.params, store = _a.store, seriesConfig = _a.seriesConfig, svgRef = _a.svgRef, instance = _a.instance;
    var xAxis = params.xAxis, yAxis = params.yAxis, dataset = params.dataset, gap = params.gap;
    if (process.env.NODE_ENV !== 'production') {
        var ids_1 = __spreadArray(__spreadArray([], (xAxis !== null && xAxis !== void 0 ? xAxis : []), true), (yAxis !== null && yAxis !== void 0 ? yAxis : []), true).filter(function (axis) { return axis.id; })
            .map(function (axis) { return axis.id; });
        var duplicates = new Set(ids_1.filter(function (id, index) { return ids_1.indexOf(id) !== index; }));
        if (duplicates.size > 0) {
            (0, warning_1.warnOnce)([
                "MUI X Charts: The following axis ids are duplicated: ".concat(Array.from(duplicates).join(', '), "."),
                "Please make sure that each axis has a unique id.",
            ].join('\n'), 'error');
        }
    }
    var drawingArea = (0, internals_1.useSelector)(store, internals_1.selectorChartDrawingArea);
    var isInteractionEnabled = (0, internals_1.useSelector)(store, internals_1.selectorChartsInteractionIsInitialized);
    var isFirstRender = React.useRef(true);
    React.useEffect(function () {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        store.update(function (prev) { return (__assign(__assign({}, prev), { funnel: {
                gap: gap !== null && gap !== void 0 ? gap : 0,
            }, cartesianAxis: __assign(__assign({}, prev.cartesianAxis), { x: (0, internals_1.defaultizeXAxis)(xAxis, dataset), y: (0, internals_1.defaultizeYAxis)(yAxis, dataset) }) })); });
    }, [seriesConfig, drawingArea, xAxis, yAxis, dataset, store, gap]);
    React.useEffect(function () {
        var element = svgRef.current;
        if (!isInteractionEnabled || !element || params.disableAxisListener) {
            return function () { };
        }
        // Clean the interaction when the mouse leaves the chart.
        var moveEndHandler = instance.addInteractionListener('moveEnd', function (event) {
            var _a;
            if (!event.detail.activeGestures.pan) {
                (_a = instance.cleanInteraction) === null || _a === void 0 ? void 0 : _a.call(instance);
            }
        });
        var panEndHandler = instance.addInteractionListener('panEnd', function (event) {
            var _a;
            if (!event.detail.activeGestures.move) {
                (_a = instance.cleanInteraction) === null || _a === void 0 ? void 0 : _a.call(instance);
            }
        });
        var pressEndHandler = instance.addInteractionListener('quickPressEnd', function (event) {
            var _a;
            if (!event.detail.activeGestures.move && !event.detail.activeGestures.pan) {
                (_a = instance.cleanInteraction) === null || _a === void 0 ? void 0 : _a.call(instance);
            }
        });
        var gestureHandler = function (event) {
            var _a, _b;
            var srvEvent = event.detail.srcEvent;
            var target = event.detail.target;
            var svgPoint = (0, internals_1.getSVGPoint)(element, srvEvent);
            // Release the pointer capture if we are panning, as this would cause the tooltip to
            // be locked to the first "section" it touches.
            if (event.detail.srcEvent.buttons >= 1 &&
                (target === null || target === void 0 ? void 0 : target.hasPointerCapture(event.detail.srcEvent.pointerId))) {
                target === null || target === void 0 ? void 0 : target.releasePointerCapture(event.detail.srcEvent.pointerId);
            }
            if (!instance.isPointInside(svgPoint.x, svgPoint.y, target)) {
                (_a = instance.cleanInteraction) === null || _a === void 0 ? void 0 : _a.call(instance);
                return;
            }
            (_b = instance.setPointerCoordinate) === null || _b === void 0 ? void 0 : _b.call(instance, svgPoint);
        };
        var moveHandler = instance.addInteractionListener('move', gestureHandler);
        var panHandler = instance.addInteractionListener('pan', gestureHandler);
        var pressHandler = instance.addInteractionListener('quickPress', gestureHandler);
        return function () {
            moveHandler.cleanup();
            moveEndHandler.cleanup();
            panHandler.cleanup();
            panEndHandler.cleanup();
            pressHandler.cleanup();
            pressEndHandler.cleanup();
        };
    }, [svgRef, instance, params.disableAxisListener, isInteractionEnabled]);
    React.useEffect(function () {
        var element = svgRef.current;
        var onAxisClick = params.onAxisClick;
        if (element === null || !onAxisClick) {
            return function () { };
        }
        var axisClickHandler = instance.addInteractionListener('tap', function (event) {
            var _a;
            var _b = (0, useChartFunnelAxisRendering_selectors_1.selectorChartXAxis)(store.value), xAxisWithScale = _b.axis, xAxisIds = _b.axisIds;
            var _c = (0, useChartFunnelAxisRendering_selectors_1.selectorChartYAxis)(store.value), yAxisWithScale = _c.axis, yAxisIds = _c.axisIds;
            var processedSeries = (0, internals_1.selectorChartSeriesProcessed)(store.value);
            var usedXAxis = xAxisIds[0];
            var usedYAxis = yAxisIds[0];
            var dataIndex = null;
            var isXAxis = false;
            var svgPoint = (0, internals_1.getSVGPoint)(element, event.detail.srcEvent);
            var xIndex = (0, internals_1.getCartesianAxisIndex)(xAxisWithScale[usedXAxis], svgPoint.x);
            isXAxis = xIndex !== -1;
            dataIndex = isXAxis ? xIndex : (0, internals_1.getCartesianAxisIndex)(yAxisWithScale[usedYAxis], svgPoint.y);
            var USED_AXIS_ID = isXAxis ? xAxisIds[0] : yAxisIds[0];
            if (dataIndex == null || dataIndex === -1) {
                return;
            }
            // The .data exist because otherwise the dataIndex would be null or -1.
            var axisValue = (isXAxis ? xAxisWithScale : yAxisWithScale)[USED_AXIS_ID].data[dataIndex];
            var seriesValues = {};
            (_a = processedSeries.funnel) === null || _a === void 0 ? void 0 : _a.seriesOrder.forEach(function (seriesId) {
                var seriesItem = processedSeries.funnel.series[seriesId];
                var providedXAxisId = seriesItem.xAxisId;
                var providedYAxisId = seriesItem.yAxisId;
                var axisKey = isXAxis ? providedXAxisId : providedYAxisId;
                if (axisKey === undefined || axisKey === USED_AXIS_ID) {
                    seriesValues[seriesId] = seriesItem.data[dataIndex].value;
                }
            });
            onAxisClick(event.detail.srcEvent, { dataIndex: dataIndex, axisValue: axisValue, seriesValues: seriesValues });
        });
        return function () {
            axisClickHandler.cleanup();
        };
    }, [params.onAxisClick, svgRef, store, instance]);
    return {};
};
exports.useChartFunnelAxis = useChartFunnelAxis;
exports.useChartFunnelAxis.params = {
    xAxis: true,
    yAxis: true,
    gap: true,
    dataset: true,
    onAxisClick: true,
    disableAxisListener: true,
};
exports.useChartFunnelAxis.getDefaultizedParams = function (_a) {
    var _b;
    var params = _a.params;
    return __assign(__assign({}, params), { gap: (_b = params.gap) !== null && _b !== void 0 ? _b : 0, defaultizedXAxis: (0, internals_1.defaultizeXAxis)(params.xAxis, params.dataset), defaultizedYAxis: (0, internals_1.defaultizeYAxis)(params.yAxis, params.dataset) });
};
exports.useChartFunnelAxis.getInitialState = function (params) {
    var _a;
    return {
        funnel: {
            gap: (_a = params.gap) !== null && _a !== void 0 ? _a : 0,
        },
        cartesianAxis: {
            x: params.defaultizedXAxis,
            y: params.defaultizedYAxis,
        },
    };
};
