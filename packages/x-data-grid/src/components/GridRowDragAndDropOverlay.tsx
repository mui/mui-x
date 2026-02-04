'use client';
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import { shouldForwardProp } from '@mui/system/createStyled';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import { gridRowDropPositionSelector } from '../hooks/features/rowReorder/gridRowReorderSelector';
import type { GridRowId } from '../models/gridRows';
import type { RowReorderDropPosition } from '../models/api/gridRowApi';

export interface GridRowDragAndDropOverlayProps {
  rowId: GridRowId;
  className?: string;
}

const GridRowDragAndDropOverlayRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'RowDragOverlay',
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'action',
})<{ action: RowReorderDropPosition }>(({ theme, action }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  pointerEvents: 'none',
  zIndex: 1,

  ...(action === 'above' && {
    '&::before': {
      pointerEvents: 'none',
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '2px',
      backgroundColor: (theme.vars || theme).palette.primary.main,
    },
  }),

  ...(action === 'below' && {
    '&::after': {
      pointerEvents: 'none',
      content: '""',
      position: 'absolute',
      bottom: '-2px',
      left: 0,
      right: 0,
      height: '2px',
      backgroundColor: (theme.vars || theme).palette.primary.main,
    },
  }),

  ...(action === 'inside' && {
    backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.primary.mainChannel} / 0.1)`
      : alpha(theme.palette.primary.main, 0.1),
  }),
}));

export const GridRowDragAndDropOverlay = React.memo(function GridRowDragAndDropOverlay(
  props: GridRowDragAndDropOverlayProps,
) {
  const { rowId, className } = props;
  const apiRef = useGridPrivateApiContext();
  const dropPosition = useGridSelector(apiRef, gridRowDropPositionSelector, rowId);

  if (!dropPosition) {
    return null;
  }

  return <GridRowDragAndDropOverlayRoot action={dropPosition} className={className} />;
});
