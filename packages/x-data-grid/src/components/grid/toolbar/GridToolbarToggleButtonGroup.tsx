/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import {
  useGridComponentRenderer,
  RenderProp,
} from '../../../hooks/utils/useGridComponentRenderer';
import type { GridSlotProps } from '../../../models';

export type GridToolbarToggleButtonGroupProps = GridSlotProps['baseToggleButtonGroup'] & {
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
 * - [GridToolbarToggleButtonGroup API](https://mui.com/x/api/data-grid/grid-toolbar-toggle-button-group/)
 */
const GridToolbarToggleButtonGroup = React.forwardRef<
  HTMLDivElement,
  GridToolbarToggleButtonGroupProps
>(function GridToolbarToggleButtonGroup(props, ref) {
  const { render, ...other } = props;
  const rootProps = useGridRootProps();

  return useGridComponentRenderer(rootProps.slots.baseToggleButtonGroup, render, {
    ...rootProps.slotProps?.baseToggleButtonGroup,
    ref,
    ...other,
  });
});

GridToolbarToggleButtonGroup.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

export { GridToolbarToggleButtonGroup };
