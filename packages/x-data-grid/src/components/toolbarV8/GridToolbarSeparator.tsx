import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, SxProps, Theme } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import clsx from 'clsx';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export interface GridToolbarSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  sx?: SxProps<Theme>;
}

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['toolbarSeparator'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const Separator = styled('div', {
  name: 'MuiDataGrid',
  slot: 'Separator',
  overridesResolver: (_, styles) => styles.separator,
})<{ ownerState: OwnerState }>(({ theme }) => ({
  height: 24,
  width: 1,
  margin: theme.spacing(0.25),
  backgroundColor: theme.palette.divider,
}));

// TODO: This should be a divider component from Material UI
function GridToolbarSeparator(props: GridToolbarSeparatorProps) {
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);
  const { className, ...other } = props;

  return (
    <Separator
      ownerState={rootProps}
      className={clsx(classes.root, className)}
      role="separator"
      aria-orientation="vertical"
      {...other}
    />
  );
}

GridToolbarSeparator.propTypes = {
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

export { GridToolbarSeparator };
