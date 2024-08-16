import * as React from 'react';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import { SxProps, Theme } from '@mui/system';
import { styled } from '../../utils/styled';
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
})<{ ownerState: OwnerState }>({
  display: 'flex',
  flexDirection: 'column',
  borderTopLeftRadius: 'var(--unstable_DataGrid-radius)',
  borderTopRightRadius: 'var(--unstable_DataGrid-radius)',
});

interface GridBaseColumnHeadersProps extends React.HTMLAttributes<HTMLDivElement> {
  sx?: SxProps<Theme>;
}

export const GridBaseColumnHeaders = React.forwardRef<HTMLDivElement, GridBaseColumnHeadersProps>(
  function GridColumnHeaders(props, ref) {
    const { className, ...other } = props;
    const rootProps = useGridRootProps();

    const classes = useUtilityClasses(rootProps);

    return (
      <GridColumnHeadersRoot
        ref={ref}
        className={clsx(className, classes.root)}
        ownerState={rootProps}
        {...other}
        role="presentation"
      />
    );
  },
);
