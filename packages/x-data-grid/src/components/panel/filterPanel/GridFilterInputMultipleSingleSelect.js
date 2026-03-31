import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { getValueOptions, isSingleSelectColDef } from './filterPanelUtils';
function GridFilterInputMultipleSingleSelect(props) {
    const { item, applyValue, type, apiRef, focusElementRef, slotProps, ...other } = props;
    const id = useId();
    const rootProps = useGridRootProps();
    const resolvedColumn = apiRef.current.getColumn(item.field);
    const getOptionValue = resolvedColumn.getOptionValue;
    const getOptionLabel = resolvedColumn.getOptionLabel;
    const isOptionEqualToValue = React.useCallback((option, value) => getOptionValue(option) === getOptionValue(value), [getOptionValue]);
    const resolvedValueOptions = React.useMemo(() => {
        return getValueOptions(resolvedColumn) || [];
    }, [resolvedColumn]);
    // The value is computed from the item.value and used directly
    // If it was done by a useEffect/useState, the Autocomplete could receive incoherent value and options
    const filteredValues = React.useMemo(() => {
        if (!Array.isArray(item.value)) {
            return [];
        }
        return item.value.reduce((acc, value) => {
            const resolvedValue = resolvedValueOptions.find((v) => getOptionValue(v) === value);
            if (resolvedValue != null) {
                acc.push(resolvedValue);
            }
            return acc;
        }, []);
    }, [getOptionValue, item.value, resolvedValueOptions]);
    const handleChange = React.useCallback((event, value) => {
        applyValue({ ...item, value: value.map(getOptionValue) });
    }, [applyValue, item, getOptionValue]);
    if (!resolvedColumn || !isSingleSelectColDef(resolvedColumn)) {
        return null;
    }
    const BaseAutocomplete = rootProps.slots.baseAutocomplete;
    return (_jsx(BaseAutocomplete, { multiple: true, options: resolvedValueOptions, isOptionEqualToValue: isOptionEqualToValue, id: id, value: filteredValues, onChange: handleChange, getOptionLabel: getOptionLabel, label: apiRef.current.getLocaleText('filterPanelInputLabel'), placeholder: apiRef.current.getLocaleText('filterPanelInputPlaceholder'), slotProps: {
            textField: {
                type: type || 'text',
                inputRef: focusElementRef,
            },
        }, ...other, ...slotProps?.root }));
}
GridFilterInputMultipleSingleSelect.propTypes = {
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
export { GridFilterInputMultipleSingleSelect };
