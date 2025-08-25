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
exports.GridColumnHeaderTitle = GridColumnHeaderTitle;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var composeClasses_1 = require("@mui/utils/composeClasses");
var system_1 = require("@mui/system");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var domUtils_1 = require("../../utils/domUtils");
var gridClasses_1 = require("../../constants/gridClasses");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['columnHeaderTitle'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
var GridColumnHeaderTitleRoot = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'ColumnHeaderTitle',
})({
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontWeight: 'var(--unstable_DataGrid-headWeight)',
    lineHeight: 'normal',
});
var ColumnHeaderInnerTitle = (0, forwardRef_1.forwardRef)(function ColumnHeaderInnerTitle(props, ref) {
    // Tooltip adds aria-label to the props, which is not needed since the children prop is a string
    // See https://github.com/mui/mui-x/pull/14482
    var className = props.className, ariaLabel = props["aria-label"], other = __rest(props, ["className", 'aria-label']);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var classes = useUtilityClasses(rootProps);
    return (<GridColumnHeaderTitleRoot className={(0, clsx_1.default)(classes.root, className)} ownerState={rootProps} {...other} ref={ref}/>);
});
// No React.memo here as if we display the sort icon, we need to recalculate the isOver
function GridColumnHeaderTitle(props) {
    var _a;
    var label = props.label, description = props.description;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var titleRef = React.useRef(null);
    var _b = React.useState(''), tooltip = _b[0], setTooltip = _b[1];
    var handleMouseOver = React.useCallback(function () {
        if (!description && (titleRef === null || titleRef === void 0 ? void 0 : titleRef.current)) {
            var isOver = (0, domUtils_1.isOverflown)(titleRef.current);
            if (isOver) {
                setTooltip(label);
            }
            else {
                setTooltip('');
            }
        }
    }, [description, label]);
    return (<rootProps.slots.baseTooltip title={description || tooltip} {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseTooltip}>
      <ColumnHeaderInnerTitle onMouseOver={handleMouseOver} ref={titleRef}>
        {label}
      </ColumnHeaderInnerTitle>
    </rootProps.slots.baseTooltip>);
}
GridColumnHeaderTitle.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    columnWidth: prop_types_1.default.number.isRequired,
    description: prop_types_1.default.node,
    label: prop_types_1.default.string.isRequired,
};
