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
exports.useGridProps = exports.propsStateInitializer = void 0;
var React = require("react");
var propsStateInitializer = function (state, props) {
    return __assign(__assign({}, state), { props: {
            listView: props.listView,
            getRowId: props.getRowId,
        } });
};
exports.propsStateInitializer = propsStateInitializer;
var useGridProps = function (apiRef, props) {
    React.useEffect(function () {
        apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { props: {
                listView: props.listView,
                getRowId: props.getRowId,
            } })); });
    }, [apiRef, props.listView, props.getRowId]);
};
exports.useGridProps = useGridProps;
