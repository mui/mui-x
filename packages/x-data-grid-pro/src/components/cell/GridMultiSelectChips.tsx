'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import useForkRef from '@mui/utils/useForkRef';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import {
  gridClasses,
  gridResizingColumnFieldSelector,
  useGridRootProps,
  useGridSelector,
} from '@mui/x-data-grid';
import type { GridSlotProps, ValueOptions } from '@mui/x-data-grid';
import { NotRendered, useSyncExternalStore, useTimeout } from '@mui/x-data-grid/internals';
import type { DataGridProProcessedProps } from '../../models/dataGridProProps';
import {
  DEFAULT_GAP,
  DEFAULT_OVERFLOW_CHIP_WIDTHS,
  calculateVisibleCount,
} from '../../utils/multiSelectCellUtils';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';

type OwnerState = DataGridProProcessedProps;

export const MultiSelectChipsRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'MultiSelectChips',
  shouldForwardProp: (prop) => prop !== 'ownerState',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  gap: 4,
  overflow: 'hidden',
  position: 'relative',
});

const Chip = styled(NotRendered<GridSlotProps['baseChip']>, {
  name: 'MuiDataGrid',
  slot: 'MultiSelectChip',
})<{ ownerState: OwnerState }>({
  [`&.${gridClasses['multiSelectCellChip--hidden']}`]: {
    display: 'none',
  },
});

// Delay before revealing all chips on resize start, so a quick double-click (autosize) — which
// toggles the resizing state in short bursts — doesn't flash every chip.
const RESIZE_REVEAL_DELAY_MS = 150;

export interface GridMultiSelectChipsProps<V extends ValueOptions = ValueOptions> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  values: any[];
  field: string;
  columnWidth: number;
  optionByValue: Map<any, ValueOptions>;
  getOptionLabel: (option: ValueOptions) => string;
  /** When true, skip overflow measurement and render every chip (for auto-row-height rows). */
  autoWrap?: boolean;
  classes?: {
    root?: string;
    chip?: string;
    chipHidden?: string;
    overflow?: string;
  };
  slotProps?: {
    root?: React.HTMLAttributes<HTMLDivElement>;
    chip?:
      | Partial<GridSlotProps['baseChip']>
      | ((value: V, index: number) => Partial<GridSlotProps['baseChip']>);
    /** Props for the `+N` overflow chip. Omit to render it as a non-interactive indicator. */
    overflow?: Partial<GridSlotProps['baseChip']>;
  };
}

function GridMultiSelectChipsImpl<V extends ValueOptions = ValueOptions>(
  props: GridMultiSelectChipsProps<V>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    values,
    field,
    columnWidth,
    optionByValue,
    getOptionLabel,
    autoWrap,
    classes,
    slotProps,
    ...other
  } = props;

  const rootProps = useGridRootProps();
  const privateApiRef = useGridPrivateApiContext();
  const ownerState = rootProps as OwnerState;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const handleRef = useForkRef(containerRef, ref);

  const chipsRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const chipWidthsRef = React.useRef<Map<number, number>>(new Map());

  const [measuredCount, setMeasuredCount] = React.useState(0);
  const [containerWidth, setContainerWidth] = React.useState<number | null>(null);

  const subscribeMetrics = React.useCallback(
    (notify: () => void) => {
      const cache = privateApiRef.current.caches.multiSelect;
      if (!cache) {
        return () => {};
      }
      return cache.subscribeOverflowMetrics(notify);
    },
    [privateApiRef],
  );
  const getMetricsSnapshot = React.useCallback(
    () => privateApiRef.current.caches.multiSelect?.getOverflowMetrics() ?? null,
    [privateApiRef],
  );
  const overflowMetrics = useSyncExternalStore(
    subscribeMetrics,
    getMetricsSnapshot,
    getMetricsSnapshot,
  );

  const arrayKey = React.useMemo(() => values.join('\0'), [values]);
  const [prevArrayKey, setPrevArrayKey] = React.useState(arrayKey);

  if (!autoWrap && prevArrayKey !== arrayKey) {
    setPrevArrayKey(arrayKey);
    chipWidthsRef.current.clear();
    setMeasuredCount(0);
    setContainerWidth(null);
  }

  // Re-measure on committed column width changes (incl. when a resize finishes); we don't
  // track live drag, matching how other cells reflow only once the resize is committed.
  useEnhancedEffect(() => {
    if (autoWrap || !containerRef.current) {
      return;
    }
    setContainerWidth(containerRef.current.getBoundingClientRect().width);
  }, [columnWidth, autoWrap]);

  // Measure chip and container widths after render. `getBoundingClientRect` is sub-pixel,
  // which keeps the chip-fit math aligned with the browser's actual layout.
  useEnhancedEffect(() => {
    if (autoWrap) {
      return;
    }
    if (containerWidth === null && containerRef.current) {
      setContainerWidth(containerRef.current.getBoundingClientRect().width);
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
  }, [containerWidth, autoWrap]);

  const overflowWidths = overflowMetrics?.overflowChipWidths ?? DEFAULT_OVERFLOW_CHIP_WIDTHS;
  const gap = overflowMetrics?.gap ?? DEFAULT_GAP;

  // While this column is being drag-resized, render every chip and let the cell clip them.
  // The `+N` overflow is recomputed once the resize is committed (see the `columnWidth` effect).
  const isResizingThisColumn =
    useGridSelector(privateApiRef, gridResizingColumnFieldSelector) === field;
  // Debounce the reveal so a quick double-click to autosize doesn't flash all chips.
  const revealTimeout = useTimeout();
  const [revealWhileResizing, setRevealWhileResizing] = React.useState(false);
  React.useEffect(() => {
    if (!isResizingThisColumn) {
      revealTimeout.clear();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRevealWhileResizing(false);
      return;
    }
    revealTimeout.start(RESIZE_REVEAL_DELAY_MS, () => setRevealWhileResizing(true));
  }, [isResizingThisColumn, revealTimeout]);

  const visibleCount = React.useMemo(() => {
    if (autoWrap || revealWhileResizing || values.length === 0) {
      return values.length;
    }
    if (containerWidth === null || containerWidth === 0 || measuredCount < values.length) {
      return values.length;
    }
    return calculateVisibleCount(
      values.length,
      containerWidth,
      chipWidthsRef.current,
      overflowWidths,
      gap,
    );
  }, [
    values.length,
    measuredCount,
    containerWidth,
    autoWrap,
    revealWhileResizing,
    overflowWidths,
    gap,
  ]);

  const hiddenCount = values.length - visibleCount;

  return (
    <MultiSelectChipsRoot
      ref={handleRef}
      ownerState={ownerState}
      {...other}
      {...slotProps?.root}
      className={clsx(classes?.root, other?.className, slotProps?.root?.className)}
    >
      {values.map((v, index) => {
        const option = optionByValue.get(v) ?? v;
        const chipProps =
          typeof slotProps?.chip === 'function' ? slotProps.chip(option, index) : slotProps?.chip;
        return (
          <Chip
            key={index}
            as={rootProps.slots.baseChip}
            ownerState={ownerState}
            ref={(el: HTMLDivElement | null) => {
              if (el) {
                chipsRef.current.set(index, el);
              } else {
                chipsRef.current.delete(index);
              }
            }}
            label={getOptionLabel(option)}
            size="small"
            variant="outlined"
            {...chipProps}
            className={clsx(
              classes?.chip,
              // Internal hide class is always applied so the styled CSS rule fires
              // regardless of caller; caller-supplied chipHidden is additive (extra styling).
              index >= visibleCount && [
                gridClasses['multiSelectCellChip--hidden'],
                classes?.chipHidden,
              ],
              chipProps?.className,
            )}
          />
        );
      })}
      {hiddenCount > 0 && (
        <rootProps.slots.baseChip
          label={`+${hiddenCount}`}
          size="small"
          variant="outlined"
          {...slotProps?.overflow}
          className={clsx(classes?.overflow, slotProps?.overflow?.className)}
        />
      )}
    </MultiSelectChipsRoot>
  );
}

export const GridMultiSelectChips = React.forwardRef(GridMultiSelectChipsImpl) as <
  V extends ValueOptions = ValueOptions,
>(
  props: GridMultiSelectChipsProps<V> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => React.ReactElement;
