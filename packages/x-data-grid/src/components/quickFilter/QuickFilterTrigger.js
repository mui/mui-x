import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import useForkRef from '@mui/utils/useForkRef';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useQuickFilterContext } from './QuickFilterContext';
/**
 * A button that expands/collapses the quick filter.
 * It renders the `baseButton` slot.
 *
 * Demos:
 *
 * - [Quick Filter](https://mui.com/x/react-data-grid/components/quick-filter/)
 *
 * API:
 *
 * - [QuickFilterTrigger API](https://mui.com/x/api/data-grid/quick-filter-trigger/)
 */
const QuickFilterTrigger = forwardRef(function QuickFilterTrigger(props, ref) {
    const { render, className, onClick, ...other } = props;
    const rootProps = useGridRootProps();
    const { state, controlId, onExpandedChange, triggerRef } = useQuickFilterContext();
    const resolvedClassName = typeof className === 'function' ? className(state) : className;
    const handleRef = useForkRef(triggerRef, ref);
    const handleClick = (event) => {
        onExpandedChange(!state.expanded);
        onClick?.(event);
    };
    const element = useComponentRenderer(rootProps.slots.baseButton, render, {
        ...rootProps.slotProps?.baseButton,
        className: resolvedClassName,
        'aria-controls': controlId,
        'aria-expanded': state.expanded,
        ...other,
        onClick: handleClick,
        ref: handleRef,
    }, state);
    return _jsx(React.Fragment, { children: element });
});
QuickFilterTrigger.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Override or extend the styles applied to the component.
     */
    className: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    disabled: PropTypes.bool,
    id: PropTypes.string,
    /**
     * A function to customize rendering of the component.
     */
    render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    role: PropTypes.string,
    size: PropTypes.oneOf(['large', 'medium', 'small']),
    startIcon: PropTypes.node,
    style: PropTypes.object,
    tabIndex: PropTypes.number,
    title: PropTypes.string,
    touchRippleRef: PropTypes.any,
};
export { QuickFilterTrigger };
