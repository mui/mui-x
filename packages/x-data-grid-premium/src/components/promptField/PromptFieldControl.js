import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { usePromptFieldContext } from './PromptFieldContext';
/**
 * A component that takes user input.
 * It renders the `baseTextField` slot.
 *
 * Demos:
 *
 * - [Prompt Field](https://mui.com/x/react-data-grid/components/prompt-field/)
 *
 * API:
 *
 * - [PromptFieldControl API](https://mui.com/x/api/data-grid/prompt-field-control/)
 */
const PromptFieldControl = forwardRef(function PromptFieldControl(props, ref) {
    const { render, className, onChange, onKeyDown, ...other } = props;
    const rootProps = useGridRootProps();
    const { state, onValueChange, onSubmit } = usePromptFieldContext();
    const resolvedClassName = typeof className === 'function' ? className(state) : className;
    const handleChange = (event) => {
        onValueChange(event.target.value);
        onChange?.(event);
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && state.value.trim()) {
            onSubmit(state.value);
        }
        onKeyDown?.(event);
    };
    const element = useComponentRenderer(rootProps.slots.baseTextField, render, {
        ...rootProps.slotProps?.baseTextField,
        value: state.value,
        className: resolvedClassName,
        ...other,
        onChange: handleChange,
        onKeyDown: handleKeyDown,
        ref,
    }, state);
    return _jsx(React.Fragment, { children: element });
});
PromptFieldControl.propTypes = {
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
export { PromptFieldControl };
