import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, SxProps, Theme } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { getDataGridUtilityClass } from '../../../constants/gridClasses';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';

export type GridToolbarRootProps = React.HTMLAttributes<HTMLDivElement> & {
  sx?: SxProps<Theme>;
};

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['toolbarRoot'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const StyledGridToolbarRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ToolbarRoot',
  overridesResolver: (_, styles) => styles.toolbarRoot,
})<{ ownerState: OwnerState }>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.25),
  padding: theme.spacing(0, 0.5),
  minHeight: 48,
  borderBottom: `1px solid ${theme.palette.divider}`,
  overflow: 'auto',
}));

const GridToolbarRoot = React.forwardRef<HTMLDivElement, GridToolbarRootProps>(
  function GridToolbarRoot(props, ref) {
    const { className, children, ...other } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);
    if (!children) {
      return null;
    }

    return (
      <StyledGridToolbarRoot
        role="toolbar"
        ref={ref}
        className={clsx(classes.root, className)}
        ownerState={rootProps}
        {...other}
      >
        {children}
      </StyledGridToolbarRoot>
    );
  },
);

GridToolbarRoot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { GridToolbarRoot };
