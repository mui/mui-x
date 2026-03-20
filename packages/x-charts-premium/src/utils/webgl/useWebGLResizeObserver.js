"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWebGLResizeObserver = useWebGLResizeObserver;
var React = require("react");
var ChartsWebGLLayer_1 = require("../../ChartsWebGLLayer/ChartsWebGLLayer");
function getDevicePixelContentBoxSize(entry) {
    // Safari does not support devicePixelContentBoxSize
    if (entry.devicePixelContentBoxSize) {
        return {
            width: entry.devicePixelContentBoxSize[0].inlineSize,
            height: entry.devicePixelContentBoxSize[0].blockSize,
        };
    }
    // These values not correct, but they're as close as you can get in Safari
    return {
        width: entry.contentBoxSize[0].inlineSize * devicePixelRatio,
        height: entry.contentBoxSize[0].blockSize * devicePixelRatio,
    };
}
/**
 * This hook calls the provided `onResize` callback whenever the WebGL canvas is resized.
 * It detects size changes when the element is resized, the browser zoom updates or the device pixel ratio changes.
 * These last two conditions aren't supported by Safari, so `onResize` won't be called in these cases on Safari.
 * @param onResize
 */
function useWebGLResizeObserver(onResize) {
    var gl = (0, ChartsWebGLLayer_1.useWebGLContext)();
    React.useEffect(function () {
        var canvas = gl === null || gl === void 0 ? void 0 : gl.canvas;
        if (!(canvas instanceof HTMLCanvasElement)) {
            return undefined;
        }
        var observer = new ResizeObserver(function (entries) {
            for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                var entry = entries_1[_i];
                var _a = getDevicePixelContentBoxSize(entry), width = _a.width, height = _a.height;
                canvas.width = Math.max(1, width);
                canvas.height = Math.max(1, height);
                // Update WebGL viewport
                gl === null || gl === void 0 ? void 0 : gl.viewport(0, 0, width, height);
                onResize();
            }
        });
        try {
            /* We use 'device-pixel-content-box' to observe the size of the canvas in device pixels, rather than CSS pixels.
             * This ensures that we correctly handle high-DPI displays and browser zoom.
             * However, this is not supported in Safari, which throws, so we fall back to 'content-box'.
             * WebKit Bug: https://www2.webkit.org/show_bug.cgi?id=219005 */
            observer.observe(canvas, { box: 'device-pixel-content-box' });
        }
        catch (_a) {
            observer.observe(canvas, { box: 'content-box' });
        }
        return function () {
            observer.disconnect();
        };
    }, [gl, gl === null || gl === void 0 ? void 0 : gl.canvas, onResize]);
}
