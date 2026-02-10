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
exports.useChartBrush = void 0;
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var React = require("react");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var getSVGPoint_1 = require("../../../getSVGPoint");
var useChartBrush_selectors_1 = require("./useChartBrush.selectors");
var useChartBrush = function (_a) {
    var store = _a.store, instance = _a.instance, params = _a.params;
    var svgRef = instance.svgRef;
    var isEnabled = store.use(useChartBrush_selectors_1.selectorIsBrushEnabled);
    (0, useEnhancedEffect_1.default)(function () {
        store.set('brush', __assign(__assign({}, store.state.brush), { enabled: params.brushConfig.enabled, preventTooltip: params.brushConfig.preventTooltip, preventHighlight: params.brushConfig.preventHighlight }));
    }, [
        store,
        params.brushConfig.enabled,
        params.brushConfig.preventTooltip,
        params.brushConfig.preventHighlight,
    ]);
    var setBrushCoordinates = (0, useEventCallback_1.default)(function setBrushCoordinates(point) {
        var _a;
        store.set('brush', __assign(__assign({}, store.state.brush), { start: (_a = store.state.brush.start) !== null && _a !== void 0 ? _a : point, current: point }));
    });
    var clearBrush = (0, useEventCallback_1.default)(function clearBrush() {
        store.set('brush', __assign(__assign({}, store.state.brush), { start: null, current: null }));
    });
    var setZoomBrushEnabled = (0, useEventCallback_1.default)(function setZoomBrushEnabled(enabled) {
        if (store.state.brush.isZoomBrushEnabled === enabled) {
            return;
        }
        store.set('brush', __assign(__assign({}, store.state.brush), { isZoomBrushEnabled: enabled }));
    });
    React.useEffect(function () {
        var element = svgRef.current;
        if (element === null || !isEnabled) {
            return function () { };
        }
        var handleBrushStart = function (event) {
            var _a;
            if ((_a = event.detail.target) === null || _a === void 0 ? void 0 : _a.closest('[data-charts-zoom-slider]')) {
                return;
            }
            var point = (0, getSVGPoint_1.getSVGPoint)(element, {
                clientX: event.detail.initialCentroid.x,
                clientY: event.detail.initialCentroid.y,
            });
            setBrushCoordinates(point);
        };
        var handleBrush = function (event) {
            var currentPoint = (0, getSVGPoint_1.getSVGPoint)(element, {
                clientX: event.detail.centroid.x,
                clientY: event.detail.centroid.y,
            });
            setBrushCoordinates(currentPoint);
        };
        var brushStartHandler = instance.addInteractionListener('brushStart', handleBrushStart);
        var brushHandler = instance.addInteractionListener('brush', handleBrush);
        var brushCancelHandler = instance.addInteractionListener('brushCancel', clearBrush);
        var brushEndHandler = instance.addInteractionListener('brushEnd', clearBrush);
        return function () {
            brushStartHandler.cleanup();
            brushHandler.cleanup();
            brushEndHandler.cleanup();
            brushCancelHandler.cleanup();
        };
    }, [svgRef, instance, store, clearBrush, setBrushCoordinates, isEnabled]);
    return {
        instance: {
            setBrushCoordinates: setBrushCoordinates,
            clearBrush: clearBrush,
            setZoomBrushEnabled: setZoomBrushEnabled,
        },
    };
};
exports.useChartBrush = useChartBrush;
exports.useChartBrush.params = {
    brushConfig: true,
};
exports.useChartBrush.getDefaultizedParams = function (_a) {
    var _b, _c, _d, _e, _f, _g;
    var params = _a.params;
    return __assign(__assign({}, params), { brushConfig: {
            enabled: (_c = (_b = params === null || params === void 0 ? void 0 : params.brushConfig) === null || _b === void 0 ? void 0 : _b.enabled) !== null && _c !== void 0 ? _c : false,
            preventTooltip: (_e = (_d = params === null || params === void 0 ? void 0 : params.brushConfig) === null || _d === void 0 ? void 0 : _d.preventTooltip) !== null && _e !== void 0 ? _e : true,
            preventHighlight: (_g = (_f = params === null || params === void 0 ? void 0 : params.brushConfig) === null || _f === void 0 ? void 0 : _f.preventHighlight) !== null && _g !== void 0 ? _g : true,
        } });
};
exports.useChartBrush.getInitialState = function (params) {
    return {
        brush: {
            enabled: params.brushConfig.enabled,
            isZoomBrushEnabled: false,
            preventTooltip: params.brushConfig.preventTooltip,
            preventHighlight: params.brushConfig.preventHighlight,
            start: null,
            current: null,
        },
    };
};
