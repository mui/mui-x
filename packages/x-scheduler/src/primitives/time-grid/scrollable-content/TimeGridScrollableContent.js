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
exports.TimeGridScrollableContent = void 0;
var React = require("react");
var element_1 = require("@atlaskit/pragmatic-drag-and-drop-auto-scroll/element");
var useRenderElement_1 = require("../../../base-ui-copy/utils/useRenderElement");
exports.TimeGridScrollableContent = React.forwardRef(function TimeGridScrollableContent(componentProps, forwardedRef) {
    var 
    // Rendering props
    className = componentProps.className, render = componentProps.render, 
    // Props forwarded to the DOM element
    elementProps = __rest(componentProps, ["className", "render"]);
    var ref = React.useRef(null);
    React.useEffect(function () {
        // TODO: Try to add the behavior back in the test
        // For now, it causes the following error in JSDOM:
        // "Auto scrolling has been attached to an element that appears not to be scrollable"
        if (!ref.current || process.env.NODE_ENV === 'test') {
            return function () { };
        }
        return (0, element_1.autoScrollForElements)({
            element: ref.current,
        });
    });
    return (0, useRenderElement_1.useRenderElement)('div', componentProps, {
        ref: [forwardedRef, ref],
        props: [elementProps],
    });
});
