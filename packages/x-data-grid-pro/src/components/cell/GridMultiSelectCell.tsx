'use client';
import * as React from 'react';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/material/styles';
import type {
  GridRenderCellParams,
  GridMultiSelectColDef,
  ValueOptions,
  GridSlotProps,
} from '@mui/x-data-grid';
import {
  getDataGridUtilityClass,
  gridClasses,
  useGridRootProps,
  useGridApiContext,
  useGridEvent,
  useGridSelector,
} from '@mui/x-data-grid';
import {
  gridRowHeightSelector,
  gridFilterModelSelector,
  GridFooterCell,
  NotRendered,
  vars,
  isMultiSelectColDef,
  getValueOptions,
} from '@mui/x-data-grid/internals';
import type { DataGridProProcessedProps } from '../../models/dataGridProProps';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { calculateVisibleCount } from '../../utils/multiSelectCellUtils';

type OwnerState = DataGridProProcessedProps;

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

export interface GridMultiSelectCellProps<
  V extends ValueOptions = ValueOptions,
> extends GridRenderCellParams {
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
     * Can be an object or a function that receives the chip value and index.
     */
    chip?:
      | Partial<GridSlotProps['baseChip']>
      | ((value: V, index: number) => Partial<GridSlotProps['baseChip']>);
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

function GridMultiSelectCell<V extends ValueOptions = ValueOptions>(
  props: GridMultiSelectCellProps<V>,
) {
  const { id, value, colDef, hasFocus, row, slotProps } = props;
  const popupId = `${id}-${colDef.field}-multiselect-popup`;
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const privateApiRef = useGridPrivateApiContext();
  const classes = useUtilityClasses(rootProps as OwnerState);
  const rowHeight = useGridSelector(apiRef, gridRowHeightSelector);
  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  const isAutoHeight = privateApiRef.current.rowHasAutoHeight(id);

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
  const getOptionValue = (colDef as GridMultiSelectColDef).getOptionValue!;
  const getOptionLabelFn = (colDef as GridMultiSelectColDef).getOptionLabel!;
  const optionByValue = new Map<any, ValueOptions>();
  if (valueOptions) {
    for (const opt of valueOptions) {
      optionByValue.set(getOptionValue(opt), opt);
    }
  }

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

  // Track previous arrayKey to detect actual changes (not initial mount)
  const prevArrayKeyRef = React.useRef<string | null>(null);
  // Stable count used for asymmetric hysteresis: upward transitions need headroom,
  // downward transitions fire immediately. Updated in a layout effect below.
  const prevVisibleCountRef = React.useRef<number>(arrayValue.length);

  // Clear chip width cache when array values change
  React.useEffect(() => {
    if (isAutoHeight) {
      return;
    }
    // Skip on initial mount - state is already fresh
    // Only reset when arrayKey actually changes
    if (prevArrayKeyRef.current !== null && prevArrayKeyRef.current !== arrayKey) {
      chipWidthsRef.current.clear();
      setMeasuredCount(0);
      setContainerWidth(null);
    }
    prevArrayKeyRef.current = arrayKey;
  }, [arrayKey, isAutoHeight]);

  // Re-read container width when the column's committed width changes (drag-stop state
  // commit or programmatic `apiRef.setColumnWidth`). Active-drag updates flow through
  // the throttled `columnResize` handler below; this only covers the state-driven path.
  React.useEffect(() => {
    if (isAutoHeight || !cellRef.current) {
      return;
    }
    setContainerWidth(cellRef.current.getBoundingClientRect().width);
  }, [colDef.computedWidth, isAutoHeight]);

  // Live resize: throttle updates from `columnResize` so visibility doesn't flicker
  // when a slow drag oscillates around a chip-fit boundary. `columnResizeStop` flushes
  // the trailing value so the final width is exact.
  const RESIZE_THROTTLE_MS = 32;
  const resizeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const commitContainerWidth = React.useCallback(() => {
    resizeTimerRef.current = null;
    if (cellRef.current) {
      setContainerWidth(cellRef.current.getBoundingClientRect().width);
    }
  }, []);
  useGridEvent(apiRef, 'columnResize', (params) => {
    if (isAutoHeight || params.colDef.field !== colDef.field) {
      return;
    }
    if (resizeTimerRef.current !== null) {
      return;
    }
    resizeTimerRef.current = setTimeout(commitContainerWidth, RESIZE_THROTTLE_MS);
  });
  useGridEvent(apiRef, 'columnResizeStop', () => {
    if (resizeTimerRef.current !== null) {
      clearTimeout(resizeTimerRef.current);
    }
    commitContainerWidth();
  });
  React.useEffect(
    () => () => {
      if (resizeTimerRef.current !== null) {
        clearTimeout(resizeTimerRef.current);
      }
    },
    [],
  );

  // Measure chips and container width after render (synchronous to avoid flicker)
  React.useLayoutEffect(() => {
    if (isAutoHeight) {
      return;
    }
    // Measure container width once. Use getBoundingClientRect for sub-pixel precision
    // — clientWidth/offsetWidth round to integer, which biases the chip-fit math.
    if (containerWidth === null && cellRef.current) {
      setContainerWidth(cellRef.current.getBoundingClientRect().width);
    }

    let newMeasurements = 0;
    chipsRef.current.forEach((chipEl, index) => {
      if (chipEl && !chipWidthsRef.current.has(index)) {
        chipWidthsRef.current.set(index, chipEl.getBoundingClientRect().width);
        newMeasurements += 1;
      }
    });
    if (newMeasurements > 0) {
      setMeasuredCount(chipWidthsRef.current.size);
    }
  }, [containerWidth, isAutoHeight]);

  // Asymmetric hysteresis: natural pointer drag produces ±1-3 px jitter every frame.
  // At a chip-fit boundary that jitter flips visibleCount between N and N+1 and the
  // chips flash. Upward transitions require `HYSTERESIS_PX` of headroom past the real
  // boundary; downward transitions apply immediately so chips never overflow the cell.
  const HYSTERESIS_PX = 4;
  const visibleCount = React.useMemo(() => {
    if (isAutoHeight || arrayValue.length === 0) {
      return arrayValue.length;
    }

    // Container or chips not measured yet - show all chips so they can be measured
    // CSS overflow:hidden will handle the visual overflow during measurement
    // Also handles JSDOM where clientWidth returns 0
    if (containerWidth === null || containerWidth === 0 || measuredCount < arrayValue.length) {
      return arrayValue.length;
    }

    const calculated = calculateVisibleCount(
      arrayValue.length,
      containerWidth,
      chipWidthsRef.current,
    );
    const prev = prevVisibleCountRef.current;

    if (calculated > prev) {
      // Require HYSTERESIS_PX of headroom before revealing new chips.
      const conservative = calculateVisibleCount(
        arrayValue.length,
        containerWidth - HYSTERESIS_PX,
        chipWidthsRef.current,
      );
      if (conservative < calculated) {
        return prev;
      }
    }
    return calculated;
  }, [arrayValue.length, measuredCount, containerWidth, isAutoHeight]);

  // Commit the latest visibleCount so the next render's hysteresis uses an up-to-date
  // baseline. Layout effect so the commit is synchronous with paint.
  React.useLayoutEffect(() => {
    prevVisibleCountRef.current = visibleCount;
  }, [visibleCount]);

  const hiddenCount = arrayValue.length - visibleCount;

  // Focus overflow chip when cell receives focus
  React.useEffect(() => {
    if (isAutoHeight) {
      return;
    }
    if (hasFocus && !popupOpen && hiddenCount > 0) {
      if (overflowChipRef.current && overflowChipRef.current !== document.activeElement) {
        overflowChipRef.current.focus();
      }
    }
    if (!hasFocus) {
      setPopupOpen(false);
    }
  }, [hasFocus, popupOpen, hiddenCount, isAutoHeight]);

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
      {arrayValue.map((v, index) => {
        const option = optionByValue.get(v) ?? v;
        const chipProps =
          typeof slotProps?.chip === 'function' ? slotProps.chip(option, index) : slotProps?.chip;
        return (
          <GridMultiSelectCellChip
            key={index}
            as={rootProps.slots.baseChip}
            ownerState={rootProps as OwnerState}
            ref={(el: HTMLDivElement) => {
              if (el) {
                chipsRef.current.set(index, el);
              } else {
                chipsRef.current.delete(index);
              }
            }}
            label={getOptionLabelFn(option)}
            size="small"
            variant="outlined"
            {...chipProps}
            className={clsx(
              classes.chip,
              index >= visibleCount && classes.chipHidden,
              chipProps?.className,
            )}
          />
        );
      })}
      {hiddenCount > 0 && (
        <GridMultiSelectCellOverflow
          as={rootProps.slots.baseChip}
          ownerState={rootProps as OwnerState}
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
          material={{ tabIndex: -1, component: 'button' }}
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
          ownerState={rootProps as OwnerState}
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
            {arrayValue.map((v, index) => {
              const option = optionByValue.get(v) ?? v;
              const chipProps =
                typeof slotProps?.chip === 'function'
                  ? slotProps.chip(option, index)
                  : slotProps?.chip;
              return (
                <rootProps.slots.baseChip
                  key={index}
                  label={getOptionLabelFn(option)}
                  size="small"
                  variant="outlined"
                  {...chipProps}
                  className={clsx(classes.chip, chipProps?.className)}
                />
              );
            })}
          </GridMultiSelectCellPopperContent>
        </GridMultiSelectCellPopper>
      )}
    </GridMultiSelectCellRoot>
  );
}

export { GridMultiSelectCell };

export const renderMultiSelectCell = (params: GridMultiSelectCellProps) => {
  const aggregation = (params as any).aggregation;
  if (aggregation) {
    if (aggregation.position === 'footer') {
      return <GridFooterCell {...(params as any)} />;
    }
    return params.formattedValue ?? (params.value as any);
  }
  return <GridMultiSelectCell {...params} />;
};
