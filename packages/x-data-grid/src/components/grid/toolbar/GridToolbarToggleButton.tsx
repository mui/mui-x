/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
import ToggleButton, { ToggleButtonProps } from '@mui/material/ToggleButton';
import { styled } from '@mui/system';
import composeClasses from '@mui/utils/composeClasses';
import clsx from 'clsx';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../../constants/gridClasses';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import {
  useGridComponentRenderer,
  RenderProp,
} from '../../../hooks/utils/useGridComponentRenderer';

export interface GridToolbarToggleButtonProps extends ToggleButtonProps {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<{}>;
}

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['toolbarToggleButton'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const StyledGridToolbarToggleButton = styled(ToggleButton, {
  name: 'MuiDataGrid',
  slot: 'ToolbarToggleButton',
  overridesResolver: (_, styles) => styles.toolbarToggleButton,
})<{ ownerState: OwnerState }>(({ theme }) => ({
  gap: theme.spacing(0.5),
  minHeight: 34,
  lineHeight: 'normal',
}));

const DefaultGridToolbarToggleButton = React.forwardRef<
  HTMLButtonElement,
  GridToolbarToggleButtonProps
>(function DefaultGridToolbarToggleButton(props, ref) {
  const { children, className, size = 'small', ...other } = props;
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);

  return (
    <StyledGridToolbarToggleButton
      ref={ref}
      as={rootProps.slots.baseToggleButton}
      ownerState={rootProps}
      className={clsx(classes.root, className)}
      size={size}
      {...rootProps.slotProps?.baseToggleButton}
      {...other}
    >
      {children}
    </StyledGridToolbarToggleButton>
  );
});

DefaultGridToolbarToggleButton.propTypes = {
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
 * - [GridToolbarToggleButton API](https://mui.com/x/api/data-grid/grid-toolbar-toggle-button/)
 */
const GridToolbarToggleButton = React.forwardRef<HTMLButtonElement, GridToolbarToggleButtonProps>(
  function GridToolbarToggleButton(props, ref) {
    const { render, ...other } = props;

    return useGridComponentRenderer({
      render,
      defaultElement: DefaultGridToolbarToggleButton as React.ComponentType<any>,
      props: {
        ref,
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
