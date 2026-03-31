import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createElement as _createElement } from "react";
import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { getValueFromValueOptions, getValueOptions, isSingleSelectColDef, } from './filterPanelUtils';
const renderSingleSelectOptions = ({ column, OptionComponent, getOptionLabel, getOptionValue, isSelectNative, baseSelectOptionProps, }) => {
    const iterableColumnValues = ['', ...(getValueOptions(column) || [])];
    return iterableColumnValues.map((option) => {
        const value = getOptionValue(option);
        let label = getOptionLabel(option);
        if (label === '') {
            label = ' '; // To force the height of the empty option
        }
        return (_createElement(OptionComponent, { ...baseSelectOptionProps, native: isSelectNative, key: value, value: value }, label));
    });
};
function GridFilterInputSingleSelect(props) {
    const { item, applyValue, type, apiRef, focusElementRef, tabIndex, isFilterActive, clearButton, headerFilterMenu, slotProps, ...other } = props;
    const filterValue = item.value ?? '';
    const id = useId();
    const labelId = useId();
    const rootProps = useGridRootProps();
    const isSelectNative = rootProps.slotProps?.baseSelect?.native ?? false;
    const resolvedColumn = apiRef.current.getColumn(item.field);
    const getOptionValue = resolvedColumn.getOptionValue;
    const getOptionLabel = resolvedColumn.getOptionLabel;
    const currentValueOptions = React.useMemo(() => {
        return getValueOptions(resolvedColumn);
    }, [resolvedColumn]);
    const onFilterChange = React.useCallback((event) => {
        let value = event.target.value;
        // NativeSelect casts the value to a string.
        value = getValueFromValueOptions(value, currentValueOptions, getOptionValue);
        applyValue({ ...item, value });
    }, [currentValueOptions, getOptionValue, applyValue, item]);
    if (!resolvedColumn || !isSingleSelectColDef(resolvedColumn)) {
        return null;
    }
    const label = slotProps?.root.label ?? apiRef.current.getLocaleText('filterPanelInputLabel');
    return (_jsxs(React.Fragment, { children: [_jsx(rootProps.slots.baseSelect, { fullWidth: true, id: id, label: label, labelId: labelId, value: filterValue, onChange: onFilterChange, slotProps: {
                    htmlInput: {
                        tabIndex,
                        ref: focusElementRef,
                        type: type || 'text',
                        placeholder: slotProps?.root.placeholder ??
                            apiRef.current.getLocaleText('filterPanelInputPlaceholder'),
                        ...slotProps?.root.slotProps?.htmlInput,
                    },
                }, native: isSelectNative, ...rootProps.slotProps?.baseSelect, ...other, ...slotProps?.root, children: renderSingleSelectOptions({
                    column: resolvedColumn,
                    OptionComponent: rootProps.slots.baseSelectOption,
                    getOptionLabel,
                    getOptionValue,
                    isSelectNative,
                    baseSelectOptionProps: rootProps.slotProps?.baseSelectOption,
                }) }), headerFilterMenu, clearButton] }));
}
GridFilterInputSingleSelect.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    apiRef: PropTypes.shape({
        current: PropTypes.object.isRequired,
    }).isRequired,
    applyValue: PropTypes.func.isRequired,
    className: PropTypes.string,
    clearButton: PropTypes.node,
    disabled: PropTypes.bool,
    focusElementRef: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
        PropTypes.func,
        PropTypes.object,
    ]),
    headerFilterMenu: PropTypes.node,
    inputRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({
            current: (props, propName) => {
                if (props[propName] == null) {
                    return null;
                }
                if (typeof props[propName] !== 'object' || props[propName].nodeType !== 1) {
                    return new Error(`Expected prop '${propName}' to be of type Element`);
                }
                return null;
            },
        }),
    ]),
    /**
     * It is `true` if the filter either has a value or an operator with no value
     * required is selected (for example `isEmpty`)
     */
    isFilterActive: PropTypes.bool,
    item: PropTypes.shape({
        field: PropTypes.string.isRequired,
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        operator: PropTypes.string.isRequired,
        value: PropTypes.any,
    }).isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    slotProps: PropTypes.object,
    tabIndex: PropTypes.number,
    type: PropTypes.oneOf(['singleSelect']),
};
export { GridFilterInputSingleSelect };
