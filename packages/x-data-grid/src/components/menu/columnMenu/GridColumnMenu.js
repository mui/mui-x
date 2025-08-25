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
exports.GridGenericColumnMenu = exports.GridColumnMenu = exports.GRID_COLUMN_MENU_SLOT_PROPS = exports.GRID_COLUMN_MENU_SLOTS = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useGridColumnMenuSlots_1 = require("../../../hooks/features/columnMenu/useGridColumnMenuSlots");
var GridColumnMenuContainer_1 = require("./GridColumnMenuContainer");
var GridColumnMenuColumnsItem_1 = require("./menuItems/GridColumnMenuColumnsItem");
var GridColumnMenuFilterItem_1 = require("./menuItems/GridColumnMenuFilterItem");
var GridColumnMenuSortItem_1 = require("./menuItems/GridColumnMenuSortItem");
exports.GRID_COLUMN_MENU_SLOTS = {
    columnMenuSortItem: GridColumnMenuSortItem_1.GridColumnMenuSortItem,
    columnMenuFilterItem: GridColumnMenuFilterItem_1.GridColumnMenuFilterItem,
    columnMenuColumnsItem: GridColumnMenuColumnsItem_1.GridColumnMenuColumnsItem,
};
exports.GRID_COLUMN_MENU_SLOT_PROPS = {
    columnMenuSortItem: { displayOrder: 10 },
    columnMenuFilterItem: { displayOrder: 20 },
    columnMenuColumnsItem: { displayOrder: 30 },
};
var GridGenericColumnMenu = (0, forwardRef_1.forwardRef)(function GridGenericColumnMenu(props, ref) {
    var defaultSlots = props.defaultSlots, defaultSlotProps = props.defaultSlotProps, slots = props.slots, slotProps = props.slotProps, other = __rest(props, ["defaultSlots", "defaultSlotProps", "slots", "slotProps"]);
    var orderedSlots = (0, useGridColumnMenuSlots_1.useGridColumnMenuSlots)(__assign(__assign({}, other), { defaultSlots: defaultSlots, defaultSlotProps: defaultSlotProps, slots: slots, slotProps: slotProps }));
    return (<GridColumnMenuContainer_1.GridColumnMenuContainer {...other} ref={ref}>
        {orderedSlots.map(function (_a, index) {
            var Component = _a[0], otherProps = _a[1];
            return (<Component key={index} {...otherProps}/>);
        })}
      </GridColumnMenuContainer_1.GridColumnMenuContainer>);
});
exports.GridGenericColumnMenu = GridGenericColumnMenu;
GridGenericColumnMenu.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    colDef: prop_types_1.default.object.isRequired,
    /**
     * Initial `slotProps` - it is internal, to be overrriden by Pro or Premium packages
     * @ignore - do not document.
     */
    defaultSlotProps: prop_types_1.default.object.isRequired,
    /**
     * Initial `slots` - it is internal, to be overrriden by Pro or Premium packages
     * @ignore - do not document.
     */
    defaultSlots: prop_types_1.default.object.isRequired,
    hideMenu: prop_types_1.default.func.isRequired,
    id: prop_types_1.default.string,
    labelledby: prop_types_1.default.string,
    open: prop_types_1.default.bool.isRequired,
    /**
     * Could be used to pass new props or override props specific to a column menu component
     * e.g. `displayOrder`
     */
    slotProps: prop_types_1.default.object,
    /**
     * `slots` could be used to add new and (or) override default column menu items
     * If you register a nee component you must pass it's `displayOrder` in `slotProps`
     * or it will be placed in the end of the list
     */
    slots: prop_types_1.default.object,
};
var GridColumnMenu = (0, forwardRef_1.forwardRef)(function GridColumnMenu(props, ref) {
    return (<GridGenericColumnMenu {...props} ref={ref} defaultSlots={exports.GRID_COLUMN_MENU_SLOTS} defaultSlotProps={exports.GRID_COLUMN_MENU_SLOT_PROPS}/>);
});
exports.GridColumnMenu = GridColumnMenu;
GridColumnMenu.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    colDef: prop_types_1.default.object.isRequired,
    hideMenu: prop_types_1.default.func.isRequired,
    id: prop_types_1.default.string,
    labelledby: prop_types_1.default.string,
    open: prop_types_1.default.bool.isRequired,
    /**
     * Could be used to pass new props or override props specific to a column menu component
     * e.g. `displayOrder`
     */
    slotProps: prop_types_1.default.object,
    /**
     * `slots` could be used to add new and (or) override default column menu items
     * If you register a nee component you must pass it's `displayOrder` in `slotProps`
     * or it will be placed in the end of the list
     */
    slots: prop_types_1.default.object,
};
