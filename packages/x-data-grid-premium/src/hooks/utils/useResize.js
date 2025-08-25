"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useResize = void 0;
var React = require("react");
var useResize = function (options) {
    var resizeHandleRef = React.useRef(null);
    var optionsRef = React.useRef(options);
    React.useEffect(function () {
        optionsRef.current = options;
    }, [options]);
    React.useEffect(function () {
        var handle = resizeHandleRef.current;
        if (!handle) {
            return undefined;
        }
        var _a = optionsRef.current, onSizeChange = _a.onSizeChange, getInitialSize = _a.getInitialSize, _b = _a.direction, direction = _b === void 0 ? 'horizontal' : _b;
        var startPosition = null;
        var startSize = null;
        var handlePointerMove = function (event) {
            event.preventDefault();
            if (startPosition === null || startSize === null) {
                return;
            }
            var delta = direction === 'horizontal' ? startPosition - event.clientX : startPosition - event.clientY;
            var newSize = startSize + delta;
            onSizeChange(newSize, handle);
        };
        var handlePointerUp = function (event) {
            startPosition = null;
            startSize = null;
            handle.removeEventListener('pointermove', handlePointerMove);
            handle.releasePointerCapture(event.pointerId);
        };
        var handlePointerDown = function (event) {
            startPosition = direction === 'horizontal' ? event.clientX : event.clientY;
            startSize = getInitialSize(handle);
            handle.addEventListener('pointermove', handlePointerMove);
            handle.setPointerCapture(event.pointerId);
        };
        handle.addEventListener('pointerdown', handlePointerDown);
        handle.addEventListener('pointerup', handlePointerUp);
        return function () {
            handle.removeEventListener('pointerdown', handlePointerDown);
            handle.removeEventListener('pointerup', handlePointerUp);
            handle.removeEventListener('pointermove', handlePointerMove);
        };
    }, []);
    return {
        ref: resizeHandleRef,
    };
};
exports.useResize = useResize;
