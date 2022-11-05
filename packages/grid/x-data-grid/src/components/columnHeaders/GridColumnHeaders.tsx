import * as React from 'react';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { styled, alpha, lighten, darken, SxProps, Theme } from '@mui/material/styles';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['columnHeaders'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridColumnHeadersRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnHeaders',
  overridesResolver: (props, styles) => styles.columnHeaders,
})<{ ownerState: OwnerState }>(({ theme }) => {
  const borderColor =
    theme.palette.mode === 'light'
      ? lighten(alpha(theme.palette.divider, 1), 0.88)
      : darken(alpha(theme.palette.divider, 1), 0.68);

  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    borderBottom: `1px solid ${borderColor}`,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
  };
});

interface GridColumnHeadersProps extends React.HTMLAttributes<HTMLDivElement> {
  sx?: SxProps<Theme>;
}

export const GridColumnHeaders = React.forwardRef<HTMLDivElement, GridColumnHeadersProps>(
  function GridColumnHeaders(props, ref) {
    const { className, ...other } = props;
    const rootProps = useGridRootProps();

    const ownerState = rootProps;
    const classes = useUtilityClasses(ownerState);

    return (
      <GridColumnHeadersRoot
        ref={ref}
        className={clsx(className, classes.root)}
        ownerState={ownerState}
        {...other}
      />
    );
  },
);
