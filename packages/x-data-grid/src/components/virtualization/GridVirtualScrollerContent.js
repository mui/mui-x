"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridVirtualScrollerContent = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var system_1 = require("@mui/system");
var composeClasses_1 = require("@mui/utils/composeClasses");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var gridClasses_1 = require("../../constants/gridClasses");
var useUtilityClasses = function (props, overflowedContent) {
    var classes = props.classes;
    var slots = {
        root: ['virtualScrollerContent', overflowedContent && 'virtualScrollerContent--overflowed'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
var VirtualScrollerContentRoot = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'VirtualScrollerContent',
    overridesResolver: function (props, styles) {
        var ownerState = props.ownerState;
        return [
            styles.virtualScrollerContent,
            ownerState.overflowedContent && styles['virtualScrollerContent--overflowed'],
        ];
    },
})({});
var GridVirtualScrollerContent = (0, forwardRef_1.forwardRef)(function GridVirtualScrollerContent(props, ref) {
    var _a;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var overflowedContent = !rootProps.autoHeight && ((_a = props.style) === null || _a === void 0 ? void 0 : _a.minHeight) === 'auto';
    var classes = useUtilityClasses(rootProps, overflowedContent);
    var ownerState = { classes: rootProps.classes, overflowedContent: overflowedContent };
    return (<VirtualScrollerContentRoot {...props} ownerState={ownerState} className={(0, clsx_1.default)(classes.root, props.className)} ref={ref}/>);
});
exports.GridVirtualScrollerContent = GridVirtualScrollerContent;
