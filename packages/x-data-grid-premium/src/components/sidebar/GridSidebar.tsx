import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/system';
import { DataGridProcessedProps, vars } from '@mui/x-data-grid/internals';
import { getDataGridUtilityClass, useGridRootProps } from '@mui/x-data-grid';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useResize } from '../../hooks/utils/useResize';

export type GridSidebarProps = React.HTMLAttributes<HTMLDivElement>;

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['sidebar'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const ResizeHandle = styled('div')({
  position: 'absolute',
  zIndex: 2,
  top: 0,
  left: 0,
  height: '100%',
  width: 6,
  cursor: 'ew-resize',
  borderLeft: `1px solid ${vars.colors.border.base}`,
  transition: 'border-left 0.1s ease-in-out',
  userSelect: 'none',
  touchAction: 'pan-x',
  '&:hover': {
    borderLeft: `2px solid ${vars.colors.interactive.selected}`,
  },
});

const GridSidebarRoot = styled('div', {
  name: 'DataGrid',
  slot: 'Sidebar',
  overridesResolver: (_, styles) => styles.sidebar,
})<{ ownerState: OwnerState }>({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: 300,
  minWidth: 180,
  maxWidth: 400,
  overflow: 'hidden',
});

export function GridSidebar(props: GridSidebarProps) {
  const { className, children, ...other } = props;
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);
  const { ref } = useResize({
    getInitialSize: (handle) => {
      return handle.parentElement!.offsetWidth;
    },
    onSizeChange: (newSize, handle) => {
      handle.parentElement!.style.width = `${newSize}px`;
    },
  });

  return (
    <GridSidebarRoot className={clsx(className, classes.root)} ownerState={rootProps} {...other}>
      <ResizeHandle ref={ref} />
      {children}
    </GridSidebarRoot>
  );
}
