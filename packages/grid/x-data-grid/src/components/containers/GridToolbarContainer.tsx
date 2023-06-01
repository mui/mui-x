import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { alpha, styled, darken, lighten, Theme, SxProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export type GridToolbarContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  sx?: SxProps<Theme>;
};

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['toolbarContainer'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};
function getBorderColor(theme: Theme) {
  if (theme.vars) {
    return theme.vars.palette.TableCell.border;
  }
  if (theme.palette.mode === 'light') {
    return lighten(alpha(theme.palette.divider, 1), 0.88);
  }
  return darken(alpha(theme.palette.divider, 1), 0.68);
}

const GridToolbarContainerRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ToolbarContainer',
  overridesResolver: (_, styles) => styles.toolbarContainer,
})<{ ownerState: OwnerState }>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  padding: theme.spacing(0.5, 0.5, 0.5),
  borderBottom: `1px solid ${getBorderColor(theme)}`,
}));

const GridToolbarContainer = React.forwardRef<HTMLDivElement, GridToolbarContainerProps>(
  function GridToolbarContainer(props, ref) {
    const { className, children, ...other } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);
    if (!children) {
      return null;
    }

    return (
      <GridToolbarContainerRoot
        ref={ref}
        className={clsx(className, classes.root)}
        ownerState={rootProps}
        {...other}
      >
        {children}
      </GridToolbarContainerRoot>
    );
  },
);

GridToolbarContainer.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { GridToolbarContainer };
