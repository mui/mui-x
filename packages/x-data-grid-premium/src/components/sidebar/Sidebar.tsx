import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/system';
import { getDataGridUtilityClass, useGridSelector } from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { ResizablePanel, ResizablePanelHandle } from '../resizablePanel';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridSidebarContentSelector } from '../../hooks/features/sidebar';

export type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

type OwnerState = Pick<DataGridPremiumProcessedProps, 'classes'>;

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
})({
  display: 'flex',
  flexDirection: 'column',
  width: 300,
  minWidth: 260,
  maxWidth: 400,
  overflow: 'hidden',
});

function Sidebar(props: SidebarProps) {
  const { className, children, ...other } = props;
  const apiRef = useGridApiContext();
  const { classes: rootPropsClasses } = useGridRootProps();
  const classes = useUtilityClasses({ classes: rootPropsClasses });
  const { value, sidebarId, labelId } = useGridSelector(apiRef, gridSidebarContentSelector);

  if (!value) {
    return null;
  }

  const sidebarContent = apiRef.current.unstable_applyPipeProcessors('sidebar', null, value);

  if (!sidebarContent) {
    return null;
  }

  return (
    <SidebarRoot
      id={sidebarId}
      className={clsx(className, classes.root)}
      aria-labelledby={labelId}
      {...other}
    >
      <ResizablePanelHandle />
      {sidebarContent}
    </SidebarRoot>
  );
}

export { Sidebar };
