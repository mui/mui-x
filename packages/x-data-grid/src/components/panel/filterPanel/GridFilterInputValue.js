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
exports.GridFilterInputValue = GridFilterInputValue;
var React = require("react");
var prop_types_1 = require("prop-types");
var useId_1 = require("@mui/utils/useId");
var useTimeout_1 = require("../../../hooks/utils/useTimeout");
var useGridRootProps_1 = require("../../../hooks/utils/useGridRootProps");
function GridFilterInputValue(props) {
    var _a, _b, _c;
    var item = props.item, applyValue = props.applyValue, type = props.type, apiRef = props.apiRef, focusElementRef = props.focusElementRef, tabIndex = props.tabIndex, disabled = props.disabled, isFilterActive = props.isFilterActive, slotProps = props.slotProps, clearButton = props.clearButton, headerFilterMenu = props.headerFilterMenu, others = __rest(props, ["item", "applyValue", "type", "apiRef", "focusElementRef", "tabIndex", "disabled", "isFilterActive", "slotProps", "clearButton", "headerFilterMenu"]);
    var textFieldProps = slotProps === null || slotProps === void 0 ? void 0 : slotProps.root;
    var filterTimeout = (0, useTimeout_1.useTimeout)();
    var _d = React.useState(sanitizeFilterItemValue(item.value)), filterValueState = _d[0], setFilterValueState = _d[1];
    var _e = React.useState(false), applying = _e[0], setIsApplying = _e[1];
    var id = (0, useId_1.default)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var onFilterChange = React.useCallback(function (event) {
        var value = sanitizeFilterItemValue(event.target.value);
        setFilterValueState(value);
        setIsApplying(true);
        filterTimeout.start(rootProps.filterDebounceMs, function () {
            var newItem = __assign(__assign({}, item), { value: type === 'number' && !Number.isNaN(Number(value)) ? Number(value) : value, fromInput: id });
            applyValue(newItem);
            setIsApplying(false);
        });
    }, [filterTimeout, rootProps.filterDebounceMs, item, type, id, applyValue]);
    React.useEffect(function () {
        var itemPlusTag = item;
        if (itemPlusTag.fromInput !== id || item.value == null) {
            setFilterValueState(sanitizeFilterItemValue(item.value));
        }
    }, [id, item]);
    return (<React.Fragment>
      <rootProps.slots.baseTextField id={id} label={apiRef.current.getLocaleText('filterPanelInputLabel')} placeholder={apiRef.current.getLocaleText('filterPanelInputPlaceholder')} value={filterValueState !== null && filterValueState !== void 0 ? filterValueState : ''} onChange={onFilterChange} type={type || 'text'} disabled={disabled} slotProps={__assign(__assign({}, textFieldProps === null || textFieldProps === void 0 ? void 0 : textFieldProps.slotProps), { input: __assign({ endAdornment: applying ? (<rootProps.slots.loadIcon fontSize="small" color="action"/>) : null }, (_a = textFieldProps === null || textFieldProps === void 0 ? void 0 : textFieldProps.slotProps) === null || _a === void 0 ? void 0 : _a.input), htmlInput: __assign({ tabIndex: tabIndex }, (_b = textFieldProps === null || textFieldProps === void 0 ? void 0 : textFieldProps.slotProps) === null || _b === void 0 ? void 0 : _b.htmlInput) })} inputRef={focusElementRef} {...(_c = rootProps.slotProps) === null || _c === void 0 ? void 0 : _c.baseTextField} {...others} {...textFieldProps}/>
      {headerFilterMenu}
      {clearButton}
    </React.Fragment>);
}
function sanitizeFilterItemValue(value) {
    if (value == null || value === '') {
        return undefined;
    }
    return String(value);
}
GridFilterInputValue.propTypes = {
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
    type: prop_types_1.default.oneOf(['date', 'datetime-local', 'number', 'text']),
};
