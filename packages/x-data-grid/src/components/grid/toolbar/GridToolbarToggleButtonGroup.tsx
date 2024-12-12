/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { ToggleButtonGroupProps } from '@mui/material/ToggleButtonGroup';
import composeClasses from '@mui/utils/composeClasses';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { getDataGridUtilityClass } from '../../../constants/gridClasses';
import {
  useGridComponentRenderer,
  RenderProp,
} from '../../../hooks/utils/useGridComponentRenderer';

export interface GridToolbarToggleButtonGroupProps extends ToggleButtonGroupProps {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<{}>;
}

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['toolbarToggleButtonGroup'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function DefaultGridToolbarToggleButtonGroup(props: GridToolbarToggleButtonGroupProps) {
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);
  const { children, className, ...other } = props;

  return (
    <rootProps.slots.baseToggleButtonGroup
      color="primary"
      size="small"
      className={clsx(classes.root, className)}
      {...other}
    >
      {children}
    </rootProps.slots.baseToggleButtonGroup>
  );
}

DefaultGridToolbarToggleButtonGroup.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

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

  return useGridComponentRenderer({
    render,
    defaultElement: DefaultGridToolbarToggleButtonGroup as React.ComponentType<any>,
    props: {
      ref,
      ...other,
    },
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
