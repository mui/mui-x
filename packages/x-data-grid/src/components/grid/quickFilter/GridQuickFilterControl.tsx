/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import {
  useGridComponentRenderer,
  RenderProp,
} from '../../../hooks/utils/useGridComponentRenderer';
import type { GridSlotProps } from '../../../models';
import { GridQuickFilterState, useGridQuickFilterRootContext } from './GridQuickFilterRootContext';

export type GridQuickFilterControlProps = Omit<GridSlotProps['baseTextField'], 'className'> & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<GridSlotProps['baseTextField'], GridQuickFilterState>;
  /**
   * Override or extend the styles applied to the component.
   */
  className?: string | ((state: GridQuickFilterState) => string);
};

/**
 * Demos:
 *
 * - [Quick Filter](https://mui.com/x/react-data-grid/components/quick-filter/)
 *
 * API:
 *
 * - [GridQuickFilterControl API](https://mui.com/x/api/data-grid/grid-quick-filter-control/)
 */
const GridQuickFilterControl = React.forwardRef<HTMLInputElement, GridQuickFilterControlProps>(
  function GridQuickFilterControl(props, ref) {
    const { render, className, ...other } = props;
    const rootProps = useGridRootProps();
    const { state, controlRef, onValueChange, clearValue } = useGridQuickFilterRootContext();
    const resolvedClassName = typeof className === 'function' ? className(state) : className;
    const handleRef = useForkRef(controlRef, ref);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        clearValue();
      }

      props.onKeyDown?.(event);
    };

    return useGridComponentRenderer(
      rootProps.slots.baseTextField,
      render,
      {
        ...rootProps.slotProps?.baseTextField,
        ref: handleRef,
        value: state.value,
        className: resolvedClassName,
        onChange: onValueChange,
        onKeyDown: handleKeyDown,
        ...other,
      },
      state,
    );
  },
);

GridQuickFilterControl.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  className: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

export { GridQuickFilterControl };
