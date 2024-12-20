/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import {
  useGridComponentRenderer,
  RenderProp,
} from '../../../hooks/utils/useGridComponentRenderer';
import type { GridSlotProps } from '../../../models';
import { GridQuickFilterState, useGridQuickFilterRootContext } from './GridQuickFilterRootContext';

export type GridQuickFilterClearProps = Omit<GridSlotProps['baseIconButton'], 'className'> & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<GridSlotProps['baseIconButton'], GridQuickFilterState>;
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
 * - [GridQuickFilterClear API](https://mui.com/x/api/data-grid/grid-quick-filter-clear/)
 */
const GridQuickFilterClear = React.forwardRef<HTMLButtonElement, GridQuickFilterClearProps>(
  function GridQuickFilterClear(props, ref) {
    const { render, className, ...other } = props;
    const rootProps = useGridRootProps();
    const { state, clearValue } = useGridQuickFilterRootContext();
    const resolvedClassName = typeof className === 'function' ? className(state) : className;

    return useGridComponentRenderer(
      rootProps.slots.baseIconButton,
      render,
      {
        ...rootProps.slotProps?.baseIconButton,
        ref,
        onClick: clearValue,
        className: resolvedClassName,
        ...other,
      },
      state,
    );
  },
);

GridQuickFilterClear.propTypes = {
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

export { GridQuickFilterClear };
