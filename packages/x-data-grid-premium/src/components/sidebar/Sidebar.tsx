import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/system';
import { getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { ResizablePanel, ResizablePanelHandle } from '../resizablePanel';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

type OwnerState = DataGridPremiumProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['sidebar'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const SidebarRoot = styled(ResizablePanel, {
  name: 'MuiDataGrid',
  slot: 'Sidebar',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  flexDirection: 'column',
  width: 300,
  minWidth: 260,
  maxWidth: 400,
  overflow: 'hidden',
});

function Sidebar(props: SidebarProps) {
  const { className, children, ...other } = props;
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);

  return (
    <SidebarRoot className={clsx(className, classes.root)} ownerState={rootProps} {...other}>
      <ResizablePanelHandle />
      {children}
    </SidebarRoot>
  );
}

export { Sidebar };
