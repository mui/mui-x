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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartClosestPoint = void 0;
var React = require("react");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var getSVGPoint_1 = require("../../../getSVGPoint");
var useChartCartesianAxis_1 = require("../useChartCartesianAxis");
var useChartSeries_selectors_1 = require("../../corePlugins/useChartSeries/useChartSeries.selectors");
var findClosestPoints_1 = require("./findClosestPoints");
var useChartClosestPoint = function (_a) {
    var _b, _c;
    var params = _a.params, store = _a.store, instance = _a.instance;
    var svgRef = instance.svgRef;
    var disableVoronoi = params.disableVoronoi, voronoiMaxRadius = params.voronoiMaxRadius, onItemClick = params.onItemClick;
    var _d = store.use(useChartCartesianAxis_1.selectorChartXAxis), xAxis = _d.axis, xAxisIds = _d.axisIds;
    var _e = store.use(useChartCartesianAxis_1.selectorChartYAxis), yAxis = _e.axis, yAxisIds = _e.axisIds;
    var zoomIsInteracting = store.use(useChartCartesianAxis_1.selectorChartZoomIsInteracting);
    var _f = (_c = (_b = store.use(useChartSeries_selectors_1.selectorChartSeriesProcessed)) === null || _b === void 0 ? void 0 : _b.scatter) !== null && _c !== void 0 ? _c : {}, series = _f.series, seriesOrder = _f.seriesOrder;
    var flatbushMap = store.use(zoomIsInteracting ? useChartCartesianAxis_1.selectorChartSeriesEmptyFlatbushMap : useChartCartesianAxis_1.selectorChartSeriesFlatbushMap);
    var defaultXAxisId = xAxisIds[0];
    var defaultYAxisId = yAxisIds[0];
    (0, useEnhancedEffect_1.default)(function () {
        store.set('voronoi', { isVoronoiEnabled: !disableVoronoi });
    }, [store, disableVoronoi]);
    React.useEffect(function () {
        if (svgRef.current === null || disableVoronoi) {
            return undefined;
        }
        var element = svgRef.current;
        function getClosestPoint(event) {
            var _a, _b, _c, _d, _e, _f;
            // Get mouse coordinate in global SVG space
            var svgPoint = (0, getSVGPoint_1.getSVGPoint)(element, event);
            if (!instance.isPointInside(svgPoint.x, svgPoint.y)) {
                return 'outside-chart';
            }
            var closestPoint = undefined;
            for (var _i = 0, _g = seriesOrder !== null && seriesOrder !== void 0 ? seriesOrder : []; _i < _g.length; _i++) {
                var seriesId = _g[_i];
                var aSeries = (series !== null && series !== void 0 ? series : {})[seriesId];
                var flatbush = flatbushMap.get(seriesId);
                if (!flatbush) {
                    continue;
                }
                var xAxisId = (_a = aSeries.xAxisId) !== null && _a !== void 0 ? _a : defaultXAxisId;
                var yAxisId = (_b = aSeries.yAxisId) !== null && _b !== void 0 ? _b : defaultYAxisId;
                var xAxisZoom = (0, useChartCartesianAxis_1.selectorChartAxisZoomData)(store.state, xAxisId);
                var yAxisZoom = (0, useChartCartesianAxis_1.selectorChartAxisZoomData)(store.state, yAxisId);
                var maxRadius = voronoiMaxRadius === 'item' ? aSeries.markerSize : voronoiMaxRadius;
                var xZoomStart = ((_c = xAxisZoom === null || xAxisZoom === void 0 ? void 0 : xAxisZoom.start) !== null && _c !== void 0 ? _c : 0) / 100;
                var xZoomEnd = ((_d = xAxisZoom === null || xAxisZoom === void 0 ? void 0 : xAxisZoom.end) !== null && _d !== void 0 ? _d : 100) / 100;
                var yZoomStart = ((_e = yAxisZoom === null || yAxisZoom === void 0 ? void 0 : yAxisZoom.start) !== null && _e !== void 0 ? _e : 0) / 100;
                var yZoomEnd = ((_f = yAxisZoom === null || yAxisZoom === void 0 ? void 0 : yAxisZoom.end) !== null && _f !== void 0 ? _f : 100) / 100;
                var xScale = xAxis[xAxisId].scale;
                var yScale = yAxis[yAxisId].scale;
                var closestPointIndex = (0, findClosestPoints_1.findClosestPoints)(flatbush, aSeries.data, xScale, yScale, xZoomStart, xZoomEnd, yZoomStart, yZoomEnd, svgPoint.x, svgPoint.y, maxRadius)[0];
                if (closestPointIndex === undefined) {
                    continue;
                }
                var point = aSeries.data[closestPointIndex];
                var scaledX = xScale(point.x);
                var scaledY = yScale(point.y);
                var distSq = Math.pow((scaledX - svgPoint.x), 2) + Math.pow((scaledY - svgPoint.y), 2);
                if (closestPoint === undefined || distSq < closestPoint.distanceSq) {
                    closestPoint = {
                        dataIndex: closestPointIndex,
                        seriesId: seriesId,
                        distanceSq: distSq,
                    };
                }
            }
            if (closestPoint === undefined) {
                return 'no-point-found';
            }
            return { seriesId: closestPoint.seriesId, dataIndex: closestPoint.dataIndex };
        }
        // Clean the interaction when the mouse leaves the chart.
        var moveEndHandler = instance.addInteractionListener('moveEnd', function (event) {
            var _a, _b, _c;
            if (!event.detail.activeGestures.pan) {
                (_a = instance.cleanInteraction) === null || _a === void 0 ? void 0 : _a.call(instance);
                (_b = instance.clearHighlight) === null || _b === void 0 ? void 0 : _b.call(instance);
                (_c = instance.removeTooltipItem) === null || _c === void 0 ? void 0 : _c.call(instance);
            }
        });
        var panEndHandler = instance.addInteractionListener('panEnd', function (event) {
            var _a, _b, _c;
            if (!event.detail.activeGestures.move) {
                (_a = instance.cleanInteraction) === null || _a === void 0 ? void 0 : _a.call(instance);
                (_b = instance.clearHighlight) === null || _b === void 0 ? void 0 : _b.call(instance);
                (_c = instance.removeTooltipItem) === null || _c === void 0 ? void 0 : _c.call(instance);
            }
        });
        var pressEndHandler = instance.addInteractionListener('quickPressEnd', function (event) {
            var _a, _b, _c;
            if (!event.detail.activeGestures.move && !event.detail.activeGestures.pan) {
                (_a = instance.cleanInteraction) === null || _a === void 0 ? void 0 : _a.call(instance);
                (_b = instance.clearHighlight) === null || _b === void 0 ? void 0 : _b.call(instance);
                (_c = instance.removeTooltipItem) === null || _c === void 0 ? void 0 : _c.call(instance);
            }
        });
        var gestureHandler = function (event) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            var closestPoint = getClosestPoint(event.detail.srcEvent);
            if (closestPoint === 'outside-chart') {
                (_a = instance.cleanInteraction) === null || _a === void 0 ? void 0 : _a.call(instance);
                (_b = instance.clearHighlight) === null || _b === void 0 ? void 0 : _b.call(instance);
                (_c = instance.removeTooltipItem) === null || _c === void 0 ? void 0 : _c.call(instance);
                return;
            }
            if (closestPoint === 'outside-voronoi-max-radius' || closestPoint === 'no-point-found') {
                (_d = instance.removeTooltipItem) === null || _d === void 0 ? void 0 : _d.call(instance);
                (_e = instance.clearHighlight) === null || _e === void 0 ? void 0 : _e.call(instance);
                (_f = instance.removeTooltipItem) === null || _f === void 0 ? void 0 : _f.call(instance);
                return;
            }
            var seriesId = closestPoint.seriesId, dataIndex = closestPoint.dataIndex;
            (_g = instance.setTooltipItem) === null || _g === void 0 ? void 0 : _g.call(instance, { type: 'scatter', seriesId: seriesId, dataIndex: dataIndex });
            (_h = instance.setLastUpdateSource) === null || _h === void 0 ? void 0 : _h.call(instance, 'pointer');
            (_j = instance.setHighlight) === null || _j === void 0 ? void 0 : _j.call(instance, {
                seriesId: seriesId,
                dataIndex: dataIndex,
            });
        };
        var tapHandler = instance.addInteractionListener('tap', function (event) {
            var closestPoint = getClosestPoint(event.detail.srcEvent);
            if (typeof closestPoint !== 'string' && onItemClick) {
                var seriesId = closestPoint.seriesId, dataIndex = closestPoint.dataIndex;
                onItemClick(event.detail.srcEvent, { type: 'scatter', seriesId: seriesId, dataIndex: dataIndex });
            }
        });
        var moveHandler = instance.addInteractionListener('move', gestureHandler);
        var panHandler = instance.addInteractionListener('pan', gestureHandler);
        var pressHandler = instance.addInteractionListener('quickPress', gestureHandler);
        return function () {
            tapHandler.cleanup();
            moveHandler.cleanup();
            moveEndHandler.cleanup();
            panHandler.cleanup();
            panEndHandler.cleanup();
            pressHandler.cleanup();
            pressEndHandler.cleanup();
        };
    }, [
        svgRef,
        yAxis,
        xAxis,
        voronoiMaxRadius,
        onItemClick,
        disableVoronoi,
        instance,
        seriesOrder,
        series,
        flatbushMap,
        defaultXAxisId,
        defaultYAxisId,
        store,
    ]);
    // Instance implementation
    var enableVoronoiCallback = (0, useEventCallback_1.default)(function () {
        store.set('voronoi', { isVoronoiEnabled: true });
    });
    var disableVoronoiCallback = (0, useEventCallback_1.default)(function () {
        store.set('voronoi', { isVoronoiEnabled: false });
    });
    return {
        instance: {
            enableVoronoi: enableVoronoiCallback,
            disableVoronoi: disableVoronoiCallback,
        },
    };
};
exports.useChartClosestPoint = useChartClosestPoint;
exports.useChartClosestPoint.getDefaultizedParams = function (_a) {
    var _b;
    var params = _a.params;
    return (__assign(__assign({}, params), { disableVoronoi: (_b = params.disableVoronoi) !== null && _b !== void 0 ? _b : !params.series.some(function (item) { return item.type === 'scatter'; }) }));
};
exports.useChartClosestPoint.getInitialState = function (params) { return ({
    voronoi: {
        isVoronoiEnabled: !params.disableVoronoi,
    },
}); };
exports.useChartClosestPoint.params = {
    disableVoronoi: true,
    voronoiMaxRadius: true,
    onItemClick: true,
};
