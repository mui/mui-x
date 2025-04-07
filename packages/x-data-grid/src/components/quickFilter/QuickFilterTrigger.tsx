import * as React from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridComponentRenderer, RenderProp } from '../../hooks/utils/useGridComponentRenderer';
import type { GridSlotProps } from '../../models';
import { QuickFilterState, useQuickFilterContext } from './QuickFilterContext';

export type QuickFilterTriggerProps = Omit<GridSlotProps['baseButton'], 'className'> & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<GridSlotProps['baseButton'], QuickFilterState>;
  /**
   * Override or extend the styles applied to the component.
   */
  className?: string | ((state: QuickFilterState) => string);
};

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
const QuickFilterTrigger = forwardRef<HTMLButtonElement, QuickFilterTriggerProps>(
  function QuickFilterTrigger(props, ref) {
    const { render, className, onClick, ...other } = props;
    const rootProps = useGridRootProps();
    const { state, controlId, onExpandedChange, triggerRef } = useQuickFilterContext();
    const resolvedClassName = typeof className === 'function' ? className(state) : className;
    const handleRef = useForkRef(triggerRef, ref);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onExpandedChange(!state.expanded);
      onClick?.(event);
    };

    const element = useGridComponentRenderer(
      rootProps.slots.baseButton,
      render,
      {
        ...rootProps.slotProps?.baseButton,
        className: resolvedClassName,
        'aria-controls': controlId,
        'aria-expanded': state.expanded,
        ...other,
        onClick: handleClick,
        ref: handleRef,
      },
      state,
    );

    return <React.Fragment>{element}</React.Fragment>;
  },
);

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
} as any;

export { QuickFilterTrigger };
