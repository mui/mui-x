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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnHeaderMenuIcon = void 0;
var React = require("react");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var gridClasses_1 = require("../../constants/gridClasses");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes, open = ownerState.open;
    var slots = {
        root: ['menuIcon', open && 'menuOpen'],
        button: ['menuIconButton'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
exports.ColumnHeaderMenuIcon = React.memo(function (props) {
    var _a, _b, _c;
    var colDef = props.colDef, open = props.open, columnMenuId = props.columnMenuId, columnMenuButtonId = props.columnMenuButtonId, iconButtonRef = props.iconButtonRef;
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var ownerState = __assign(__assign({}, props), { classes: rootProps.classes });
    var classes = useUtilityClasses(ownerState);
    var handleMenuIconClick = React.useCallback(function (event) {
        event.preventDefault();
        event.stopPropagation();
        apiRef.current.toggleColumnMenu(colDef.field);
    }, [apiRef, colDef.field]);
    var columnName = (_a = colDef.headerName) !== null && _a !== void 0 ? _a : colDef.field;
    return (<div className={classes.root}>
      <rootProps.slots.baseTooltip title={apiRef.current.getLocaleText('columnMenuLabel')} enterDelay={1000} {...(_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseTooltip}>
        <rootProps.slots.baseIconButton ref={iconButtonRef} tabIndex={-1} className={classes.button} aria-label={apiRef.current.getLocaleText('columnMenuAriaLabel')(columnName)} size="small" onClick={handleMenuIconClick} aria-haspopup="menu" aria-expanded={open} aria-controls={open ? columnMenuId : undefined} id={columnMenuButtonId} {...(_c = rootProps.slotProps) === null || _c === void 0 ? void 0 : _c.baseIconButton}>
          <rootProps.slots.columnMenuIcon fontSize="inherit"/>
        </rootProps.slots.baseIconButton>
      </rootProps.slots.baseTooltip>
    </div>);
});
