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
exports.GridFilterInputSingleSelect = GridFilterInputSingleSelect;
var React = require("react");
var prop_types_1 = require("prop-types");
var useId_1 = require("@mui/utils/useId");
var useGridRootProps_1 = require("../../../hooks/utils/useGridRootProps");
var filterPanelUtils_1 = require("./filterPanelUtils");
var renderSingleSelectOptions = function (_a) {
    var column = _a.column, OptionComponent = _a.OptionComponent, getOptionLabel = _a.getOptionLabel, getOptionValue = _a.getOptionValue, isSelectNative = _a.isSelectNative, baseSelectOptionProps = _a.baseSelectOptionProps;
    var iterableColumnValues = __spreadArray([''], ((0, filterPanelUtils_1.getValueOptions)(column) || []), true);
    return iterableColumnValues.map(function (option) {
        var value = getOptionValue(option);
        var label = getOptionLabel(option);
        if (label === '') {
            label = ' '; // To force the height of the empty option
        }
        return (<OptionComponent {...baseSelectOptionProps} native={isSelectNative} key={value} value={value}>
        {label}
      </OptionComponent>);
    });
};
function GridFilterInputSingleSelect(props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var item = props.item, applyValue = props.applyValue, type = props.type, apiRef = props.apiRef, focusElementRef = props.focusElementRef, tabIndex = props.tabIndex, isFilterActive = props.isFilterActive, clearButton = props.clearButton, headerFilterMenu = props.headerFilterMenu, slotProps = props.slotProps, others = __rest(props, ["item", "applyValue", "type", "apiRef", "focusElementRef", "tabIndex", "isFilterActive", "clearButton", "headerFilterMenu", "slotProps"]);
    var filterValue = (_a = item.value) !== null && _a !== void 0 ? _a : '';
    var id = (0, useId_1.default)();
    var labelId = (0, useId_1.default)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var isSelectNative = (_d = (_c = (_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseSelect) === null || _c === void 0 ? void 0 : _c.native) !== null && _d !== void 0 ? _d : false;
    var resolvedColumn = null;
    if (item.field) {
        var column = apiRef.current.getColumn(item.field);
        if ((0, filterPanelUtils_1.isSingleSelectColDef)(column)) {
            resolvedColumn = column;
        }
    }
    var getOptionValue = resolvedColumn === null || resolvedColumn === void 0 ? void 0 : resolvedColumn.getOptionValue;
    var getOptionLabel = resolvedColumn === null || resolvedColumn === void 0 ? void 0 : resolvedColumn.getOptionLabel;
    var currentValueOptions = React.useMemo(function () {
        return (0, filterPanelUtils_1.getValueOptions)(resolvedColumn);
    }, [resolvedColumn]);
    var onFilterChange = React.useCallback(function (event) {
        var value = event.target.value;
        // NativeSelect casts the value to a string.
        value = (0, filterPanelUtils_1.getValueFromValueOptions)(value, currentValueOptions, getOptionValue);
        applyValue(__assign(__assign({}, item), { value: value }));
    }, [currentValueOptions, getOptionValue, applyValue, item]);
    if (!(0, filterPanelUtils_1.isSingleSelectColDef)(resolvedColumn)) {
        return null;
    }
    var label = (_e = slotProps === null || slotProps === void 0 ? void 0 : slotProps.root.label) !== null && _e !== void 0 ? _e : apiRef.current.getLocaleText('filterPanelInputLabel');
    return (<React.Fragment>
      <rootProps.slots.baseSelect fullWidth id={id} label={label} labelId={labelId} value={filterValue} onChange={onFilterChange} slotProps={{
            htmlInput: __assign({ tabIndex: tabIndex, ref: focusElementRef, type: type || 'text', placeholder: (_f = slotProps === null || slotProps === void 0 ? void 0 : slotProps.root.placeholder) !== null && _f !== void 0 ? _f : apiRef.current.getLocaleText('filterPanelInputPlaceholder') }, (_g = slotProps === null || slotProps === void 0 ? void 0 : slotProps.root.slotProps) === null || _g === void 0 ? void 0 : _g.htmlInput),
        }} native={isSelectNative} {...(_h = rootProps.slotProps) === null || _h === void 0 ? void 0 : _h.baseSelect} {...others} {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.root}>
        {renderSingleSelectOptions({
            column: resolvedColumn,
            OptionComponent: rootProps.slots.baseSelectOption,
            getOptionLabel: getOptionLabel,
            getOptionValue: getOptionValue,
            isSelectNative: isSelectNative,
            baseSelectOptionProps: (_j = rootProps.slotProps) === null || _j === void 0 ? void 0 : _j.baseSelectOption,
        })}
      </rootProps.slots.baseSelect>
      {headerFilterMenu}
      {clearButton}
    </React.Fragment>);
}
GridFilterInputSingleSelect.propTypes = {
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
