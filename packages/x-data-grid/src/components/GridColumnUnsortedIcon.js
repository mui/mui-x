"use strict";
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
var React = require("react");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
exports.GridColumnUnsortedIcon = React.memo(function GridColumnHeaderSortIcon(props) {
    var sortingOrder = props.sortingOrder, other = __rest(props, ["sortingOrder"]);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var nextSortDirection = sortingOrder[0];
    var Icon = nextSortDirection === 'asc'
        ? rootProps.slots.columnSortedAscendingIcon
        : rootProps.slots.columnSortedDescendingIcon;
    return Icon ? <Icon {...other}/> : null;
});
