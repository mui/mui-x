import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/system';
import { DataGridProcessedProps } from '@mui/x-data-grid/internals';
import { getDataGridUtilityClass, useGridRootProps } from '@mui/x-data-grid';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { ResizablePanel, ResizablePanelHandle } from '../resizablePanel';

export type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['sidebar'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const SidebarRoot = styled(ResizablePanel, {
  name: 'DataGrid',
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
