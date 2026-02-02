'use client';
import * as React from 'react';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/material/styles';
import type { GridRenderCellParams } from '../../models/params/gridCellParams';
import { getDataGridUtilityClass, gridClasses } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridRowHeightSelector } from '../../hooks/features/dimensions/gridDimensionsSelectors';
import { gridFilterModelSelector } from '../../hooks/features/filter/gridFilterSelector';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { NotRendered } from '../../utils/assert';
import type { GridSlotProps } from '../../models/gridSlotsComponent';
import { vars } from '../../constants/cssVariables';
import { isMultiSelectColDef, getValueOptions } from '../panel/filterPanel/filterPanelUtils';
import type { GridMultiSelectColDef, ValueOptions } from '../../models/colDef/gridColDef';
import { calculateVisibleCount } from '../../utils/multiSelectCellUtils';

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['multiSelectCell'],
    chip: ['multiSelectCellChip'],
    chipHidden: ['multiSelectCellChip--hidden'],
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

const GridMultiSelectCellChip = styled(NotRendered<GridSlotProps['baseChip']>, {
  name: 'MuiDataGrid',
  slot: 'MultiSelectCellChip',
})<{ ownerState: OwnerState }>({
  [`&.${gridClasses['multiSelectCellChip--hidden']}`]: {
    display: 'none',
  },
});

const GridMultiSelectCellOverflow = styled(NotRendered<GridSlotProps['baseChip']>, {
  name: 'MuiDataGrid',
  slot: 'MultiSelectCellChip',
})<{ ownerState: OwnerState }>();

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
  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);

  const [popupOpen, setPopupOpen] = React.useState(false);
  // Track how many chips have been measured
  const [measuredCount, setMeasuredCount] = React.useState(0);
  // Track container width for visible count calculation
  const [containerWidth, setContainerWidth] = React.useState<number | null>(null);

  const cellRef = React.useRef<HTMLDivElement>(null);
  const chipsRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  // Cache chip widths so we can calculate visible chips even when some aren't rendered
  const chipWidthsRef = React.useRef<Map<number, number>>(new Map());
  const overflowChipRef = React.useRef<HTMLDivElement>(null);

  const valueOptions = isMultiSelectColDef(colDef) ? getValueOptions(colDef, { id, row }) : [];

  // Reorder array to show filtered value first (improves UX when filtering)
  const arrayValue = React.useMemo(() => {
    const rawArrayValue = Array.isArray(value) ? value : [];
    if (rawArrayValue.length === 0) {
      return rawArrayValue;
    }
    const activeFilter = filterModel.items.find(
      (item) => item.field === colDef.field && item.operator === 'contains' && item.value != null,
    );
    if (!activeFilter) {
      return rawArrayValue;
    }
    const filterValue = activeFilter.value;
    const index = rawArrayValue.indexOf(filterValue);
    if (index <= 0) {
      // Already first or not found
      return rawArrayValue;
    }
    // Move filtered value to front
    const reordered = [...rawArrayValue];
    reordered.splice(index, 1);
    reordered.unshift(filterValue);
    return reordered;
  }, [value, filterModel.items, colDef.field]);

  // Create a stable key for the array values to detect when chips need remeasuring
  const arrayKey = React.useMemo(() => arrayValue.join('\0'), [arrayValue]);

  // Store previous computedWidth to detect column resize
  const prevComputedWidthRef = React.useRef(colDef.computedWidth);
  // Track previous arrayKey to detect actual changes (not initial mount)
  const prevArrayKeyRef = React.useRef<string | null>(null);

  // Clear chip width cache when array values change
  React.useEffect(() => {
    // Skip on initial mount - state is already fresh
    // Only reset when arrayKey actually changes
    if (prevArrayKeyRef.current !== null && prevArrayKeyRef.current !== arrayKey) {
      chipWidthsRef.current.clear();
      setMeasuredCount(0);
      setContainerWidth(null);
    }
    prevArrayKeyRef.current = arrayKey;
  }, [arrayKey]);

  // Update container width when column is resized
  React.useEffect(() => {
    if (containerWidth !== null && prevComputedWidthRef.current !== colDef.computedWidth) {
      const delta = colDef.computedWidth - prevComputedWidthRef.current;
      setContainerWidth((prev) => (prev !== null ? prev + delta : null));
    }
    prevComputedWidthRef.current = colDef.computedWidth;
  }, [colDef.computedWidth, containerWidth]);

  // Measure chips and container width after render (synchronous to avoid flicker)
  React.useLayoutEffect(() => {
    // Measure container width once
    if (containerWidth === null && cellRef.current) {
      setContainerWidth(cellRef.current.clientWidth);
    }

    let newMeasurements = 0;
    chipsRef.current.forEach((chipEl, index) => {
      if (chipEl && !chipWidthsRef.current.has(index)) {
        chipWidthsRef.current.set(index, chipEl.offsetWidth);
        newMeasurements += 1;
      }
    });
    if (newMeasurements > 0) {
      setMeasuredCount(chipWidthsRef.current.size);
    }
  }, [containerWidth]);

  // Calculate visible count based on container width and cached chip widths
  // This recalculates when:
  // - Container width changes (measured or column resize)
  // - Array values change (arrayValue.length)
  // - More chips are measured (measuredCount)
  const visibleCount = React.useMemo(() => {
    if (arrayValue.length === 0) {
      return 0;
    }

    // Container or chips not measured yet - show all chips so they can be measured
    // CSS overflow:hidden will handle the visual overflow during measurement
    // Also handles JSDOM where clientWidth returns 0
    if (containerWidth === null || containerWidth === 0 || measuredCount < arrayValue.length) {
      return arrayValue.length;
    }

    // All measurements complete, calculate based on container width
    return calculateVisibleCount(arrayValue.length, containerWidth, chipWidthsRef.current);
  }, [arrayValue.length, measuredCount, containerWidth]);

  const hiddenCount = arrayValue.length - visibleCount;

  // Focus overflow chip when cell receives focus
  React.useEffect(() => {
    if (hasFocus && !popupOpen && hiddenCount > 0) {
      if (overflowChipRef.current && overflowChipRef.current !== document.activeElement) {
        overflowChipRef.current.focus();
      }
    }
    if (!hasFocus) {
      setPopupOpen(false);
    }
  }, [hasFocus, popupOpen, hiddenCount]);

  const handleOverflowClick = (event: React.MouseEvent) => {
    // event.detail === 0 means keyboard-triggered click (Enter keyup on focused button)
    // Ignore these to prevent popup from opening when focus moves to this cell via Enter
    if (event.detail === 0) {
      return;
    }
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

  return (
    <GridMultiSelectCellRoot
      ref={cellRef}
      {...slotProps?.root}
      className={clsx(classes.root, hasFocus && 'Mui-focused', slotProps?.root?.className)}
    >
      {arrayValue.map((v, index) => (
        <GridMultiSelectCellChip
          key={index}
          as={rootProps.slots.baseChip}
          ownerState={rootProps}
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
          className={clsx(
            classes.chip,
            index >= visibleCount && classes.chipHidden,
            slotProps?.chip?.className,
          )}
        />
      ))}
      {hiddenCount > 0 && (
        <GridMultiSelectCellOverflow
          as={rootProps.slots.baseChip}
          ownerState={rootProps}
          ref={overflowChipRef}
          label={`+${hiddenCount}`}
          size="small"
          variant="outlined"
          onClick={handleOverflowClick}
          onKeyDown={handleOverflowKeyDown}
          aria-haspopup="dialog"
          aria-keyshortcuts="Space"
          aria-controls={popupOpen ? popupId : undefined}
          aria-expanded={popupOpen}
          material={{ tabIndex: 0, component: 'button' }}
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
