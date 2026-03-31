'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import { useTimeout } from '../../../hooks/utils/useTimeout';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
function GridFilterInputValue(props) {
    const { item, applyValue, type, apiRef, focusElementRef, tabIndex, disabled, isFilterActive, slotProps, clearButton, headerFilterMenu, ...other } = props;
    const textFieldProps = slotProps?.root;
    const filterTimeout = useTimeout();
    const [filterValueState, setFilterValueState] = React.useState(sanitizeFilterItemValue(item.value));
    const [applying, setIsApplying] = React.useState(false);
    const id = useId();
    const rootProps = useGridRootProps();
    const onFilterChange = React.useCallback((event) => {
        const value = sanitizeFilterItemValue(event.target.value);
        setFilterValueState(value);
        setIsApplying(true);
        filterTimeout.start(rootProps.filterDebounceMs, () => {
            const newItem = {
                ...item,
                value: type === 'number' && !Number.isNaN(Number(value)) ? Number(value) : value,
                fromInput: id,
            };
            applyValue(newItem);
            setIsApplying(false);
        });
    }, [filterTimeout, rootProps.filterDebounceMs, item, type, id, applyValue]);
    React.useEffect(() => {
        const itemPlusTag = item;
        if (itemPlusTag.fromInput !== id || item.value == null) {
            setFilterValueState(sanitizeFilterItemValue(item.value));
        }
    }, [id, item]);
    return (_jsxs(React.Fragment, { children: [_jsx(rootProps.slots.baseTextField, { id: id, label: apiRef.current.getLocaleText('filterPanelInputLabel'), placeholder: apiRef.current.getLocaleText('filterPanelInputPlaceholder'), value: filterValueState ?? '', onChange: onFilterChange, type: type || 'text', disabled: disabled, slotProps: {
                    ...textFieldProps?.slotProps,
                    input: {
                        endAdornment: applying ? (_jsx(rootProps.slots.loadIcon, { fontSize: "small", color: "action" })) : null,
                        ...textFieldProps?.slotProps?.input,
                    },
                    htmlInput: {
                        tabIndex,
                        ...textFieldProps?.slotProps?.htmlInput,
                    },
                }, inputRef: focusElementRef, ...rootProps.slotProps?.baseTextField, ...other, ...textFieldProps }), headerFilterMenu, clearButton] }));
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
export { GridFilterInputValue };
