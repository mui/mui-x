import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { getDataGridUtilityClass } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

type OwnerState = { classes: DataGridProcessedProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['panelFooter'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridPanelFooterRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PanelFooter',
  overridesResolver: (props, styles) => styles.panelFooter,
})(({ theme }) => ({
  padding: theme.spacing(0.5),
  display: 'flex',
  justifyContent: 'space-between',
}));

export function GridPanelFooter(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>,
) {
  const { className, ...other } = props;
  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  return <GridPanelFooterRoot className={clsx(className, classes.root)} {...other} />;
}
