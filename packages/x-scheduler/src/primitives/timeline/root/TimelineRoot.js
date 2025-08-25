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
exports.TimelineRoot = void 0;
var React = require("react");
var store_1 = require("@base-ui-components/utils/store");
var useRefWithInit_1 = require("@base-ui-components/utils/useRefWithInit");
var useIsoLayoutEffect_1 = require("@base-ui-components/utils/useIsoLayoutEffect");
var useRenderElement_1 = require("../../../base-ui-copy/utils/useRenderElement");
var TimelineRootContext_1 = require("./TimelineRootContext");
exports.TimelineRoot = React.forwardRef(function TimelineRoot(componentProps, forwardedRef) {
    var 
    // Rendering props
    className = componentProps.className, render = componentProps.render, 
    // Internal props
    itemsProp = componentProps.items, 
    // Props forwarded to the DOM element
    elementProps = __rest(componentProps, ["className", "render", "items"]);
    var props = React.useMemo(function () { return ({ role: 'grid' }); }, []);
    var state = React.useMemo(function () { return ({}); }, []);
    var store = (0, useRefWithInit_1.useRefWithInit)(function () { return new store_1.Store({ items: itemsProp }); }).current;
    var contextValue = React.useMemo(function () { return ({ store: store }); }, [store]);
    (0, useIsoLayoutEffect_1.useIsoLayoutEffect)(function () {
        store.apply({ items: itemsProp });
    }, [store, itemsProp]);
    var element = (0, useRenderElement_1.useRenderElement)('div', componentProps, {
        state: state,
        ref: [forwardedRef],
        props: [props, elementProps],
    });
    return (<TimelineRootContext_1.TimelineRootContext.Provider value={contextValue}>{element}</TimelineRootContext_1.TimelineRootContext.Provider>);
});
