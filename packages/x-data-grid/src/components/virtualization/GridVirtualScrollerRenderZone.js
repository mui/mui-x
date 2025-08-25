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
exports.GridVirtualScrollerRenderZone = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var system_1 = require("@mui/system");
var composeClasses_1 = require("@mui/utils/composeClasses");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useGridPrivateApiContext_1 = require("../../hooks/utils/useGridPrivateApiContext");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var gridClasses_1 = require("../../constants/gridClasses");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['virtualScrollerRenderZone'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
var VirtualScrollerRenderZoneRoot = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'VirtualScrollerRenderZone',
})({
    position: 'absolute',
    display: 'flex', // Prevents margin collapsing when using `getRowSpacing`
    flexDirection: 'column',
});
var GridVirtualScrollerRenderZone = (0, forwardRef_1.forwardRef)(function GridVirtualScrollerRenderZone(props, ref) {
    var className = props.className, other = __rest(props, ["className"]);
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var classes = useUtilityClasses(rootProps);
    var offsetTop = apiRef.current.virtualizer.api.useVirtualization().getters.getOffsetTop();
    return (<VirtualScrollerRenderZoneRoot className={(0, clsx_1.default)(classes.root, className)} ownerState={rootProps} style={{
            transform: "translate3d(0, ".concat(offsetTop, "px, 0)"),
        }} {...other} ref={ref}/>);
});
exports.GridVirtualScrollerRenderZone = GridVirtualScrollerRenderZone;
