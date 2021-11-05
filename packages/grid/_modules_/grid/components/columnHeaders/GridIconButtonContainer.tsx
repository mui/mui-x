import * as React from 'react';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getDataGridUtilityClass } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridComponentProps } from '../../GridComponentProps';

export type GridIconButtonContainerProps = React.HTMLAttributes<HTMLDivElement>;

type OwnerState = { classes: GridComponentProps['classes'] };

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
})(() => ({
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
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  return (
    <GridIconButtonContainerRoot ref={ref} className={clsx(classes.root, className)} {...other} />
  );
});
