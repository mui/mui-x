/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
import {
  useGridComponentRenderer,
  RenderProp,
} from '../../../hooks/utils/useGridComponentRenderer';
import { useGridToolbarRootContext } from './GridToolbarRootContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import type { GridSlotProps } from '../../../models';

export type GridToolbarSeparatorProps = GridSlotProps['baseToolbarSeparator'] & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<{}>;
};

/**
 * Demos:
 *
 * - [Toolbar](https://mui.com/x/react-data-grid/components/toolbar/)
 *
 * API:
 *
 * - [GridToolbarSeparator API](https://mui.com/x/api/data-grid/grid-toolbar-separator/)
 */
const GridToolbarSeparator = React.forwardRef<HTMLDivElement, GridToolbarSeparatorProps>(
  function GridToolbarSeparator(props, ref) {
    const { render, ...other } = props;
    const { orientation } = useGridToolbarRootContext();
    const rootProps = useGridRootProps();

    return useGridComponentRenderer(rootProps.slots.baseToolbarSeparator, render, {
      ref,
      role: 'separator',
      'aria-orientation': orientation === 'horizontal' ? 'vertical' : 'vertical',
      ...rootProps.slotProps?.baseToolbarSeparator,
      ...other,
    });
  },
);

GridToolbarSeparator.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { GridToolbarSeparator };
