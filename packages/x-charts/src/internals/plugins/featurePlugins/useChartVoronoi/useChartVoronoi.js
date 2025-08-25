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
exports.useChartVoronoi = void 0;
var React = require("react");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var d3_delaunay_1 = require("@mui/x-charts-vendor/d3-delaunay");
var useScale_1 = require("../../../../hooks/useScale");
var getSVGPoint_1 = require("../../../getSVGPoint");
var useSelector_1 = require("../../../store/useSelector");
var useChartCartesianAxis_1 = require("../useChartCartesianAxis");
var useChartSeries_selectors_1 = require("../../corePlugins/useChartSeries/useChartSeries.selectors");
var useChartDimensions_1 = require("../../corePlugins/useChartDimensions");
var useChartVoronoi = function (_a) {
    var _b, _c;
    var svgRef = _a.svgRef, params = _a.params, store = _a.store, instance = _a.instance;
    var disableVoronoi = params.disableVoronoi, voronoiMaxRadius = params.voronoiMaxRadius, onItemClick = params.onItemClick;
    var drawingArea = (0, useSelector_1.useSelector)(store, useChartDimensions_1.selectorChartDrawingArea);
    var _d = (0, useSelector_1.useSelector)(store, useChartCartesianAxis_1.selectorChartXAxis), xAxis = _d.axis, xAxisIds = _d.axisIds;
    var _e = (0, useSelector_1.useSelector)(store, useChartCartesianAxis_1.selectorChartYAxis), yAxis = _e.axis, yAxisIds = _e.axisIds;
    var zoomIsInteracting = (0, useSelector_1.useSelector)(store, useChartCartesianAxis_1.selectorChartZoomIsInteracting);
    var _f = (_c = (_b = (0, useSelector_1.useSelector)(store, useChartSeries_selectors_1.selectorChartSeriesProcessed)) === null || _b === void 0 ? void 0 : _b.scatter) !== null && _c !== void 0 ? _c : {}, series = _f.series, seriesOrder = _f.seriesOrder;
    var voronoiRef = React.useRef({});
    var delauneyRef = React.useRef(undefined);
    var lastFind = React.useRef(undefined);
    var defaultXAxisId = xAxisIds[0];
    var defaultYAxisId = yAxisIds[0];
    (0, useEnhancedEffect_1.default)(function () {
        store.update(function (prev) {
            return prev.voronoi.isVoronoiEnabled === !disableVoronoi
                ? prev
                : __assign(__assign({}, prev), { voronoi: {
                        isVoronoiEnabled: !disableVoronoi,
                    } });
        });
    }, [store, disableVoronoi]);
    (0, useEnhancedEffect_1.default)(function () {
        // This effect generate and store the Delaunay object that's used to map coordinate to closest point.
        if (zoomIsInteracting || seriesOrder === undefined || series === undefined || disableVoronoi) {
            // If there is no scatter chart series
            return;
        }
        voronoiRef.current = {};
        var points = [];
        seriesOrder.forEach(function (seriesId) {
            var _a = series[seriesId], data = _a.data, xAxisId = _a.xAxisId, yAxisId = _a.yAxisId;
            var xScale = xAxis[xAxisId !== null && xAxisId !== void 0 ? xAxisId : defaultXAxisId].scale;
            var yScale = yAxis[yAxisId !== null && yAxisId !== void 0 ? yAxisId : defaultYAxisId].scale;
            var getXPosition = (0, useScale_1.getValueToPositionMapper)(xScale);
            var getYPosition = (0, useScale_1.getValueToPositionMapper)(yScale);
            var seriesPoints = [];
            var seriesIndexes = [];
            for (var dataIndex = 0; dataIndex < data.length; dataIndex += 1) {
                var _b = data[dataIndex], x = _b.x, y = _b.y;
                var pointX = getXPosition(x);
                var pointY = getYPosition(y);
                if (instance.isPointInside(pointX, pointY)) {
                    seriesPoints.push(pointX);
                    seriesPoints.push(pointY);
                    seriesIndexes.push(dataIndex);
                }
            }
            voronoiRef.current[seriesId] = {
                seriesId: seriesId,
                seriesIndexes: seriesIndexes,
                startIndex: points.length,
                endIndex: points.length + seriesPoints.length,
            };
            points = points.concat(seriesPoints);
        });
        delauneyRef.current = new d3_delaunay_1.Delaunay(points);
        lastFind.current = undefined;
    }, [
        zoomIsInteracting,
        defaultXAxisId,
        defaultYAxisId,
        series,
        seriesOrder,
        xAxis,
        yAxis,
        drawingArea,
        instance,
        disableVoronoi,
    ]);
    React.useEffect(function () {
        if (svgRef.current === null || disableVoronoi) {
            return undefined;
        }
        var element = svgRef.current;
        function getClosestPoint(event) {
            // Get mouse coordinate in global SVG space
            var svgPoint = (0, getSVGPoint_1.getSVGPoint)(element, event);
            if (!instance.isPointInside(svgPoint.x, svgPoint.y)) {
                lastFind.current = undefined;
                return 'outside-chart';
            }
            if (!delauneyRef.current) {
                return 'no-point-found';
            }
            var closestPointIndex = delauneyRef.current.find(svgPoint.x, svgPoint.y, lastFind.current);
            if (closestPointIndex === undefined) {
                return 'no-point-found';
            }
            lastFind.current = closestPointIndex;
            var closestSeries = Object.values(voronoiRef.current).find(function (value) {
                return 2 * closestPointIndex >= value.startIndex && 2 * closestPointIndex < value.endIndex;
            });
            if (closestSeries === undefined) {
                return 'no-point-found';
            }
            // The point index in the series with id=closestSeries.seriesId.
            var seriesPointIndex = (2 * closestPointIndex - voronoiRef.current[closestSeries.seriesId].startIndex) / 2;
            var dataIndex = voronoiRef.current[closestSeries.seriesId].seriesIndexes[seriesPointIndex];
            if (voronoiMaxRadius !== undefined) {
                var pointX = delauneyRef.current.points[2 * closestPointIndex];
                var pointY = delauneyRef.current.points[2 * closestPointIndex + 1];
                var dist2 = Math.pow((pointX - svgPoint.x), 2) + Math.pow((pointY - svgPoint.y), 2);
                if (dist2 > Math.pow(voronoiMaxRadius, 2)) {
                    // The closest point is too far to be considered.
                    return 'outside-voronoi-max-radius';
                }
            }
            return { seriesId: closestSeries.seriesId, dataIndex: dataIndex };
        }
        // Clean the interaction when the mouse leaves the chart.
        var moveEndHandler = instance.addInteractionListener('moveEnd', function (event) {
            var _a, _b;
            if (!event.detail.activeGestures.pan) {
                (_a = instance.cleanInteraction) === null || _a === void 0 ? void 0 : _a.call(instance);
                (_b = instance.clearHighlight) === null || _b === void 0 ? void 0 : _b.call(instance);
            }
        });
        var panEndHandler = instance.addInteractionListener('panEnd', function (event) {
            var _a, _b;
            if (!event.detail.activeGestures.move) {
                (_a = instance.cleanInteraction) === null || _a === void 0 ? void 0 : _a.call(instance);
                (_b = instance.clearHighlight) === null || _b === void 0 ? void 0 : _b.call(instance);
            }
        });
        var pressEndHandler = instance.addInteractionListener('quickPressEnd', function (event) {
            var _a, _b;
            if (!event.detail.activeGestures.move && !event.detail.activeGestures.pan) {
                (_a = instance.cleanInteraction) === null || _a === void 0 ? void 0 : _a.call(instance);
                (_b = instance.clearHighlight) === null || _b === void 0 ? void 0 : _b.call(instance);
            }
        });
        var gestureHandler = function (event) {
            var _a, _b, _c, _d, _e, _f;
            var closestPoint = getClosestPoint(event.detail.srcEvent);
            if (closestPoint === 'outside-chart') {
                (_a = instance.cleanInteraction) === null || _a === void 0 ? void 0 : _a.call(instance);
                (_b = instance.clearHighlight) === null || _b === void 0 ? void 0 : _b.call(instance);
                return;
            }
            if (closestPoint === 'outside-voronoi-max-radius' || closestPoint === 'no-point-found') {
                (_c = instance.removeItemInteraction) === null || _c === void 0 ? void 0 : _c.call(instance);
                (_d = instance.clearHighlight) === null || _d === void 0 ? void 0 : _d.call(instance);
                return;
            }
            var seriesId = closestPoint.seriesId, dataIndex = closestPoint.dataIndex;
            (_e = instance.setItemInteraction) === null || _e === void 0 ? void 0 : _e.call(instance, { type: 'scatter', seriesId: seriesId, dataIndex: dataIndex });
            (_f = instance.setHighlight) === null || _f === void 0 ? void 0 : _f.call(instance, {
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
    }, [svgRef, yAxis, xAxis, voronoiMaxRadius, onItemClick, disableVoronoi, drawingArea, instance]);
    // Instance implementation
    var enableVoronoiCallback = (0, useEventCallback_1.default)(function () {
        store.update(function (prev) { return (__assign(__assign({}, prev), { voronoi: __assign(__assign({}, prev.voronoi), { isVoronoiEnabled: true }) })); });
    });
    var disableVoronoiCallback = (0, useEventCallback_1.default)(function () {
        store.update(function (prev) { return (__assign(__assign({}, prev), { voronoi: __assign(__assign({}, prev.voronoi), { isVoronoiEnabled: false }) })); });
    });
    return {
        instance: {
            enableVoronoi: enableVoronoiCallback,
            disableVoronoi: disableVoronoiCallback,
        },
    };
};
exports.useChartVoronoi = useChartVoronoi;
exports.useChartVoronoi.getDefaultizedParams = function (_a) {
    var _b;
    var params = _a.params;
    return (__assign(__assign({}, params), { disableVoronoi: (_b = params.disableVoronoi) !== null && _b !== void 0 ? _b : !params.series.some(function (item) { return item.type === 'scatter'; }) }));
};
exports.useChartVoronoi.getInitialState = function (params) { return ({
    voronoi: {
        isVoronoiEnabled: !params.disableVoronoi,
    },
}); };
exports.useChartVoronoi.params = {
    disableVoronoi: true,
    voronoiMaxRadius: true,
    onItemClick: true,
};
