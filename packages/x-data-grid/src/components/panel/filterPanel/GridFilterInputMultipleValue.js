'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
function GridFilterInputMultipleValue(props) {
    const { item, applyValue, type, apiRef, focusElementRef, slotProps, ...other } = props;
    const id = useId();
    const [options, setOptions] = React.useState([]);
    const [filterValueState, setFilterValueState] = React.useState(item.value || []);
    const rootProps = useGridRootProps();
    React.useEffect(() => {
        const itemValue = item.value ?? [];
        setFilterValueState(itemValue.map(String));
    }, [item.value]);
    const handleChange = React.useCallback((event, value) => {
        setFilterValueState(value.map(String));
        applyValue({
            ...item,
            value: [
                ...value.map((filterItemValue) => type === 'number' ? Number(filterItemValue) : filterItemValue),
            ],
        });
    }, [applyValue, item, type]);
    const handleInputChange = React.useCallback((event, value) => {
        if (value === '') {
            setOptions([]);
        }
        else {
            setOptions([value]);
        }
    }, [setOptions]);
    const BaseAutocomplete = rootProps.slots.baseAutocomplete;
    return (_jsx(BaseAutocomplete, { multiple: true, freeSolo: true, options: options, id: id, value: filterValueState, onChange: handleChange, onInputChange: handleInputChange, label: apiRef.current.getLocaleText('filterPanelInputLabel'), placeholder: apiRef.current.getLocaleText('filterPanelInputPlaceholder'), slotProps: {
            textField: {
                type: type || 'text',
                inputRef: focusElementRef,
            },
        }, ...other, ...slotProps?.root }));
}
GridFilterInputMultipleValue.propTypes = {
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
    type: PropTypes.oneOf(['date', 'datetime-local', 'number', 'text']),
};
export { GridFilterInputMultipleValue };
