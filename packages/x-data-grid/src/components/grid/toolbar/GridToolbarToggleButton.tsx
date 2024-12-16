/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import {
  useGridComponentRenderer,
  RenderProp,
} from '../../../hooks/utils/useGridComponentRenderer';
import { useGridToolbarItem } from './useGridToolbarItem';
import type { GridSlotProps } from '../../../models';

export type GridToolbarToggleButtonProps = GridSlotProps['baseToolbarToggleButton'] & {
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
 * - [GridToolbarToggleButton API](https://mui.com/x/api/data-grid/grid-toolbar-toggle-button/)
 */
const GridToolbarToggleButton = React.forwardRef<HTMLButtonElement, GridToolbarToggleButtonProps>(
  function GridToolbarToggleButton(props, ref) {
    const { render, ...other } = props;
    const rootProps = useGridRootProps();
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const handleRef = useForkRef(buttonRef, ref);
    const itemProps = useGridToolbarItem(buttonRef);

    return useGridComponentRenderer({
      render,
      defaultElement: rootProps.slots.baseToolbarToggleButton,
      props: {
        ref: handleRef,
        ...itemProps,
        ...other,
      },
    });
  },
);

GridToolbarToggleButton.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

export { GridToolbarToggleButton };
