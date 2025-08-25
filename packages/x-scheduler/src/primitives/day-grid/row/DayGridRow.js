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
exports.DayGridRow = void 0;
var React = require("react");
var useRenderElement_1 = require("../../../base-ui-copy/utils/useRenderElement");
exports.DayGridRow = React.forwardRef(function DayGridRow(componentProps, forwardedRef) {
    var 
    // Rendering props
    className = componentProps.className, render = componentProps.render, 
    // Props forwarded to the DOM element
    elementProps = __rest(componentProps, ["className", "render"]);
    var props = React.useMemo(function () { return ({ role: 'row' }); }, []);
    var state = React.useMemo(function () { return ({}); }, []);
    return (0, useRenderElement_1.useRenderElement)('div', componentProps, {
        state: state,
        ref: [forwardedRef],
        props: [props, elementProps],
    });
});
