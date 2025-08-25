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
exports.GridColumnSortButton = GridColumnSortButton;
var React = require("react");
var prop_types_1 = require("prop-types");
var composeClasses_1 = require("@mui/utils/composeClasses");
var system_1 = require("@mui/system");
var clsx_1 = require("clsx");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var gridClasses_1 = require("../constants/gridClasses");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var cssVariables_1 = require("../constants/cssVariables");
var assert_1 = require("../utils/assert");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['sortButton'],
        icon: ['sortIcon'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
var GridColumnSortButtonRoot = (0, system_1.styled)((assert_1.NotRendered), {
    name: 'MuiDataGrid',
    slot: 'SortButton',
})({
    transition: cssVariables_1.vars.transition(['opacity'], {
        duration: cssVariables_1.vars.transitions.duration.short,
        easing: cssVariables_1.vars.transitions.easing.easeInOut,
    }),
});
function getIcon(icons, direction, className, sortingOrder) {
    var Icon;
    var iconProps = {};
    if (direction === 'asc') {
        Icon = icons.columnSortedAscendingIcon;
    }
    else if (direction === 'desc') {
        Icon = icons.columnSortedDescendingIcon;
    }
    else {
        Icon = icons.columnUnsortedIcon;
        iconProps.sortingOrder = sortingOrder;
    }
    return Icon ? <Icon fontSize="small" className={className} {...iconProps}/> : null;
}
function GridColumnSortButton(props) {
    var _a;
    var direction = props.direction, index = props.index, sortingOrder = props.sortingOrder, disabled = props.disabled, className = props.className, other = __rest(props, ["direction", "index", "sortingOrder", "disabled", "className"]);
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var ownerState = __assign(__assign({}, props), { classes: rootProps.classes });
    var classes = useUtilityClasses(ownerState);
    var iconElement = getIcon(rootProps.slots, direction, classes.icon, sortingOrder);
    if (!iconElement) {
        return null;
    }
    var iconButton = (<GridColumnSortButtonRoot as={rootProps.slots.baseIconButton} ownerState={ownerState} aria-label={apiRef.current.getLocaleText('columnHeaderSortIconLabel')} title={apiRef.current.getLocaleText('columnHeaderSortIconLabel')} size="small" disabled={disabled} className={(0, clsx_1.default)(classes.root, className)} {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseIconButton} {...other}>
      {iconElement}
    </GridColumnSortButtonRoot>);
    return (<React.Fragment>
      {index != null && (<rootProps.slots.baseBadge badgeContent={index} color="default" overlap="circular">
          {iconButton}
        </rootProps.slots.baseBadge>)}

      {index == null && iconButton}
    </React.Fragment>);
}
GridColumnSortButton.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    direction: prop_types_1.default.oneOf(['asc', 'desc']),
    disabled: prop_types_1.default.bool,
    field: prop_types_1.default.string.isRequired,
    index: prop_types_1.default.number,
    onClick: prop_types_1.default.func,
    sortingOrder: prop_types_1.default.arrayOf(prop_types_1.default.oneOf(['asc', 'desc'])).isRequired,
};
