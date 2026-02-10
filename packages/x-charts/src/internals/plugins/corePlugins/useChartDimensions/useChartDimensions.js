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
exports.useChartDimensions = void 0;
var React = require("react");
var useEffectAfterFirstRender_1 = require("@mui/x-internals/useEffectAfterFirstRender");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var ownerWindow_1 = require("@mui/utils/ownerWindow");
var constants_1 = require("../../../../constants");
var useChartDimensions_selectors_1 = require("./useChartDimensions.selectors");
var defaultizeMargin_1 = require("../../../defaultizeMargin");
var MAX_COMPUTE_RUN = 10;
var useChartDimensions = function (_a) {
    var params = _a.params, store = _a.store, instance = _a.instance;
    var svgRef = instance.svgRef;
    var hasInSize = params.width !== undefined && params.height !== undefined;
    var stateRef = React.useRef({ displayError: false, initialCompute: true, computeRun: 0 });
    // States only used for the initialization of the size.
    var _b = React.useState(0), innerWidth = _b[0], setInnerWidth = _b[1];
    var _c = React.useState(0), innerHeight = _c[0], setInnerHeight = _c[1];
    var computeSize = React.useCallback(function () {
        var _a, _b;
        var mainEl = svgRef === null || svgRef === void 0 ? void 0 : svgRef.current;
        if (!mainEl) {
            return {};
        }
        var win = (0, ownerWindow_1.default)(mainEl);
        var computedStyle = win.getComputedStyle(mainEl);
        var newHeight = Math.floor(parseFloat(computedStyle.height)) || 0;
        var newWidth = Math.floor(parseFloat(computedStyle.width)) || 0;
        if (store.state.dimensions.width !== newWidth || store.state.dimensions.height !== newHeight) {
            store.set('dimensions', {
                margin: {
                    top: params.margin.top,
                    right: params.margin.right,
                    bottom: params.margin.bottom,
                    left: params.margin.left,
                },
                width: (_a = params.width) !== null && _a !== void 0 ? _a : newWidth,
                height: (_b = params.height) !== null && _b !== void 0 ? _b : newHeight,
                propsWidth: params.width,
                propsHeight: params.height,
            });
        }
        return {
            height: newHeight,
            width: newWidth,
        };
    }, [
        store,
        svgRef,
        params.height,
        params.width,
        // Margin is an object, so we need to include all the properties to prevent infinite loops.
        params.margin.left,
        params.margin.right,
        params.margin.top,
        params.margin.bottom,
    ]);
    (0, useEffectAfterFirstRender_1.useEffectAfterFirstRender)(function () {
        var _a, _b;
        var width = (_a = params.width) !== null && _a !== void 0 ? _a : store.state.dimensions.width;
        var height = (_b = params.height) !== null && _b !== void 0 ? _b : store.state.dimensions.height;
        store.set('dimensions', {
            margin: {
                top: params.margin.top,
                right: params.margin.right,
                bottom: params.margin.bottom,
                left: params.margin.left,
            },
            width: width,
            height: height,
            propsHeight: params.height,
            propsWidth: params.width,
        });
    }, [
        store,
        params.height,
        params.width,
        // Margin is an object, so we need to include all the properties to prevent infinite loops.
        params.margin.left,
        params.margin.right,
        params.margin.top,
        params.margin.bottom,
    ]);
    React.useEffect(function () {
        // Ensure the error detection occurs after the first rendering.
        stateRef.current.displayError = true;
    }, []);
    // This effect is used to compute the size of the container on the initial render.
    // It is not bound to the raf loop to avoid an unwanted "resize" event.
    // https://github.com/mui/mui-x/issues/13477#issuecomment-2336634785
    (0, useEnhancedEffect_1.default)(function () {
        // computeRun is used to avoid infinite loops.
        if (hasInSize ||
            !stateRef.current.initialCompute ||
            stateRef.current.computeRun > MAX_COMPUTE_RUN) {
            return;
        }
        var computedSize = computeSize();
        if (computedSize.width !== innerWidth || computedSize.height !== innerHeight) {
            stateRef.current.computeRun += 1;
            if (computedSize.width !== undefined) {
                setInnerWidth(computedSize.width);
            }
            if (computedSize.height !== undefined) {
                setInnerHeight(computedSize.height);
            }
        }
        else if (stateRef.current.initialCompute) {
            stateRef.current.initialCompute = false;
        }
    }, [innerHeight, innerWidth, computeSize, hasInSize]);
    (0, useEnhancedEffect_1.default)(function () {
        if (hasInSize) {
            return function () { };
        }
        computeSize();
        var elementToObserve = svgRef.current;
        if (typeof ResizeObserver === 'undefined') {
            return function () { };
        }
        var animationFrame;
        var observer = new ResizeObserver(function () {
            // See https://github.com/mui/mui-x/issues/8733
            animationFrame = requestAnimationFrame(function () {
                computeSize();
            });
        });
        if (elementToObserve) {
            observer.observe(elementToObserve);
        }
        return function () {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
            if (elementToObserve) {
                observer.unobserve(elementToObserve);
            }
        };
    }, [computeSize, hasInSize, svgRef]);
    if (process.env.NODE_ENV !== 'production') {
        if (stateRef.current.displayError && params.width === undefined && innerWidth === 0) {
            console.error("MUI X Charts: ChartContainer does not have `width` prop, and its container has no `width` defined.");
            stateRef.current.displayError = false;
        }
        if (stateRef.current.displayError && params.height === undefined && innerHeight === 0) {
            console.error("MUI X Charts: ChartContainer does not have `height` prop, and its container has no `height` defined.");
            stateRef.current.displayError = false;
        }
    }
    var drawingArea = store.use(useChartDimensions_selectors_1.selectorChartDrawingArea);
    var isXInside = React.useCallback(function (x) { return x >= drawingArea.left - 1 && x <= drawingArea.left + drawingArea.width; }, [drawingArea.left, drawingArea.width]);
    var isYInside = React.useCallback(function (y) { return y >= drawingArea.top - 1 && y <= drawingArea.top + drawingArea.height; }, [drawingArea.height, drawingArea.top]);
    var isPointInside = React.useCallback(function (x, y, targetElement) {
        // For element allowed to overflow, wrapping them in <g data-drawing-container /> make them fully part of the drawing area.
        if (targetElement &&
            'closest' in targetElement &&
            targetElement.closest('[data-drawing-container]')) {
            return true;
        }
        return isXInside(x) && isYInside(y);
    }, [isXInside, isYInside]);
    return { instance: { isPointInside: isPointInside, isXInside: isXInside, isYInside: isYInside } };
};
exports.useChartDimensions = useChartDimensions;
exports.useChartDimensions.params = {
    width: true,
    height: true,
    margin: true,
};
exports.useChartDimensions.getDefaultizedParams = function (_a) {
    var params = _a.params;
    return (__assign(__assign({}, params), { margin: (0, defaultizeMargin_1.defaultizeMargin)(params.margin, constants_1.DEFAULT_MARGINS) }));
};
exports.useChartDimensions.getInitialState = function (_a) {
    var width = _a.width, height = _a.height, margin = _a.margin;
    return {
        dimensions: {
            margin: margin,
            width: width !== null && width !== void 0 ? width : 0,
            height: height !== null && height !== void 0 ? height : 0,
            propsWidth: width,
            propsHeight: height,
        },
    };
};
