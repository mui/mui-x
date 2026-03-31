import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { usePromptFieldContext } from './PromptFieldContext';
/**
 * A button that processes the prompt when clicked.
 * It renders the `baseIconButton` slot.
 *
 * Demos:
 *
 * - [Prompt Field](https://mui.com/x/react-data-grid/components/prompt-field/)
 *
 * API:
 *
 * - [PromptFieldSend API](https://mui.com/x/api/data-grid/prompt-field-send/)
 */
const PromptFieldSend = forwardRef(function PromptFieldSend(props, ref) {
    const { render, className, onClick, ...other } = props;
    const rootProps = useGridRootProps();
    const { state, onSubmit } = usePromptFieldContext();
    const resolvedClassName = typeof className === 'function' ? className(state) : className;
    const handleClick = (event) => {
        onSubmit(state.value);
        onClick?.(event);
    };
    const element = useComponentRenderer(rootProps.slots.baseIconButton, render, {
        ...rootProps.slotProps?.baseIconButton,
        className: resolvedClassName,
        disabled: state.disabled || state.recording || !state.value.trim(),
        ...other,
        onClick: handleClick,
        ref,
    }, state);
    return _jsx(React.Fragment, { children: element });
});
PromptFieldSend.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Override or extend the styles applied to the component.
     */
    className: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    color: PropTypes.oneOf(['default', 'inherit', 'primary']),
    disabled: PropTypes.bool,
    edge: PropTypes.oneOf(['end', 'start', false]),
    id: PropTypes.string,
    label: PropTypes.string,
    /**
     * A function to customize rendering of the component.
     */
    render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    role: PropTypes.string,
    size: PropTypes.oneOf(['large', 'medium', 'small']),
    style: PropTypes.object,
    tabIndex: PropTypes.number,
    title: PropTypes.string,
    touchRippleRef: PropTypes.any,
};
export { PromptFieldSend };
