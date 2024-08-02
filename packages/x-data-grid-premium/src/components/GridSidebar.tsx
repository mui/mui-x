import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useGridSelector } from '@mui/x-data-grid/internals';
import { gridDimensionsSelector, useGridRootProps } from '@mui/x-data-grid';
import { IconButtonProps } from '@mui/material/IconButton';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useResize } from '../hooks/utils/useResize';

const ResizeHandle = styled('div')(({ theme }) => ({
  position: 'absolute',
  zIndex: 2,
  top: 0,
  left: 0,
  height: '100%',
  width: 6,
  cursor: 'ew-resize',
  borderLeft: '1px solid var(--DataGrid-rowBorderColor)',
  transition: 'border-left 0.1s ease-in-out',
  userSelect: 'none',
  touchAction: 'pan-x',
  '&:hover': {
    borderLeft: `2px solid ${theme.palette.primary.main}`,
  },
}));

const GridSidebarStyled = styled('div')({
  width: 300,
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
});

export interface GridSidebarProps {
  children: React.ReactNode;
}

export function GridSidebar(props: GridSidebarProps) {
  const { children } = props;
  const { ref } = useResize({
    getInitialWidth: (handle) => {
      return handle.parentElement!.offsetWidth;
    },
    onWidthChange: (newWidth, handle) => {
      handle.parentElement!.style.width = `${newWidth}px`;
    },
  });

  return (
    <GridSidebarStyled>
      <ResizeHandle ref={ref as any} />
      {children}
    </GridSidebarStyled>
  );
}

// TODO: Figure out what the types should be for this component
// If users can provide a custom icon button, this could be something other than IconButtonProps
export function GridSidebarCloseButton(props: IconButtonProps) {
  const rootProps = useGridRootProps();
  const { slots } = rootProps;

  return (
    <slots.baseIconButton sx={{ ml: 'auto', mr: -1 }} {...props}>
      <slots.filterPanelDeleteIcon fontSize="small" />
    </slots.baseIconButton>
  );
}

const GridSidebarHeaderStyled = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: 0,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export interface GridSidebarHeaderProps {
  children: React.ReactNode;
}

export function GridSidebarHeader(props: GridSidebarHeaderProps) {
  const { children } = props;
  const apiRef = useGridApiContext();
  const dimensions = useGridSelector(apiRef, gridDimensionsSelector);

  return (
    <GridSidebarHeaderStyled style={{ height: dimensions.headerHeight }}>
      {children}
    </GridSidebarHeaderStyled>
  );
}
