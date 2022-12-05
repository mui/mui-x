import * as React from 'react';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { styled, SxProps, Theme } from '@mui/material/styles';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { getBorderColor } from '../../utils/styleUtils';

type OwnerState = {
  classes?: DataGridProcessedProps['classes'];
};

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
})(({ theme }) => {
  // eslint-disable-next-line no-nested-ternary
  const borderColor = getBorderColor(theme);

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

    const ownerState = { classes: rootProps.classes };
    const classes = useUtilityClasses(ownerState);

    return <GridColumnHeadersRoot ref={ref} className={clsx(className, classes.root)} {...other} />;
  },
);
