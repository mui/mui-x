"use strict";
'use client';
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
exports.GridFilterInputDate = GridFilterInputDate;
var React = require("react");
var prop_types_1 = require("prop-types");
var useId_1 = require("@mui/utils/useId");
var useTimeout_1 = require("../../../hooks/utils/useTimeout");
var useGridRootProps_1 = require("../../../hooks/utils/useGridRootProps");
function convertFilterItemValueToInputValue(itemValue, inputType) {
    if (itemValue == null) {
        return '';
    }
    var dateCopy = new Date(itemValue);
    if (Number.isNaN(dateCopy.getTime())) {
        return '';
    }
    if (inputType === 'date') {
        return dateCopy.toISOString().substring(0, 10);
    }
    if (inputType === 'datetime-local') {
        // The date picker expects the date to be in the local timezone.
        // But .toISOString() converts it to UTC with zero offset.
        // So we need to subtract the timezone offset.
        dateCopy.setMinutes(dateCopy.getMinutes() - dateCopy.getTimezoneOffset());
        return dateCopy.toISOString().substring(0, 19);
    }
    return dateCopy.toISOString().substring(0, 10);
}
function GridFilterInputDate(props) {
    var _a;
    var item = props.item, applyValue = props.applyValue, type = props.type, apiRef = props.apiRef, focusElementRef = props.focusElementRef, slotProps = props.slotProps, isFilterActive = props.isFilterActive, headerFilterMenu = props.headerFilterMenu, clearButton = props.clearButton, tabIndex = props.tabIndex, disabled = props.disabled, other = __rest(props, ["item", "applyValue", "type", "apiRef", "focusElementRef", "slotProps", "isFilterActive", "headerFilterMenu", "clearButton", "tabIndex", "disabled"]);
    var rootSlotProps = slotProps === null || slotProps === void 0 ? void 0 : slotProps.root.slotProps;
    var filterTimeout = (0, useTimeout_1.useTimeout)();
    var _b = React.useState(function () {
        return convertFilterItemValueToInputValue(item.value, type);
    }), filterValueState = _b[0], setFilterValueState = _b[1];
    var _c = React.useState(false), applying = _c[0], setIsApplying = _c[1];
    var id = (0, useId_1.default)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var onFilterChange = React.useCallback(function (event) {
        filterTimeout.clear();
        var value = event.target.value;
        setFilterValueState(value);
        setIsApplying(true);
        filterTimeout.start(rootProps.filterDebounceMs, function () {
            var date = new Date(value);
            applyValue(__assign(__assign({}, item), { value: Number.isNaN(date.getTime()) ? undefined : date }));
            setIsApplying(false);
        });
    }, [applyValue, item, rootProps.filterDebounceMs, filterTimeout]);
    React.useEffect(function () {
        var value = convertFilterItemValueToInputValue(item.value, type);
        setFilterValueState(value);
    }, [item.value, type]);
    return (<React.Fragment>
      <rootProps.slots.baseTextField fullWidth id={id} label={apiRef.current.getLocaleText('filterPanelInputLabel')} placeholder={apiRef.current.getLocaleText('filterPanelInputPlaceholder')} value={filterValueState} onChange={onFilterChange} type={type || 'text'} disabled={disabled} inputRef={focusElementRef} slotProps={__assign(__assign({}, rootSlotProps), { input: __assign({ endAdornment: applying ? (<rootProps.slots.loadIcon fontSize="small" color="action"/>) : null }, rootSlotProps === null || rootSlotProps === void 0 ? void 0 : rootSlotProps.input), htmlInput: __assign({ max: type === 'datetime-local' ? '9999-12-31T23:59' : '9999-12-31', tabIndex: tabIndex }, rootSlotProps === null || rootSlotProps === void 0 ? void 0 : rootSlotProps.htmlInput) })} {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseTextField} {...other} {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.root}/>
      {headerFilterMenu}
      {clearButton}
    </React.Fragment>);
}
GridFilterInputDate.propTypes = {
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
    type: prop_types_1.default.oneOf(['date', 'datetime-local']),
};
