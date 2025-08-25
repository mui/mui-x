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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridFilterInputMultipleValue = GridFilterInputMultipleValue;
var React = require("react");
var prop_types_1 = require("prop-types");
var useId_1 = require("@mui/utils/useId");
var useGridRootProps_1 = require("../../../hooks/utils/useGridRootProps");
function GridFilterInputMultipleValue(props) {
    var item = props.item, applyValue = props.applyValue, type = props.type, apiRef = props.apiRef, focusElementRef = props.focusElementRef, slotProps = props.slotProps;
    var id = (0, useId_1.default)();
    var _a = React.useState([]), options = _a[0], setOptions = _a[1];
    var _b = React.useState(item.value || []), filterValueState = _b[0], setFilterValueState = _b[1];
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    React.useEffect(function () {
        var _a;
        var itemValue = (_a = item.value) !== null && _a !== void 0 ? _a : [];
        setFilterValueState(itemValue.map(String));
    }, [item.value]);
    var handleChange = React.useCallback(function (event, value) {
        setFilterValueState(value.map(String));
        applyValue(__assign(__assign({}, item), { value: __spreadArray([], value.map(function (filterItemValue) {
                return type === 'number' ? Number(filterItemValue) : filterItemValue;
            }), true) }));
    }, [applyValue, item, type]);
    var handleInputChange = React.useCallback(function (event, value) {
        if (value === '') {
            setOptions([]);
        }
        else {
            setOptions([value]);
        }
    }, [setOptions]);
    var BaseAutocomplete = rootProps.slots.baseAutocomplete;
    return (<BaseAutocomplete multiple freeSolo options={options} id={id} value={filterValueState} onChange={handleChange} onInputChange={handleInputChange} label={apiRef.current.getLocaleText('filterPanelInputLabel')} placeholder={apiRef.current.getLocaleText('filterPanelInputPlaceholder')} slotProps={{
            textField: {
                type: type || 'text',
                inputRef: focusElementRef,
            },
        }} {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.root}/>);
}
GridFilterInputMultipleValue.propTypes = {
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
