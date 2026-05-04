'use client';
import * as React from 'react';
import { useResizeObserver } from '@mui/x-internals/useResizeObserver';
import { useGridRootProps } from '@mui/x-data-grid';
import type { DataGridProProcessedProps } from '../../models/dataGridProProps';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { MultiSelectChipsRoot } from './GridMultiSelectChips';
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

export interface GridMultiSelectMeasurerProps {
  field: string;
}

/**
 * Hidden helper mounted inside each multiSelect column header that publishes the column's
 * measured `+N` overflow chip widths and row gap to `apiRef.caches.multiSelect`. Lifecycle
 * follows the header — when the column is hidden, the measurer unmounts and clears the
 * field's metrics. `ResizeObserver` re-fires when font / chip styles shift; the cache
 * dedupes equal metrics so subscribed cells only re-render on real change.
 */
export function GridMultiSelectMeasurer(props: GridMultiSelectMeasurerProps) {
  const { field } = props;
  const rootProps = useGridRootProps();
  const apiRef = useGridPrivateApiContext();
  const ownerState = rootProps as OwnerState;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const chipsRef = React.useRef<Array<HTMLDivElement | null>>([]);

  const measure = React.useCallback(() => {
    const container = containerRef.current;
    const cache = apiRef.current.caches.multiSelect;
    if (!container || !cache || chipsRef.current.some((el) => !el)) {
      return;
    }
    const overflowChipWidths = chipsRef.current.map((el) => el!.getBoundingClientRect().width);
    const computedGap = parseFloat(window.getComputedStyle(container).gap);
    const gap = Number.isFinite(computedGap) ? computedGap : DEFAULT_GAP;
    cache.setOverflowMetrics(field, { overflowChipWidths, gap });
  }, [apiRef, field]);

  React.useLayoutEffect(measure, [measure]);
  // Clear the field's metrics on unmount so cells reading via `getOverflowMetrics(field)`
  // get a clean slate if the column is hidden then shown again with different styling.
  React.useEffect(() => {
    const apiRefCurrent = apiRef.current;
    return () => {
      apiRefCurrent.caches.multiSelect?.deleteOverflowMetrics(field);
    };
  }, [apiRef, field]);
  // The flex container resizes whenever any chip resizes, so observing the container
  // catches font/theme shifts without registering a listener per chip.
  useResizeObserver(containerRef, measure);

  const BaseChip = rootProps.slots.baseChip;

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
