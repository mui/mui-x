'use client';
import * as React from 'react';
import clsx from 'clsx';
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
    collapseButton: ['longTextCellCollapseButton'],
    popup: ['longTextCellPopup'],
    popperContent: ['longTextCellPopperContent'],
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

const GridLongTextCellPopperContent = styled('div', {
  name: 'MuiDataGrid',
  slot: 'LongTextCellPopperContent',
})(({ theme }) => ({
  ...theme.typography.body2,
  letterSpacing: 'normal',
  paddingBlock: 15.5,
  paddingInline: 9,
  maxHeight: 52 * 3,
  overflow: 'auto',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  width: 'var(--_width)',
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const GridLongTextCellCornerButton = styled('button', {
  name: 'MuiDataGrid',
  slot: 'LongTextCellCornerButton',
})(({ theme }) => ({
  lineHeight: 0,
  position: 'absolute',
  bottom: 1,
  right: 0,
  border: '1px solid',
  color: (theme.vars || theme).palette.text.secondary,
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  borderRadius: 0,
  fontSize: '0.875rem',
  padding: 2,
  '&:focus-visible': {
    outline: 'none',
  },
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.background.paper,
    color: (theme.vars || theme).palette.text.primary,
  },
  [`&.${gridClasses.longTextCellExpandButton}`]: {
    right: -9,
    opacity: 0,
    [`.${gridClasses.longTextCell}:hover &`]: {
      opacity: 1,
    },
  },
  [`&.${gridClasses.longTextCellCollapseButton}`]: {
    bottom: 2,
    right: 2,
    border: 'none',
  },
}));

const GridLongTextCellPopper = styled(NotRendered<GridSlotProps['basePopper']>, {
  name: 'MuiDataGrid',
  slot: 'LongTextCellPopper',
})<{ ownerState: OwnerState }>(({ theme }) => ({
  zIndex: vars.zIndex.menu,
  background: (theme.vars || theme).palette.background.paper,
}));

export interface GridLongTextCellProps extends GridRenderCellParams<any, string | null> {
  /**
   * A function to customize the content rendered in the popup.
   * @param {string | null} value The cell value.
   * @returns {React.ReactNode} The content to render in the popup.
   */
  renderContent?: (value: string | null) => React.ReactNode;
  /**
   * Props passed to internal components.
   */
  slotProps?: {
    /**
     * Props passed to the root element.
     */
    root?: React.HTMLAttributes<HTMLDivElement>;
    /**
     * Props passed to the content element.
     */
    content?: React.HTMLAttributes<HTMLDivElement>;
    /**
     * Props passed to the expand button element.
     */
    expandButton?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    /**
     * Props passed to the collapse button element.
     */
    collapseButton?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    /**
     * Props passed to the popper element.
     */
    popper?: Partial<GridSlotProps['basePopper']>;
    /**
     * Props passed to the popper content element.
     */
    popperContent?: React.HTMLAttributes<HTMLDivElement>;
  };
}

function GridLongTextCell(props: GridLongTextCellProps) {
  const { id, value = '', colDef, hasFocus, slotProps, renderContent } = props;
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const classes = useUtilityClasses(rootProps);

  const [popupOpen, setPopupOpen] = React.useState(false);
  const cellRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!hasFocus) {
      setPopupOpen(false);
    }
  }, [hasFocus]);

  // Close popup when cell scrolls out of view
  React.useEffect(() => {
    if (!popupOpen) {
      return undefined;
    }
    const unsubscribeRows = apiRef.current.subscribeEvent(
      'renderedRowsIntervalChange',
      (context) => {
        const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(id);
        if (rowIndex < context.firstRowIndex || rowIndex >= context.lastRowIndex) {
          setPopupOpen(false);
        }
      },
    );
    const unsubscribeCols = apiRef.current.subscribeEvent('scrollPositionChange', (params) => {
      if (params.renderContext) {
        const colIndex = apiRef.current.getColumnIndexRelativeToVisibleColumns(colDef.field);
        if (
          colIndex < params.renderContext.firstColumnIndex ||
          colIndex >= params.renderContext.lastColumnIndex
        ) {
          setPopupOpen(false);
        }
      }
    });
    return () => {
      unsubscribeRows();
      unsubscribeCols();
    };
  }, [apiRef, id, colDef.field, popupOpen]);

  const handleExpandClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setPopupOpen(true);
  };

  const handleClickAway = () => {
    setPopupOpen(false);
  };

  const handleCollapseClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setPopupOpen(false);
    apiRef.current.getCellElement(id, colDef.field)?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && popupOpen) {
      setPopupOpen(false);
      event.stopPropagation();
    }
  };

  return (
    <GridLongTextCellRoot
      ref={cellRef}
      {...slotProps?.root}
      className={clsx(classes.root, slotProps?.root?.className)}
      onKeyDown={handleKeyDown}
    >
      <GridLongTextCellContent
        {...slotProps?.content}
        className={clsx(classes.content, slotProps?.content?.className)}
      >
        {value}
      </GridLongTextCellContent>
      <GridLongTextCellCornerButton
        aria-label={apiRef.current.getLocaleText('longTextCellExpandLabel')}
        tabIndex={-1}
        {...slotProps?.expandButton}
        className={clsx(classes.expandButton, slotProps?.expandButton?.className)}
        onClick={handleExpandClick}
      >
        <rootProps.slots.longTextCellExpandIcon fontSize="inherit" />
      </GridLongTextCellCornerButton>
      <GridLongTextCellPopper
        as={rootProps.slots.basePopper}
        ownerState={rootProps}
        open={popupOpen}
        target={cellRef.current}
        placement="bottom-start"
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
        {...slotProps?.popper}
        className={clsx(classes.popup, slotProps?.popper?.className)}
      >
        {/* Required React element as a child because `rootProps.slots.basePopper` uses ClickAwayListener internally */}
        <GridLongTextCellPopperContent
          tabIndex={-1}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.stopPropagation();
              setPopupOpen(false);
              apiRef.current.getCellElement(id, colDef.field)?.focus();
            }
          }}
          {...slotProps?.popperContent}
          className={clsx(classes.popperContent, slotProps?.popperContent?.className)}
          style={
            {
              '--_width': `${colDef.computedWidth}px`,
              ...slotProps?.popperContent?.style,
            } as React.CSSProperties
          }
        >
          {renderContent ? renderContent(value) : value}
          <GridLongTextCellCornerButton
            aria-label={apiRef.current.getLocaleText('longTextCellCollapseLabel')}
            {...slotProps?.collapseButton}
            className={clsx(classes.collapseButton, slotProps?.collapseButton?.className)}
            onClick={handleCollapseClick}
          >
            <rootProps.slots.longTextCellCollapseIcon fontSize="inherit" />
          </GridLongTextCellCornerButton>
        </GridLongTextCellPopperContent>
      </GridLongTextCellPopper>
    </GridLongTextCellRoot>
  );
}

export { GridLongTextCell };

export const renderLongTextCell = (params: GridLongTextCellProps) => (
  <GridLongTextCell {...params} />
);
