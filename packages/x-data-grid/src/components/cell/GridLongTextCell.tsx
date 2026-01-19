'use client';
import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/material/styles';
import { GridRenderCellParams } from '../../models/params/gridCellParams';
import { getDataGridUtilityClass, gridClasses } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { NotRendered } from '../../utils/assert';
import { GridSlotProps } from '../../models/gridSlotsComponent';
import { vars } from '../../constants/cssVariables';

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['longTextCell'],
    content: ['longTextCellContent'],
    expandButton: ['longTextCellExpandButton'],
    popup: ['longTextCellPopup'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridLongTextCellRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'LongTextCell',
})({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  position: 'relative',
});

const GridLongTextCellContent = styled('div', {
  name: 'MuiDataGrid',
  slot: 'LongTextCellContent',
})({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: 1,
});

const GridLongTextCellPopupContent = styled('div', {
  name: 'MuiDataGrid',
  slot: 'LongTextCellPopupContent',
})(({ theme }) => ({
  ...theme.typography.body2,
  letterSpacing: 'normal',
  padding: '15.5px 9px',
  maxHeight: 52 * 3,
  overflow: 'auto',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  width: 'var(--_width)',
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const GridLongTextCellExpandButtonRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'LongTextCellExpandButton',
})(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  right: 0,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  borderRadius: 0,
  '& .MuiIconButton-root': {
    padding: 2,
    borderRadius: 0,
  },
}));

const GridLongTextCellPopper = styled(NotRendered<GridSlotProps['basePopper']>, {
  name: 'MuiDataGrid',
  slot: 'LongTextCellPopper',
})<{ ownerState: OwnerState }>(({ theme }) => ({
  zIndex: vars.zIndex.menu,
  background: (theme.vars || theme).palette.background.paper,
}));

export interface GridLongTextCellProps extends GridRenderCellParams<any, string | null> {}

function GridLongTextCell(props: GridLongTextCellProps) {
  const { id, field, value = '', colDef, hasFocus } = props;
  // Access disableAutoExpand from colDef (custom property)
  const disableAutoExpand = (colDef as any).disableAutoExpand ?? false;
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const classes = useUtilityClasses(rootProps);

  const [hovered, setHovered] = React.useState(false);
  const [manualPopupOpen, setManualPopupOpen] = React.useState(false);
  const cellRef = React.useRef<HTMLDivElement>(null);

  // Auto-expand popup when cell is focused (unless disabled)
  const autoPopupOpen = !disableAutoExpand && hasFocus;
  const popupOpen = autoPopupOpen || manualPopupOpen;

  // Close manual popup when focus moves away
  React.useEffect(() => {
    if (!hasFocus && manualPopupOpen) {
      setManualPopupOpen(false);
      setHovered(false);
    }
  }, [hasFocus, manualPopupOpen]);

  // Close popup when row scrolls out of view
  React.useEffect(() => {
    return apiRef.current.subscribeEvent('renderedRowsIntervalChange', (context) => {
      const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(id);
      if (rowIndex < context.firstRowIndex || rowIndex >= context.lastRowIndex) {
        setManualPopupOpen(false);
        setHovered(false);
      }
    });
  }, [apiRef, id]);

  const handleExpandClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setManualPopupOpen(true);
  };

  const handleClickAway = () => {
    if (manualPopupOpen) {
      setManualPopupOpen(false);
      setHovered(false);
    }
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    if (!manualPopupOpen) {
      setHovered(false);
    }
  };

  const showExpandButton = disableAutoExpand && hovered && !manualPopupOpen;

  return (
    <GridLongTextCellRoot
      ref={cellRef}
      className={classes.root}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <GridLongTextCellContent className={classes.content}>{value}</GridLongTextCellContent>
      {showExpandButton && (
        <GridLongTextCellExpandButtonRoot className={classes.expandButton}>
          <rootProps.slots.baseIconButton size="small" onClick={handleExpandClick}>
            <rootProps.slots.longTextCellExpandIcon />
          </rootProps.slots.baseIconButton>
        </GridLongTextCellExpandButtonRoot>
      )}
      <GridLongTextCellPopper
        as={rootProps.slots.basePopper}
        ownerState={rootProps}
        open={popupOpen}
        target={cellRef.current}
        placement="bottom-start"
        className={classes.popup}
        onClickAway={handleClickAway}
        clickAwayMouseEvent="onMouseDown"
        flip
        material={{
          modifiers: [
            {
              name: 'offset',
              options: { offset: [-10, -1 - (cellRef.current?.offsetHeight ?? 0)] },
            },
          ],
        }}
      >
        <GridLongTextCellPopupContent
          sx={{
            '--_width': `calc(${colDef.computedWidth}px + 7ch)`, // the extra 7ch accounts for ellipsis word
          }}
        >
          {value}
        </GridLongTextCellPopupContent>
      </GridLongTextCellPopper>
    </GridLongTextCellRoot>
  );
}

export { GridLongTextCell };

export const renderLongTextCell = (params: GridLongTextCellProps) => (
  <GridLongTextCell {...params} />
);
