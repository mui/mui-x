/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
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
    const { value, onValueChange, controlRef } = useGridQuickFilterRootContext();
    const handleRef = useForkRef(controlRef, ref);
    const state = { value };
    const resolvedClassName = typeof className === 'function' ? className(state) : className;

    return useGridComponentRenderer(
      rootProps.slots.baseTextField,
      render,
      {
        ...rootProps.slotProps?.baseTextField,
        ref: handleRef,
        type: 'search',
        value,
        onChange: onValueChange,
        className: resolvedClassName,
        ...other,
      },
      state,
    );
  },
);

export { GridQuickFilterControl };
