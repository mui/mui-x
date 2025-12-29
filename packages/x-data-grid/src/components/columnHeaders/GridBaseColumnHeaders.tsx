import * as React from 'react';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import { styled, SxProps, Theme } from '@mui/system';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';

type OwnerState = Pick<DataGridProcessedProps, 'classes'>;

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
})({
  display: 'flex',
  flexDirection: 'column',
  borderTopLeftRadius: 'var(--unstable_DataGrid-radius)',
  borderTopRightRadius: 'var(--unstable_DataGrid-radius)',
});

interface GridBaseColumnHeadersProps extends React.HTMLAttributes<HTMLDivElement> {
  sx?: SxProps<Theme>;
}

export const GridBaseColumnHeaders = forwardRef<HTMLDivElement, GridBaseColumnHeadersProps>(
  function GridColumnHeaders(props, ref) {
    const { className, ...other } = props;
    const { classes: rootPropsClasses } = useGridRootProps();

    const classes = useUtilityClasses({ classes: rootPropsClasses });

    return (
      <GridColumnHeadersRoot
        className={clsx(classes.root, className)}
        {...other}
        role="presentation"
        ref={ref}
      />
    );
  },
);
