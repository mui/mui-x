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
exports.sanitizeFilterItemValue = sanitizeFilterItemValue;
exports.GridFilterInputBoolean = GridFilterInputBoolean;
var React = require("react");
var prop_types_1 = require("prop-types");
var refType_1 = require("@mui/utils/refType");
var useId_1 = require("@mui/utils/useId");
var useGridRootProps_1 = require("../../../hooks/utils/useGridRootProps");
function GridFilterInputBoolean(props) {
    var _a, _b, _c, _d;
    var item = props.item, applyValue = props.applyValue, apiRef = props.apiRef, focusElementRef = props.focusElementRef, isFilterActive = props.isFilterActive, headerFilterMenu = props.headerFilterMenu, clearButton = props.clearButton, tabIndex = props.tabIndex, slotProps = props.slotProps, others = __rest(props, ["item", "applyValue", "apiRef", "focusElementRef", "isFilterActive", "headerFilterMenu", "clearButton", "tabIndex", "slotProps"]);
    var _e = React.useState(sanitizeFilterItemValue(item.value)), filterValueState = _e[0], setFilterValueState = _e[1];
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var labelId = (0, useId_1.default)();
    var selectId = (0, useId_1.default)();
    var baseSelectProps = ((_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseSelect) || {};
    var isSelectNative = (_b = baseSelectProps.native) !== null && _b !== void 0 ? _b : false;
    var baseSelectOptionProps = ((_c = rootProps.slotProps) === null || _c === void 0 ? void 0 : _c.baseSelectOption) || {};
    var onFilterChange = React.useCallback(function (event) {
        var value = sanitizeFilterItemValue(event.target.value);
        setFilterValueState(value);
        applyValue(__assign(__assign({}, item), { value: value }));
    }, [applyValue, item]);
    React.useEffect(function () {
        setFilterValueState(sanitizeFilterItemValue(item.value));
    }, [item.value]);
    var label = (_d = slotProps === null || slotProps === void 0 ? void 0 : slotProps.root.label) !== null && _d !== void 0 ? _d : apiRef.current.getLocaleText('filterPanelInputLabel');
    var rootSlotProps = slotProps === null || slotProps === void 0 ? void 0 : slotProps.root.slotProps;
    return (<React.Fragment>
      <rootProps.slots.baseSelect fullWidth labelId={labelId} id={selectId} label={label} value={filterValueState === undefined ? '' : String(filterValueState)} onChange={onFilterChange} native={isSelectNative} slotProps={{
            htmlInput: __assign({ ref: focusElementRef, tabIndex: tabIndex }, rootSlotProps === null || rootSlotProps === void 0 ? void 0 : rootSlotProps.htmlInput),
        }} {...baseSelectProps} {...others} {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.root}>
        <rootProps.slots.baseSelectOption {...baseSelectOptionProps} native={isSelectNative} value="">
          {apiRef.current.getLocaleText('filterValueAny')}
        </rootProps.slots.baseSelectOption>
        <rootProps.slots.baseSelectOption {...baseSelectOptionProps} native={isSelectNative} value="true">
          {apiRef.current.getLocaleText('filterValueTrue')}
        </rootProps.slots.baseSelectOption>
        <rootProps.slots.baseSelectOption {...baseSelectOptionProps} native={isSelectNative} value="false">
          {apiRef.current.getLocaleText('filterValueFalse')}
        </rootProps.slots.baseSelectOption>
      </rootProps.slots.baseSelect>
      {headerFilterMenu}
      {clearButton}
    </React.Fragment>);
}
function sanitizeFilterItemValue(value) {
    if (String(value).toLowerCase() === 'true') {
        return true;
    }
    if (String(value).toLowerCase() === 'false') {
        return false;
    }
    return undefined;
}
GridFilterInputBoolean.propTypes = {
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
    focusElementRef: refType_1.default,
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
};
