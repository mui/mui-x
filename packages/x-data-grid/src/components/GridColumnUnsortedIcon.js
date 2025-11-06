"use strict";
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
exports.GridColumnUnsortedIcon = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
exports.GridColumnUnsortedIcon = React.memo(function GridColumnHeaderSortIcon(props) {
    var sortingOrder = props.sortingOrder, other = __rest(props, ["sortingOrder"]);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var nextSortDirection = sortingOrder[0];
    var Icon = nextSortDirection === 'asc'
        ? rootProps.slots.columnSortedAscendingIcon
        : rootProps.slots.columnSortedDescendingIcon;
    return Icon ? (0, jsx_runtime_1.jsx)(Icon, __assign({}, other)) : null;
});
