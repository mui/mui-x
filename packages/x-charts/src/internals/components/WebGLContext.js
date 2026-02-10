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
exports.WebGLProvider = void 0;
exports.useWebGLContext = useWebGLContext;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var ReactDOM = require("react-dom");
var useForkRef_1 = require("@mui/utils/useForkRef");
var hooks_1 = require("../../hooks");
var useChartDimensions_1 = require("../plugins/corePlugins/useChartDimensions");
var useStore_1 = require("../store/useStore");
var WebGLContext = React.createContext(null);
function useWebGLContext() {
    return React.useContext(WebGLContext);
}
exports.WebGLProvider = React.forwardRef(function WebGLProvider(_a, ref) {
    var children = _a.children, props = __rest(_a, ["children"]);
    var canvasRef = React.useRef(null);
    var _b = React.useState(null), context = _b[0], setContext = _b[1];
    var handleRef = (0, useForkRef_1.default)(canvasRef, ref);
    var chartRoot = (0, hooks_1.useChartRootRef)().current;
    var drawingArea = (0, hooks_1.useDrawingArea)();
    var _c = React.useReducer(function (s) { return s + 1; }, 0), rerender = _c[1];
    React.useEffect(function () {
        /* The chart root isn't available on first render because the ref is only set after mounting the root component. */
        if (!chartRoot) {
            rerender();
        }
    }, [chartRoot]);
    React.useEffect(function () {
        var canvas = canvasRef.current;
        if (!canvas) {
            return undefined;
        }
        var handleContextLost = function (event) {
            // Must prevent default otherwise the context won't be marked as restorable
            // https://registry.khronos.org/webgl/extensions/WEBGL_lose_context/
            event.preventDefault();
            setContext(null);
        };
        var initializeContext = function () {
            var ctx = canvas.getContext('webgl2', {
                /* Fixes blurry lines when drawing sharp edges */
                antialias: false,
                /* Required so we can export the WebGL plot */
                preserveDrawingBuffer: true,
            });
            if (!ctx) {
                return;
            }
            setContext(ctx);
        };
        canvas.addEventListener('webglcontextlost', handleContextLost);
        canvas.addEventListener('webglcontextrestored', initializeContext);
        initializeContext();
        return function () {
            canvas.removeEventListener('webglcontextlost', handleContextLost);
            canvas.removeEventListener('webglcontextrestored', initializeContext);
        };
    }, [chartRoot]);
    if (!chartRoot) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(WebGLContext.Provider, { value: context, children: [ReactDOM.createPortal((0, jsx_runtime_1.jsx)(CanvasPositioner, { children: (0, jsx_runtime_1.jsx)("canvas", __assign({ ref: handleRef }, props, { style: {
                        position: 'relative',
                        left: drawingArea.left,
                        top: drawingArea.top,
                        width: drawingArea.width,
                        height: drawingArea.height,
                    } })) }), chartRoot), children] }));
});
function CanvasPositioner(_a) {
    var children = _a.children;
    var store = (0, useStore_1.useStore)();
    var svgWidth = store.use(useChartDimensions_1.selectorChartSvgWidth);
    var svgHeight = store.use(useChartDimensions_1.selectorChartSvgHeight);
    return ((0, jsx_runtime_1.jsx)("div", { style: {
            position: 'relative',
            pointerEvents: 'none',
            /* Ensures the canvas occupies the same space as the SVG */
            gridArea: 'chart',
            /* This property ensures the canvas renders below the SVG */
            order: -1,
            maxWidth: svgWidth,
            maxHeight: svgHeight,
            width: '100%',
            height: '100%',
        }, children: children }));
}
