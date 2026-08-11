'use client';
import * as React from 'react';
import { useResizeObserver } from '@mui/x-internals/useResizeObserver';
import { useGridRootProps, useGridSelector, gridColumnDefinitionsSelector } from '@mui/x-data-grid';
import type { DataGridProProcessedProps } from '../../models/dataGridProProps';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { MultiSelectChipsRoot } from './GridMultiSelectChips';
import { GridMultiSelectCache } from '../../hooks/features/multiSelect/gridMultiSelectCache';
import { DEFAULT_GAP } from '../../utils/multiSelectCellUtils';

type OwnerState = DataGridProProcessedProps;

const SAMPLE_LABELS = ['+9', '+99', '+999'];

const HIDDEN_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: 'auto',
  height: 'auto',
  visibility: 'hidden',
  pointerEvents: 'none',
};

/**
 * Hidden helper mounted once per grid (inside `<GridRoot>`) that publishes the measured `+N`
 * overflow chip widths and row gap to `apiRef.caches.multiSelect`. The measured chip comes from
 * the grid-level `baseChip` slot and the shared chip-row styling, so the metrics are identical
 * for every multiSelect column — one measurement per grid is enough. Renders nothing when the
 * grid has no multiSelect column. `ResizeObserver` re-fires when font / chip styles shift; the
 * cache dedupes equal metrics so subscribed cells only re-render on real change.
 */
export function GridMultiSelectMeasurer() {
  const rootProps = useGridRootProps();
  const apiRef = useGridPrivateApiContext();
  const columns = useGridSelector(apiRef, gridColumnDefinitionsSelector);
  const hasMultiSelectColumn = columns.some((column) => column.type === 'multiSelect');
  const ownerState = rootProps as OwnerState;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const chipsRef = React.useRef<Array<HTMLDivElement | null>>([]);

  // The measurer is the sole writer of the overflow metrics, so it owns the cache lifecycle.
  if (!apiRef.current.caches.multiSelect) {
    apiRef.current.caches.multiSelect = new GridMultiSelectCache();
  }

  React.useEffect(() => {
    const api = apiRef.current;
    return () => {
      api.caches.multiSelect?.teardown();
    };
  }, [apiRef]);

  const measure = React.useCallback(() => {
    const container = containerRef.current;
    const cache = apiRef.current.caches.multiSelect;
    if (!container || !cache || chipsRef.current.some((el) => !el)) {
      return;
    }
    const overflowChipWidths = chipsRef.current.map((el) => el!.getBoundingClientRect().width);
    const computedGap = parseFloat(window.getComputedStyle(container).gap);
    const gap = Number.isFinite(computedGap) ? computedGap : DEFAULT_GAP;
    cache.setOverflowMetrics({ overflowChipWidths, gap });
  }, [apiRef]);

  React.useLayoutEffect(measure, [measure]);
  // The flex container resizes whenever any chip resizes, so observing the container
  // catches font/theme shifts without registering a listener per chip.
  useResizeObserver(containerRef, measure);

  const BaseChip = rootProps.slots.baseChip;

  if (!hasMultiSelectColumn) {
    return null;
  }

  return (
    <MultiSelectChipsRoot
      ref={containerRef}
      ownerState={ownerState}
      aria-hidden
      style={HIDDEN_STYLE}
    >
      {SAMPLE_LABELS.map((label, index) => (
        <BaseChip
          key={label}
          ref={(el: HTMLDivElement | null) => {
            chipsRef.current[index] = el;
          }}
          label={label}
          size="small"
          variant="outlined"
        />
      ))}
    </MultiSelectChipsRoot>
  );
}
