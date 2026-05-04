'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import useForkRef from '@mui/utils/useForkRef';
import {
  gridClasses,
  gridResizingColumnFieldSelector,
  useGridRootProps,
  useGridSelector,
} from '@mui/x-data-grid';
import type { GridSlotProps, ValueOptions } from '@mui/x-data-grid';
import { NotRendered } from '@mui/x-data-grid/internals';
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

const HYSTERESIS_PX = 4;

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
  const prevArrayKeyRef = React.useRef<string | null>(null);
  const prevVisibleCountRef = React.useRef<number>(values.length);
  // Stable `column.width - container.width` offset (cell padding + borders), so during
  // active drag we can derive container width from the resize event's `params.width`
  // without per-cell DOM reads.
  const widthOffsetRef = React.useRef<number | null>(null);

  const [measuredCount, setMeasuredCount] = React.useState(0);
  const [containerWidth, setContainerWidth] = React.useState<number | null>(null);
  const [overflowMetrics, setOverflowMetrics] = React.useState(
    () => privateApiRef.current.caches.multiSelect?.getOverflowMetrics(field) ?? null,
  );

  const arrayKey = React.useMemo(() => values.join('\0'), [values]);

  React.useEffect(() => {
    if (autoWrap) {
      return;
    }
    if (prevArrayKeyRef.current !== null && prevArrayKeyRef.current !== arrayKey) {
      chipWidthsRef.current.clear();
      setMeasuredCount(0);
      setContainerWidth(null);
    }
    prevArrayKeyRef.current = arrayKey;
  }, [arrayKey, autoWrap]);

  // Re-measure on committed column width changes; active drag flows through the
  // shared subscription below.
  React.useEffect(() => {
    if (autoWrap || !containerRef.current) {
      return;
    }
    const width = containerRef.current.getBoundingClientRect().width;
    widthOffsetRef.current = columnWidth - width;
    setContainerWidth(width);
  }, [columnWidth, autoWrap]);

  React.useEffect(() => {
    if (autoWrap) {
      return undefined;
    }
    const cache = privateApiRef.current.caches.multiSelect;
    if (!cache) {
      return undefined;
    }
    return cache.subscribeDrag(field, (dragWidth) => {
      if (widthOffsetRef.current !== null) {
        setContainerWidth(dragWidth - widthOffsetRef.current);
      }
    });
  }, [field, autoWrap, privateApiRef]);

  React.useEffect(() => {
    const cache = privateApiRef.current.caches.multiSelect;
    if (!cache) {
      return undefined;
    }
    return cache.subscribeOverflowMetrics(field, setOverflowMetrics);
  }, [privateApiRef, field]);

  // Measure chip and container widths after render. `getBoundingClientRect` is sub-pixel,
  // which keeps the chip-fit math aligned with the browser's actual layout.
  React.useLayoutEffect(() => {
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

  const resizingField = useGridSelector(privateApiRef, gridResizingColumnFieldSelector);
  const isDragResizingThisField = resizingField === field;

  // Asymmetric hysteresis applies only during active drag: pointer jitter produces ±1-3 px
  // micro-reversals that flip visibleCount between N and N+1 at the chip-fit boundary.
  // Outside drag (autosize, prop-driven width changes, mount, theme changes) snap to the
  // exact fit so a column sized to natural content reveals all chips with no `+N`.
  const visibleCount = React.useMemo(() => {
    if (autoWrap || values.length === 0) {
      return values.length;
    }
    if (containerWidth === null || containerWidth === 0 || measuredCount < values.length) {
      return values.length;
    }
    const calculated = calculateVisibleCount(
      values.length,
      containerWidth,
      chipWidthsRef.current,
      overflowWidths,
      gap,
    );
    const prev = prevVisibleCountRef.current;
    if (isDragResizingThisField && calculated > prev) {
      const conservative = calculateVisibleCount(
        values.length,
        containerWidth - HYSTERESIS_PX,
        chipWidthsRef.current,
        overflowWidths,
        gap,
      );
      if (conservative < calculated) {
        return prev;
      }
    }
    return calculated;
  }, [
    values.length,
    measuredCount,
    containerWidth,
    autoWrap,
    overflowWidths,
    gap,
    isDragResizingThisField,
  ]);

  React.useLayoutEffect(() => {
    prevVisibleCountRef.current = visibleCount;
  }, [visibleCount]);

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
