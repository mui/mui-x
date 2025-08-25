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
exports.GridHeaderFilterMenu = GridHeaderFilterMenu;
var React = require("react");
var prop_types_1 = require("prop-types");
var capitalize_1 = require("@mui/utils/capitalize");
var HTMLElementType_1 = require("@mui/utils/HTMLElementType");
var x_data_grid_1 = require("@mui/x-data-grid");
function GridHeaderFilterMenu(_a) {
    var open = _a.open, field = _a.field, target = _a.target, applyFilterChanges = _a.applyFilterChanges, operators = _a.operators, item = _a.item, id = _a.id, labelledBy = _a.labelledBy, showClearItem = _a.showClearItem, clearFilterItem = _a.clearFilterItem;
    var apiRef = (0, x_data_grid_1.useGridApiContext)();
    var rootProps = (0, x_data_grid_1.useGridRootProps)();
    var hideMenu = React.useCallback(function () {
        apiRef.current.hideHeaderFilterMenu();
    }, [apiRef]);
    if (!target) {
        return null;
    }
    return (<x_data_grid_1.GridMenu position="bottom-end" open={open} target={target} onClose={hideMenu}>
      <rootProps.slots.baseMenuList aria-labelledby={labelledBy} id={id}>
        {showClearItem && [
            <rootProps.slots.baseMenuItem key="filter-menu-clear-filter" iconStart={<rootProps.slots.columnMenuClearIcon fontSize="small"/>} onClick={function () {
                    clearFilterItem();
                    hideMenu();
                }}>
            {apiRef.current.getLocaleText('headerFilterClear')}
          </rootProps.slots.baseMenuItem>,
            <rootProps.slots.baseDivider key="filter-menu-divider"/>,
        ]}
        {operators.map(function (op) {
            var _a;
            var selected = op.value === item.operator;
            var label = (_a = op === null || op === void 0 ? void 0 : op.headerLabel) !== null && _a !== void 0 ? _a : apiRef.current.getLocaleText("headerFilterOperator".concat((0, capitalize_1.default)(op.value)));
            return (<rootProps.slots.baseMenuItem key={"".concat(field, "-").concat(op.value)} iconStart={selected ? <rootProps.slots.menuItemCheckIcon fontSize="small"/> : <span />} onClick={function () {
                    applyFilterChanges(__assign(__assign({}, item), { operator: op.value }));
                    hideMenu();
                }} autoFocus={selected ? open : false}>
              {label}
            </rootProps.slots.baseMenuItem>);
        })}
      </rootProps.slots.baseMenuList>
    </x_data_grid_1.GridMenu>);
}
GridHeaderFilterMenu.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    applyFilterChanges: prop_types_1.default.func.isRequired,
    clearFilterItem: prop_types_1.default.func.isRequired,
    field: prop_types_1.default.string.isRequired,
    id: prop_types_1.default /* @typescript-to-proptypes-ignore */.string,
    item: prop_types_1.default.shape({
        field: prop_types_1.default.string.isRequired,
        id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
        operator: prop_types_1.default.string.isRequired,
        value: prop_types_1.default.any,
    }).isRequired,
    labelledBy: prop_types_1.default /* @typescript-to-proptypes-ignore */.string,
    open: prop_types_1.default.bool.isRequired,
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
    showClearItem: prop_types_1.default.bool.isRequired,
    target: HTMLElementType_1.default,
};
