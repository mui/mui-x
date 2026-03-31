import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import useForkRef from '@mui/utils/useForkRef';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useQuickFilterContext } from './QuickFilterContext';
/**
 * A component that takes user input and filters row data.
 * It renders the `baseTextField` slot.
 *
 * Demos:
 *
 * - [Quick Filter](https://mui.com/x/react-data-grid/components/quick-filter/)
 *
 * API:
 *
 * - [QuickFilterControl API](https://mui.com/x/api/data-grid/quick-filter-control/)
 */
const QuickFilterControl = forwardRef(function QuickFilterControl(props, ref) {
    const { render, className, slotProps, onKeyDown, onChange, ...other } = props;
    const rootProps = useGridRootProps();
    const { state, controlId, controlRef, onValueChange, onExpandedChange, clearValue } = useQuickFilterContext();
    const resolvedClassName = typeof className === 'function' ? className(state) : className;
    const handleRef = useForkRef(controlRef, ref);
    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            if (state.value === '') {
                onExpandedChange(false);
            }
            else {
                clearValue();
            }
        }
        onKeyDown?.(event);
    };
    const handleBlur = (event) => {
        if (state.value === '') {
            onExpandedChange(false);
        }
        slotProps?.htmlInput?.onBlur?.(event);
    };
    const handleChange = (event) => {
        if (!state.expanded) {
            onExpandedChange(true);
        }
        onValueChange(event);
        onChange?.(event);
    };
    const element = useComponentRenderer(rootProps.slots.baseTextField, render, {
        ...rootProps.slotProps?.baseTextField,
        slotProps: {
            htmlInput: {
                role: 'searchbox',
                id: controlId,
                tabIndex: state.expanded ? undefined : -1,
                ...slotProps?.htmlInput,
                onBlur: handleBlur,
            },
            ...slotProps,
        },
        value: state.value,
        className: resolvedClassName,
        ...other,
        onChange: handleChange,
        onKeyDown: handleKeyDown,
        ref: handleRef,
    }, state);
    return _jsx(React.Fragment, { children: element });
});
QuickFilterControl.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    autoComplete: PropTypes.string,
    autoFocus: PropTypes.bool,
    /**
     * Override or extend the styles applied to the component.
     */
    className: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    color: PropTypes.oneOf(['error', 'primary']),
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    fullWidth: PropTypes.bool,
    helperText: PropTypes.string,
    id: PropTypes.string,
    inputRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({
            current: PropTypes.object,
        }),
    ]),
    label: PropTypes.node,
    multiline: PropTypes.bool,
    placeholder: PropTypes.string,
    /**
     * A function to customize rendering of the component.
     */
    render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    role: PropTypes.string,
    size: PropTypes.oneOf(['medium', 'small']),
    slotProps: PropTypes.object,
    style: PropTypes.object,
    tabIndex: PropTypes.number,
    type: PropTypes.string,
    value: PropTypes.string,
};
export { QuickFilterControl };
