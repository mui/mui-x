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
import { isMultiSelectColDef, getValueOptions } from '../panel/filterPanel/filterPanelUtils';
import { GridMultiSelectColDef, ValueOptions } from '../../models/colDef/gridColDef';

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['multiSelectCell'],
    chip: ['multiSelectCellChip'],
    overflow: ['multiSelectCellOverflow'],
    popup: ['multiSelectCellPopup'],
    popperContent: ['multiSelectCellPopperContent'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridMultiSelectCellRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'MultiSelectCell',
})({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  gap: 4,
  overflow: 'hidden',
  position: 'relative',
});

const GridMultiSelectCellPopperContent = styled('div', {
  name: 'MuiDataGrid',
  slot: 'MultiSelectCellPopperContent',
})(({ theme }) => ({
  ...theme.typography.body2,
  letterSpacing: 'normal',
  padding: theme.spacing(1),
  maxHeight: 52 * 4,
  overflow: 'auto',
  width: 'var(--_width)',
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  boxSizing: 'border-box',
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
}));

const GridMultiSelectCellPopper = styled(NotRendered<GridSlotProps['basePopper']>, {
  name: 'MuiDataGrid',
  slot: 'MultiSelectCellPopper',
})<{ ownerState: OwnerState }>(({ theme }) => ({
  zIndex: vars.zIndex.menu,
  background: (theme.vars || theme).palette.background.paper,
  '&[data-popper-reference-hidden]': {
    visibility: 'hidden',
    pointerEvents: 'none',
  },
}));

export interface GridMultiSelectCellProps extends GridRenderCellParams {
  /**
   * Props passed to internal components.
   */
  slotProps?: {
    /**
     * Props passed to the root element.
     */
    root?: React.HTMLAttributes<HTMLDivElement>;
    /**
     * Props passed to the chip elements.
     */
    chip?: Partial<GridSlotProps['baseChip']>;
    /**
     * Props passed to the overflow chip element.
     */
    overflowChip?: Partial<GridSlotProps['baseChip']>;
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

function getOptionLabel(
  colDef: GridMultiSelectColDef,
  value: any,
  valueOptions: Array<ValueOptions> | undefined,
): string {
  if (!valueOptions) {
    return colDef.getOptionLabel!(value);
  }

  const valueOption = valueOptions.find((option) => colDef.getOptionValue!(option) === value);
  return valueOption ? colDef.getOptionLabel!(valueOption) : String(value);
}

function GridMultiSelectCell(props: GridMultiSelectCellProps) {
  const { id, value, colDef, hasFocus, row, slotProps } = props;
  const popupId = `${id}-${colDef.field}-multiselect-popup`;
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const classes = useUtilityClasses(rootProps);
  const rowHeight = useGridSelector(apiRef, gridRowHeightSelector);

  const [popupOpen, setPopupOpen] = React.useState(false);
  const [visibleCount, setVisibleCount] = React.useState<number | null>(null);
  const cellRef = React.useRef<HTMLDivElement>(null);
  const chipsRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const overflowChipRef = React.useRef<HTMLDivElement>(null);

  const arrayValue = Array.isArray(value) ? value : [];
  const valueOptions = isMultiSelectColDef(colDef) ? getValueOptions(colDef, { id, row }) : [];

  // Measure chips and calculate visible count
  React.useEffect(() => {
    if (!cellRef.current || arrayValue.length === 0) {
      setVisibleCount(null);
      return undefined;
    }

    // Skip ResizeObserver if not available (e.g., in JSDOM test environment)
    if (typeof ResizeObserver === 'undefined') {
      setVisibleCount(arrayValue.length);
      return undefined;
    }

    const calculateVisibleChips = () => {
      const container = cellRef.current;
      if (!container) {
        return;
      }

      const containerWidth = container.clientWidth;
      const gap = 4;
      const overflowChipWidth = 40; // approximate width for "+N" chip

      let usedWidth = 0;
      let count = 0;

      for (let i = 0; i < arrayValue.length; i += 1) {
        const chipEl = chipsRef.current.get(i);
        if (!chipEl) {
          continue;
        }

        const chipWidth = chipEl.offsetWidth;
        const spaceNeeded =
          usedWidth + chipWidth + (count > 0 ? gap : 0) + (i < arrayValue.length - 1 ? overflowChipWidth + gap : 0);

        if (spaceNeeded <= containerWidth || i === 0) {
          usedWidth += chipWidth + (count > 0 ? gap : 0);
          count += 1;
        } else {
          break;
        }
      }

      setVisibleCount(count);
    };

    // Initial calculation after render
    const timeoutId = setTimeout(calculateVisibleChips, 0);

    const observer = new ResizeObserver(calculateVisibleChips);
    observer.observe(cellRef.current);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [arrayValue]);

  React.useEffect(() => {
    if (!hasFocus) {
      setPopupOpen(false);
    }
  }, [hasFocus]);

  const handleOverflowClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setPopupOpen(true);
  };

  const handleOverflowKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === ' ' && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();
      setPopupOpen((prev) => !prev);
    }
    if (event.key === 'Escape' && popupOpen) {
      event.stopPropagation();
      setPopupOpen(false);
    }
  };

  const handleClickAway = () => {
    setPopupOpen(false);
  };

  if (arrayValue.length === 0) {
    return null;
  }

  const displayCount = visibleCount ?? arrayValue.length;
  const hiddenCount = arrayValue.length - displayCount;

  return (
    <GridMultiSelectCellRoot
      ref={cellRef}
      {...slotProps?.root}
      className={clsx(classes.root, hasFocus && 'Mui-focused', slotProps?.root?.className)}
    >
      {arrayValue.slice(0, displayCount).map((v, index) => (
        <rootProps.slots.baseChip
          key={index}
          ref={(el: HTMLDivElement) => {
            if (el) {
              chipsRef.current.set(index, el);
            } else {
              chipsRef.current.delete(index);
            }
          }}
          label={getOptionLabel(colDef as GridMultiSelectColDef, v, valueOptions)}
          size="small"
          {...slotProps?.chip}
          className={clsx(classes.chip, slotProps?.chip?.className)}
        />
      ))}
      {hiddenCount > 0 && (
        <rootProps.slots.baseChip
          ref={overflowChipRef}
          label={`+${hiddenCount}`}
          size="small"
          variant="outlined"
          onClick={handleOverflowClick}
          onKeyDown={handleOverflowKeyDown}
          aria-haspopup="dialog"
          aria-controls={popupOpen ? popupId : undefined}
          aria-expanded={popupOpen}
          material={{ tabIndex: hasFocus ? 0 : -1 }}
          {...slotProps?.overflowChip}
          className={clsx(classes.overflow, slotProps?.overflowChip?.className)}
        />
      )}
      {popupOpen && (
        <GridMultiSelectCellPopper
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
          <GridMultiSelectCellPopperContent
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
            {arrayValue.map((v, index) => (
              <rootProps.slots.baseChip
                key={index}
                label={getOptionLabel(colDef as GridMultiSelectColDef, v, valueOptions)}
                size="small"
                {...slotProps?.chip}
                className={clsx(classes.chip, slotProps?.chip?.className)}
              />
            ))}
          </GridMultiSelectCellPopperContent>
        </GridMultiSelectCellPopper>
      )}
    </GridMultiSelectCellRoot>
  );
}

export { GridMultiSelectCell };

export const renderMultiSelectCell = (params: GridMultiSelectCellProps) => (
  <GridMultiSelectCell {...params} />
);
