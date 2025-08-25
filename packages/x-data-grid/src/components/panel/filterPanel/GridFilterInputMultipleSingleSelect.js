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
exports.GridFilterInputMultipleSingleSelect = GridFilterInputMultipleSingleSelect;
var React = require("react");
var prop_types_1 = require("prop-types");
var useId_1 = require("@mui/utils/useId");
var useGridRootProps_1 = require("../../../hooks/utils/useGridRootProps");
var filterPanelUtils_1 = require("./filterPanelUtils");
function GridFilterInputMultipleSingleSelect(props) {
    var item = props.item, applyValue = props.applyValue, type = props.type, apiRef = props.apiRef, focusElementRef = props.focusElementRef, slotProps = props.slotProps, other = __rest(props, ["item", "applyValue", "type", "apiRef", "focusElementRef", "slotProps"]);
    var id = (0, useId_1.default)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var resolvedColumn = null;
    if (item.field) {
        var column = apiRef.current.getColumn(item.field);
        if ((0, filterPanelUtils_1.isSingleSelectColDef)(column)) {
            resolvedColumn = column;
        }
    }
    var getOptionValue = resolvedColumn === null || resolvedColumn === void 0 ? void 0 : resolvedColumn.getOptionValue;
    var getOptionLabel = resolvedColumn === null || resolvedColumn === void 0 ? void 0 : resolvedColumn.getOptionLabel;
    var isOptionEqualToValue = React.useCallback(function (option, value) { return getOptionValue(option) === getOptionValue(value); }, [getOptionValue]);
    var resolvedValueOptions = React.useMemo(function () {
        return (0, filterPanelUtils_1.getValueOptions)(resolvedColumn) || [];
    }, [resolvedColumn]);
    // The value is computed from the item.value and used directly
    // If it was done by a useEffect/useState, the Autocomplete could receive incoherent value and options
    var filteredValues = React.useMemo(function () {
        if (!Array.isArray(item.value)) {
            return [];
        }
        return item.value.reduce(function (acc, value) {
            var resolvedValue = resolvedValueOptions.find(function (v) { return getOptionValue(v) === value; });
            if (resolvedValue != null) {
                acc.push(resolvedValue);
            }
            return acc;
        }, []);
    }, [getOptionValue, item.value, resolvedValueOptions]);
    var handleChange = React.useCallback(function (event, value) {
        applyValue(__assign(__assign({}, item), { value: value.map(getOptionValue) }));
    }, [applyValue, item, getOptionValue]);
    var BaseAutocomplete = rootProps.slots.baseAutocomplete;
    return (<BaseAutocomplete multiple options={resolvedValueOptions} isOptionEqualToValue={isOptionEqualToValue} id={id} value={filteredValues} onChange={handleChange} getOptionLabel={getOptionLabel} label={apiRef.current.getLocaleText('filterPanelInputLabel')} placeholder={apiRef.current.getLocaleText('filterPanelInputPlaceholder')} slotProps={{
            textField: {
                type: type || 'text',
                inputRef: focusElementRef,
            },
        }} {...other} {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.root}/>);
}
GridFilterInputMultipleSingleSelect.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    apiRef: prop_types_1.default.shape({
        current: prop_types_1.default.object.isRequired,
    }).isRequired,
    applyValue: prop_types_1.default.func.isRequired,
    className: prop_types_1.default.string,
    clearButton: prop_types_1.default.node,
    disabled: prop_types_1.default.bool,
    focusElementRef: prop_types_1.default /* @typescript-to-proptypes-ignore */.oneOfType([
        prop_types_1.default.func,
        prop_types_1.default.object,
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
    /**
     * It is `true` if the filter either has a value or an operator with no value
     * required is selected (for example `isEmpty`)
     */
    isFilterActive: prop_types_1.default.bool,
    item: prop_types_1.default.shape({
        field: prop_types_1.default.string.isRequired,
        id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
        operator: prop_types_1.default.string.isRequired,
        value: prop_types_1.default.any,
    }).isRequired,
    onBlur: prop_types_1.default.func,
    onFocus: prop_types_1.default.func,
    slotProps: prop_types_1.default.object,
    tabIndex: prop_types_1.default.number,
    type: prop_types_1.default.oneOf(['singleSelect']),
};
