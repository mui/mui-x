import * as React from 'react';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { styled, alpha, lighten, darken } from '@mui/material/styles';
import { getDataGridUtilityClass } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridComponentProps } from '../../GridComponentProps';

type OwnerState = {
  classes?: GridComponentProps['classes'];
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
  };
});

interface GridColumnHeadersProps extends React.HTMLAttributes<HTMLDivElement> {
  innerRef?: React.Ref<HTMLDivElement>;
}

export const GridColumnHeaders = React.forwardRef<HTMLDivElement, GridColumnHeadersProps>(
  function GridColumnHeaders(props, ref) {
    const { innerRef, className, ...other } = props;
    const rootProps = useGridRootProps();

    const ownerState = { classes: rootProps.classes };
    const classes = useUtilityClasses(ownerState);

    return <GridColumnHeadersRoot ref={ref} className={clsx(className, classes.root)} {...other} />;
  },
);
