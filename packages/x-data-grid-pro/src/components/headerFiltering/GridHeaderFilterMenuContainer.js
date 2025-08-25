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
exports.GridHeaderFilterMenuContainer = GridHeaderFilterMenuContainer;
var React = require("react");
var prop_types_1 = require("prop-types");
var x_data_grid_1 = require("@mui/x-data-grid");
var refType_1 = require("@mui/utils/refType");
var useId_1 = require("@mui/utils/useId");
var internals_1 = require("@mui/x-data-grid/internals");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
function GridHeaderFilterMenuContainer(props) {
    var _a;
    var operators = props.operators, item = props.item, field = props.field, buttonRef = props.buttonRef, headerFilterMenuRef = props.headerFilterMenuRef, _b = props.disabled, disabled = _b === void 0 ? false : _b, showClearItem = props.showClearItem, clearFilterItem = props.clearFilterItem, others = __rest(props, ["operators", "item", "field", "buttonRef", "headerFilterMenuRef", "disabled", "showClearItem", "clearFilterItem"]);
    var buttonId = (0, useId_1.default)();
    var menuId = (0, useId_1.default)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var apiRef = (0, x_data_grid_1.useGridApiContext)();
    var menuOpenField = (0, x_data_grid_1.useGridSelector)(apiRef, internals_1.gridHeaderFilteringMenuSelector);
    var open = Boolean(menuOpenField === field && headerFilterMenuRef.current);
    var handleClick = function (event) {
        headerFilterMenuRef.current = event.currentTarget;
        apiRef.current.showHeaderFilterMenu(field);
    };
    if (!rootProps.slots.headerFilterMenu) {
        return null;
    }
    var label = apiRef.current.getLocaleText('filterPanelOperator');
    var labelString = label ? String(label) : undefined;
    return (<React.Fragment>
      <rootProps.slots.baseIconButton id={buttonId} ref={buttonRef} aria-label={labelString} title={labelString} aria-controls={menuId} aria-expanded={open ? 'true' : undefined} aria-haspopup="true" tabIndex={-1} size="small" onClick={handleClick} disabled={disabled} {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseIconButton}>
        <rootProps.slots.baseBadge color="primary" variant="dot" badgeContent={showClearItem ? 1 : 0}>
          <rootProps.slots.openFilterButtonIcon fontSize="inherit"/>
        </rootProps.slots.baseBadge>
      </rootProps.slots.baseIconButton>
      <rootProps.slots.headerFilterMenu field={field} open={open} item={item} target={headerFilterMenuRef.current} operators={operators} labelledBy={buttonId} id={menuId} clearFilterItem={clearFilterItem} showClearItem={showClearItem} {...others}/>
    </React.Fragment>);
}
GridHeaderFilterMenuContainer.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    applyFilterChanges: prop_types_1.default.func.isRequired,
    buttonRef: refType_1.default,
    clearFilterItem: prop_types_1.default.func,
    disabled: prop_types_1.default.bool,
    field: prop_types_1.default.string.isRequired,
    headerFilterMenuRef: prop_types_1.default.shape({
        current: prop_types_1.default.object,
    }).isRequired,
    item: prop_types_1.default.shape({
        field: prop_types_1.default.string.isRequired,
        id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
        operator: prop_types_1.default.string.isRequired,
        value: prop_types_1.default.any,
    }).isRequired,
    operators: prop_types_1.default.arrayOf(prop_types_1.default.shape({
        getApplyFilterFn: prop_types_1.default.func.isRequired,
        getValueAsString: prop_types_1.default.func,
        headerLabel: prop_types_1.default.string,
        InputComponent: prop_types_1.default.elementType,
        InputComponentProps: prop_types_1.default.shape({
            apiRef: prop_types_1.default.shape({
                current: prop_types_1.default.object.isRequired,
            }),
            applyValue: prop_types_1.default.func,
            className: prop_types_1.default.string,
            clearButton: prop_types_1.default.node,
            disabled: prop_types_1.default.bool,
            focusElementRef: prop_types_1.default.oneOfType([
                prop_types_1.default.func,
                prop_types_1.default.shape({
                    current: prop_types_1.default.any.isRequired,
                }),
            ]),
            headerFilterMenu: prop_types_1.default.node,
            inputRef: prop_types_1.default.oneOfType([
                prop_types_1.default.func,
                prop_types_1.default.shape({
                    current: function (props, propName) {
                        if (props[propName] == null) {
                            return null;
                        }
                        if (typeof props[propName] !== 'object' || props[propName].nodeType !== 1) {
                            return new Error("Expected prop '".concat(propName, "' to be of type Element"));
                        }
                        return null;
                    },
                }),
            ]),
            isFilterActive: prop_types_1.default.bool,
            item: prop_types_1.default.shape({
                field: prop_types_1.default.string.isRequired,
                id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
                operator: prop_types_1.default.string.isRequired,
                value: prop_types_1.default.any,
            }),
            onBlur: prop_types_1.default.func,
            onFocus: prop_types_1.default.func,
            slotProps: prop_types_1.default.object,
            tabIndex: prop_types_1.default.number,
        }),
        label: prop_types_1.default.string,
        requiresFilterValue: prop_types_1.default.bool,
        value: prop_types_1.default.string.isRequired,
    })).isRequired,
    showClearItem: prop_types_1.default.bool,
};
