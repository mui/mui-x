import * as React from 'react';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { styled, SxProps, Theme } from '@mui/system';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['columnHeaders', 'withBorderColor'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridColumnHeadersRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnHeaders',
  overridesResolver: (props, styles) => styles.columnHeaders,
})<{ ownerState: OwnerState }>({
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  boxSizing: 'border-box',
  borderBottom: '1px solid',
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
