import * as React from 'react';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '../../utils/styled';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';

export type GridIconButtonContainerProps = React.HTMLAttributes<HTMLDivElement>;

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['iconButtonContainer'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridIconButtonContainerRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'IconButtonContainer',
  overridesResolver: (props, styles) => styles.iconButtonContainer,
})<{ ownerState: OwnerState }>(() => ({
  display: 'flex',
  visibility: 'hidden',
  width: 0,
}));

export const GridIconButtonContainer = React.forwardRef<
  HTMLDivElement,
  GridIconButtonContainerProps
>(function GridIconButtonContainer(props: GridIconButtonContainerProps, ref) {
  const { className, ...other } = props;
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);

  return (
    <GridIconButtonContainerRoot
      ref={ref}
      className={clsx(classes.root, className)}
      ownerState={rootProps}
      {...other}
    />
  );
});
