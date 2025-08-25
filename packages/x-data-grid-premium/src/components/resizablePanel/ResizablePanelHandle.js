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
exports.ResizablePanelHandle = ResizablePanelHandle;
var React = require("react");
var system_1 = require("@mui/system");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var composeClasses_1 = require("@mui/utils/composeClasses");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var clsx_1 = require("clsx");
var useResize_1 = require("../../hooks/utils/useResize");
var ResizablePanelContext_1 = require("./ResizablePanelContext");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes, direction = ownerState.direction;
    var slots = {
        root: ['resizablePanelHandle', "resizablePanelHandle--".concat(direction)],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_pro_1.getDataGridUtilityClass, classes);
};
var ResizablePanelHandleRoot = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'ResizablePanelHandle',
    overridesResolver: function (props, styles) {
        var _a, _b;
        return [
            (_a = {},
                _a["&.".concat(x_data_grid_pro_1.gridClasses['resizablePanelHandle--horizontal'])] = styles['resizablePanelHandle--horizontal'],
                _a),
            (_b = {},
                _b["&.".concat(x_data_grid_pro_1.gridClasses['resizablePanelHandle--vertical'])] = styles['resizablePanelHandle--vertical'],
                _b),
            styles.resizablePanelHandle,
        ];
    },
})({
    position: 'absolute',
    zIndex: 3,
    top: 0,
    left: 0,
    userSelect: 'none',
    transition: internals_1.vars.transition(['border-color'], {
        duration: internals_1.vars.transitions.duration.short,
        easing: internals_1.vars.transitions.easing.easeInOut,
    }),
    '&:hover': {
        borderWidth: 2,
        borderColor: internals_1.vars.colors.interactive.selected,
    },
    variants: [
        {
            props: { direction: 'horizontal' },
            style: {
                height: '100%',
                width: 8,
                cursor: 'ew-resize',
                borderLeft: "1px solid ".concat(internals_1.vars.colors.border.base),
                touchAction: 'pan-x',
            },
        },
        {
            props: { direction: 'vertical' },
            style: {
                width: '100%',
                height: 8,
                cursor: 'ns-resize',
                borderTop: "1px solid ".concat(internals_1.vars.colors.border.base),
                touchAction: 'pan-y',
            },
        },
    ],
});
function ResizablePanelHandle(props) {
    var className = props.className, children = props.children, other = __rest(props, ["className", "children"]);
    var _a = (0, ResizablePanelContext_1.useResizablePanelContext)(), rootRef = _a.rootRef, direction = _a.direction;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var ownerState = {
        classes: rootProps.classes,
        direction: direction,
    };
    var classes = useUtilityClasses(ownerState);
    var ref = (0, useResize_1.useResize)({
        direction: direction,
        getInitialSize: function () {
            return direction === 'horizontal'
                ? rootRef.current.offsetWidth
                : rootRef.current.offsetHeight;
        },
        onSizeChange: function (newSize) {
            if (direction === 'horizontal') {
                rootRef.current.style.width = "".concat(newSize, "px");
            }
            else {
                rootRef.current.style.height = "".concat(newSize, "px");
            }
        },
    }).ref;
    return (<ResizablePanelHandleRoot className={(0, clsx_1.default)(classes.root, className)} ownerState={ownerState} direction={direction} {...other} ref={ref}/>);
}
