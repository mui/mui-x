'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import useForkRef from '@mui/utils/useForkRef';
import useId from '@mui/utils/useId';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useToolbarContext } from './ToolbarContext';
/**
 * A button for performing actions from the toolbar.
 * It renders the `baseIconButton` slot.
 *
 * Demos:
 *
 * - [Toolbar](https://mui.com/x/react-data-grid/components/toolbar/)
 *
 * API:
 *
 * - [ToolbarButton API](https://mui.com/x/api/data-grid/toolbar-button/)
 */
const ToolbarButton = forwardRef(function ToolbarButton(props, ref) {
    const { render, onKeyDown, onFocus, disabled, 'aria-disabled': ariaDisabled, ...other } = props;
    const id = useId();
    const rootProps = useGridRootProps();
    const buttonRef = React.useRef(null);
    const handleRef = useForkRef(buttonRef, ref);
    const { focusableItemId, registerItem, unregisterItem, onItemKeyDown, onItemFocus, onItemDisabled, } = useToolbarContext();
    const handleKeyDown = (event) => {
        onItemKeyDown(event);
        onKeyDown?.(event);
    };
    const handleFocus = (event) => {
        onItemFocus(id);
        onFocus?.(event);
    };
    React.useEffect(() => {
        registerItem(id, buttonRef);
        return () => unregisterItem(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const previousDisabled = React.useRef(disabled);
    React.useEffect(() => {
        if (previousDisabled.current !== disabled && disabled === true) {
            onItemDisabled(id, disabled);
        }
        previousDisabled.current = disabled;
    }, [disabled, id, onItemDisabled]);
    const previousAriaDisabled = React.useRef(ariaDisabled);
    React.useEffect(() => {
        if (previousAriaDisabled.current !== ariaDisabled && ariaDisabled === true) {
            onItemDisabled(id, true);
        }
        previousAriaDisabled.current = ariaDisabled;
    }, [ariaDisabled, id, onItemDisabled]);
    const element = useComponentRenderer(rootProps.slots.baseIconButton, render, {
        ...rootProps.slotProps?.baseIconButton,
        tabIndex: focusableItemId === id ? 0 : -1,
        ...other,
        disabled,
        'aria-disabled': ariaDisabled,
        onKeyDown: handleKeyDown,
        onFocus: handleFocus,
        ref: handleRef,
    });
    return _jsx(React.Fragment, { children: element });
});
ToolbarButton.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    className: PropTypes.string,
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
export { ToolbarButton };
