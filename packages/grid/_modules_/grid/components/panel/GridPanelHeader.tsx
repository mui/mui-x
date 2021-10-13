import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { GridComponentProps } from '../../GridComponentProps';
import { composeClasses } from '../../utils/material-ui-utils';
import { getDataGridUtilityClass } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

type OwnerState = { classes: GridComponentProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['panelHeader'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const DataGridPanelHeaderRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PanelHeader',
})(({ theme }) => ({
  padding: theme.spacing(1),
}));

export function GridPanelHeader(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>,
) {
  const { className, ...other } = props;
  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  return <DataGridPanelHeaderRoot className={clsx(className, classes.root)} {...other} />;
}
