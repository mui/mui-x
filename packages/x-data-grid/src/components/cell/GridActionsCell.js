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
exports.renderActionsCell = void 0;
exports.GridActionsCell = GridActionsCell;
var React = require("react");
var prop_types_1 = require("prop-types");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var useId_1 = require("@mui/utils/useId");
var gridClasses_1 = require("../../constants/gridClasses");
var GridMenu_1 = require("../menu/GridMenu");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var hasActions = function (colDef) {
    return typeof colDef.getActions === 'function';
};
function GridActionsCell(props) {
    var _a;
    var api = props.api, colDef = props.colDef, id = props.id, hasFocus = props.hasFocus, isEditable = props.isEditable, field = props.field, value = props.value, formattedValue = props.formattedValue, row = props.row, rowNode = props.rowNode, cellMode = props.cellMode, tabIndex = props.tabIndex, _b = props.position, position = _b === void 0 ? 'bottom-end' : _b, focusElementRef = props.focusElementRef, other = __rest(props, ["api", "colDef", "id", "hasFocus", "isEditable", "field", "value", "formattedValue", "row", "rowNode", "cellMode", "tabIndex", "position", "focusElementRef"]);
    var _c = React.useState(-1), focusedButtonIndex = _c[0], setFocusedButtonIndex = _c[1];
    var _d = React.useState(false), open = _d[0], setOpen = _d[1];
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootRef = React.useRef(null);
    var buttonRef = React.useRef(null);
    var ignoreCallToFocus = React.useRef(false);
    var touchRippleRefs = React.useRef({});
    var isRtl = (0, RtlProvider_1.useRtl)();
    var menuId = (0, useId_1.default)();
    var buttonId = (0, useId_1.default)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    if (!hasActions(colDef)) {
        throw new Error('MUI X: Missing the `getActions` property in the `GridColDef`.');
    }
    var options = colDef.getActions(apiRef.current.getRowParams(id));
    var iconButtons = options.filter(function (option) { return !option.props.showInMenu; });
    var menuButtons = options.filter(function (option) { return option.props.showInMenu; });
    var numberOfButtons = iconButtons.length + (menuButtons.length ? 1 : 0);
    React.useLayoutEffect(function () {
        if (!hasFocus) {
            Object.entries(touchRippleRefs.current).forEach(function (_a) {
                var index = _a[0], ref = _a[1];
                ref === null || ref === void 0 ? void 0 : ref.stop({}, function () {
                    delete touchRippleRefs.current[index];
                });
            });
        }
    }, [hasFocus]);
    React.useEffect(function () {
        if (focusedButtonIndex < 0 || !rootRef.current) {
            return;
        }
        if (focusedButtonIndex >= rootRef.current.children.length) {
            return;
        }
        var child = rootRef.current.children[focusedButtonIndex];
        child.focus({ preventScroll: true });
    }, [focusedButtonIndex]);
    React.useEffect(function () {
        if (!hasFocus) {
            setFocusedButtonIndex(-1);
            ignoreCallToFocus.current = false;
        }
    }, [hasFocus]);
    React.useImperativeHandle(focusElementRef, function () { return ({
        focus: function () {
            // If ignoreCallToFocus is true, then one of the buttons was clicked and the focus is already set
            if (!ignoreCallToFocus.current) {
                // find the first focusable button and pass the index to the state
                var focusableButtonIndex = options.findIndex(function (o) { return !o.props.disabled; });
                setFocusedButtonIndex(focusableButtonIndex);
            }
        },
    }); }, [options]);
    React.useEffect(function () {
        if (focusedButtonIndex >= numberOfButtons) {
            setFocusedButtonIndex(numberOfButtons - 1);
        }
    }, [focusedButtonIndex, numberOfButtons]);
    var showMenu = function () {
        setOpen(true);
        setFocusedButtonIndex(numberOfButtons - 1);
        ignoreCallToFocus.current = true;
    };
    var hideMenu = function () {
        setOpen(false);
    };
    var toggleMenu = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (open) {
            hideMenu();
        }
        else {
            showMenu();
        }
    };
    var handleTouchRippleRef = function (index) { return function (instance) {
        touchRippleRefs.current[index] = instance;
    }; };
    var handleButtonClick = function (index, onClick) {
        return function (event) {
            setFocusedButtonIndex(index);
            ignoreCallToFocus.current = true;
            if (onClick) {
                onClick(event);
            }
        };
    };
    var handleRootKeyDown = function (event) {
        if (numberOfButtons <= 1) {
            return;
        }
        var getNewIndex = function (index, direction) {
            var _a;
            if (index < 0 || index > options.length) {
                return index;
            }
            // for rtl mode we need to reverse the direction
            var rtlMod = isRtl ? -1 : 1;
            var indexMod = (direction === 'left' ? -1 : 1) * rtlMod;
            // if the button that should receive focus is disabled go one more step
            return ((_a = options[index + indexMod]) === null || _a === void 0 ? void 0 : _a.props.disabled)
                ? getNewIndex(index + indexMod, direction)
                : index + indexMod;
        };
        var newIndex = focusedButtonIndex;
        if (event.key === 'ArrowRight') {
            newIndex = getNewIndex(focusedButtonIndex, 'right');
        }
        else if (event.key === 'ArrowLeft') {
            newIndex = getNewIndex(focusedButtonIndex, 'left');
        }
        if (newIndex < 0 || newIndex >= numberOfButtons) {
            return; // We're already in the first or last item = do nothing and let the grid listen the event
        }
        if (newIndex !== focusedButtonIndex) {
            event.preventDefault(); // Prevent scrolling
            event.stopPropagation(); // Don't stop propagation for other keys, for example ArrowUp
            setFocusedButtonIndex(newIndex);
        }
    };
    return (<div role="menu" ref={rootRef} tabIndex={-1} className={gridClasses_1.gridClasses.actionsCell} onKeyDown={handleRootKeyDown} {...other}>
      {iconButtons.map(function (button, index) {
            return React.cloneElement(button, {
                key: index,
                touchRippleRef: handleTouchRippleRef(index),
                onClick: handleButtonClick(index, button.props.onClick),
                tabIndex: focusedButtonIndex === index ? tabIndex : -1,
            });
        })}

      {menuButtons.length > 0 && buttonId && (<rootProps.slots.baseIconButton ref={buttonRef} id={buttonId} aria-label={apiRef.current.getLocaleText('actionsCellMore')} aria-haspopup="menu" aria-expanded={open} aria-controls={open ? menuId : undefined} role="menuitem" size="small" onClick={toggleMenu} touchRippleRef={handleTouchRippleRef(buttonId)} tabIndex={focusedButtonIndex === iconButtons.length ? tabIndex : -1} {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseIconButton}>
          <rootProps.slots.moreActionsIcon fontSize="small"/>
        </rootProps.slots.baseIconButton>)}

      {menuButtons.length > 0 && (<GridMenu_1.GridMenu open={open} target={buttonRef.current} position={position} onClose={hideMenu}>
          <rootProps.slots.baseMenuList id={menuId} className={gridClasses_1.gridClasses.menuList} aria-labelledby={buttonId} autoFocusItem>
            {menuButtons.map(function (button, index) {
                return React.cloneElement(button, { key: index, closeMenu: hideMenu });
            })}
          </rootProps.slots.baseMenuList>
        </GridMenu_1.GridMenu>)}
    </div>);
}
GridActionsCell.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    api: prop_types_1.default.object,
    /**
     * The mode of the cell.
     */
    cellMode: prop_types_1.default.oneOf(['edit', 'view']).isRequired,
    /**
     * The column of the row that the current cell belongs to.
     */
    colDef: prop_types_1.default.object.isRequired,
    /**
     * The column field of the cell that triggered the event.
     */
    field: prop_types_1.default.string.isRequired,
    /**
     * A ref allowing to set imperative focus.
     * It can be passed to the element that should receive focus.
     * @ignore - do not document.
     */
    focusElementRef: prop_types_1.default.oneOfType([
        prop_types_1.default.func,
        prop_types_1.default.shape({
            current: prop_types_1.default.shape({
                focus: prop_types_1.default.func.isRequired,
            }),
        }),
    ]),
    /**
     * The cell value formatted with the column valueFormatter.
     */
    formattedValue: prop_types_1.default.any,
    /**
     * If true, the cell is the active element.
     */
    hasFocus: prop_types_1.default.bool.isRequired,
    /**
     * The grid row id.
     */
    id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
    /**
     * If true, the cell is editable.
     */
    isEditable: prop_types_1.default.bool,
    position: prop_types_1.default.oneOf([
        'bottom-end',
        'bottom-start',
        'bottom',
        'left-end',
        'left-start',
        'left',
        'right-end',
        'right-start',
        'right',
        'top-end',
        'top-start',
        'top',
    ]),
    /**
     * The row model of the row that the current cell belongs to.
     */
    row: prop_types_1.default.any.isRequired,
    /**
     * The node of the row that the current cell belongs to.
     */
    rowNode: prop_types_1.default.object.isRequired,
    /**
     * the tabIndex value.
     */
    tabIndex: prop_types_1.default.oneOf([-1, 0]).isRequired,
    /**
     * The cell value.
     * If the column has `valueGetter`, use `params.row` to directly access the fields.
     */
    value: prop_types_1.default.any,
};
var renderActionsCell = function (params) { return <GridActionsCell {...params}/>; };
exports.renderActionsCell = renderActionsCell;
