'use client';
import * as React from 'react';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/material/styles';
import { GridRenderCellParams } from '../../models/params/gridCellParams';
import { getDataGridUtilityClass, gridClasses } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridRowHeightSelector } from '../../hooks/features/dimensions/gridDimensionsSelectors';
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
  boxSizing: 'border-box',
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
    [`.${gridClasses.longTextCell}:hover &, .${gridClasses.longTextCell}.Mui-focused &`]: {
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
  '&[data-popper-reference-hidden]': {
    visibility: 'hidden',
    pointerEvents: 'none',
  },
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
  const popupId = `${id}-${colDef.field}-longtext-popup`;
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const classes = useUtilityClasses(rootProps);
  const rowHeight = useGridSelector(apiRef, gridRowHeightSelector);

  const [popupOpen, setPopupOpen] = React.useState(false);
  const cellRef = React.useRef<HTMLDivElement>(null);
  const cornerButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (hasFocus && !popupOpen) {
      if (cornerButtonRef.current && cornerButtonRef.current !== document.activeElement) {
        cornerButtonRef.current.focus();
      }
    }
    if (!hasFocus) {
      setPopupOpen(false);
    }
  }, [hasFocus, popupOpen]);

  const handleExpandClick = (event: React.MouseEvent) => {
    // event.detail === 0 means keyboard-triggered click (Enter keyup on focused button)
    // Ignore these to prevent popup from opening when focus moves to this cell via Enter
    if (event.detail === 0) {
      return;
    }
    event.stopPropagation();
    setPopupOpen(true);
  };

  const handleExpandKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === ' ' && !event.shiftKey) {
      event.preventDefault(); // Prevent native button click on keyup
      event.stopPropagation(); // Prevent grid row selection
      setPopupOpen((prev) => !prev);
    }
    if (event.key === 'Escape' && popupOpen) {
      event.stopPropagation(); // Prevent grid cell navigation
      setPopupOpen(false);
    }
  };

  const handleClickAway = () => {
    setPopupOpen(false);
  };

  const handleCollapseClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setPopupOpen(false);
    apiRef.current.getCellElement(id, colDef.field)?.focus();
  };

  return (
    <GridLongTextCellRoot
      ref={cellRef}
      {...slotProps?.root}
      className={clsx(classes.root, hasFocus && 'Mui-focused', slotProps?.root?.className)}
    >
      <GridLongTextCellContent
        {...slotProps?.content}
        className={clsx(classes.content, slotProps?.content?.className)}
      >
        {value}
      </GridLongTextCellContent>
      <GridLongTextCellCornerButton
        ref={cornerButtonRef}
        aria-label={`${value}, ${apiRef.current.getLocaleText('longTextCellExpandLabel')}`}
        aria-haspopup="dialog"
        aria-controls={popupOpen ? popupId : undefined}
        aria-expanded={popupOpen}
        aria-keyshortcuts="Space"
        tabIndex={0}
        {...slotProps?.expandButton}
        className={clsx(classes.expandButton, slotProps?.expandButton?.className)}
        onClick={handleExpandClick}
        onKeyDown={handleExpandKeyDown}
      >
        <rootProps.slots.longTextCellExpandIcon fontSize="inherit" />
      </GridLongTextCellCornerButton>
      <GridLongTextCellPopper
        id={popupId}
        role="dialog"
        aria-label={colDef.headerName || colDef.field}
        as={rootProps.slots.basePopper}
        ownerState={rootProps}
        open={popupOpen}
        target={cellRef.current}
        placement="bottom-start"
        onClickAway={handleClickAway}
        clickAwayMouseEvent="onMouseDown"
        flip
        material={{
          container: cellRef.current?.closest('[role="row"]'),
          modifiers: [
            {
              name: 'offset',
              options: { offset: [-10, -rowHeight] },
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
            aria-keyshortcuts="Escape"
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
