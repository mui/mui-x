'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import type { BaseUIComponentProps } from '@mui/x-scheduler-internals/base-ui-copy';
import { useRenderElement } from '@mui/x-scheduler-internals/base-ui-copy';
import { isWeekend } from '@mui/x-scheduler-internals/use-adapter';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import { schedulerPreferenceSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { eventTimelinePremiumPresetSelectors } from '../../event-timeline-premium-selectors';
import { iterate } from './iterate';

export const TimelineGridHeader = React.forwardRef(function TimelineGridHeader(
  componentProps: TimelineGridHeader.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    style,
    classNames,
    tickRange,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const adapter = useAdapterContext();
  const store = useEventTimelinePremiumStoreContext();

  const { start, end, headers, timeResolution } = useStore(
    store,
    eventTimelinePremiumPresetSelectors.config,
  );
  const ampm = useStore(store, schedulerPreferenceSelectors.ampm);
  const weekStartsOn = useStore(store, schedulerPreferenceSelectors.weekStartsOn);

  const children = headers.map((level, levelIndex) => {
    const allCells = iterate(adapter, level.unit, timeResolution, start, end, weekStartsOn);

    let cells: ReturnType<typeof iterate>;
    let offsetInTicks = 0;

    if (tickRange) {
      const filtered = filterCellsByTickRange(
        allCells,
        tickRange.firstTickIndex,
        tickRange.lastTickIndex,
      );
      cells = filtered.visibleCells;
      offsetInTicks = filtered.offsetInTicks;
    } else {
      cells = allCells;
    }

    return (
      <div key={`${level.unit}:${levelIndex}`} className={classNames?.row} data-level={levelIndex}>
        {offsetInTicks > 0 && (
          <div role="none" style={{ width: `calc(var(--unit-width) * ${offsetInTicks})` }} />
        )}
        {cells.map((cell) => (
          <div
            key={cell.key}
            className={[classNames?.cell, level.className].filter(Boolean).join(' ') || undefined}
            data-level={levelIndex}
            data-unit={level.unit}
            data-index={cell.index}
            data-unit-leaf={level.unit === timeResolution ? '' : undefined}
            data-weekend={level.unit === 'day' && isWeekend(adapter, cell.date) ? '' : undefined}
            style={{ '--span': cell.spanInTicks } as React.CSSProperties}
          >
            <time
              className={classNames?.label}
              dateTime={adapter.formatByString(cell.date, "yyyy-MM-dd'T'HH:mm")}
            >
              {level.renderCell
                ? level.renderCell({
                    adapter,
                    ampm,
                    date: cell.date,
                    start: cell.start,
                    end: cell.end,
                    index: cell.index,
                    key: cell.key,
                    level: levelIndex,
                    spanInTicks: cell.spanInTicks,
                    unit: level.unit,
                  })
                : level.formatDate(adapter, cell.date)}
            </time>
          </div>
        ))}
      </div>
    );
  });

  return useRenderElement('div', componentProps, {
    ref: [forwardedRef],
    props: [elementProps, { children }],
  });
});

export namespace TimelineGridHeader {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {
    /**
     * Extra class names applied to the primitive's internal elements so a styled wrapper
     * (or a consumer) can target rows, cells, and labels without a nested selector.
     */
    classNames?: {
      row?: string;
      cell?: string;
      label?: string;
    };
    /**
     * When provided, only header cells overlapping this tick range are rendered.
     * Tick indices are zero-based relative to the preset's tick grid (not the
     * virtualizer's column model which includes the pinned title column).
     */
    tickRange?: {
      firstTickIndex: number;
      lastTickIndex: number;
    };
  }
}

/**
 * Filters a level's cells to those overlapping a tick range and computes
 * the tick offset of the first visible cell within that level.
 */
function filterCellsByTickRange(
  cells: ReturnType<typeof iterate>,
  firstTickIndex: number,
  lastTickIndex: number,
): { visibleCells: ReturnType<typeof iterate>; offsetInTicks: number } {
  let tickCursor = 0;
  let firstVisibleIdx = -1;
  let lastVisibleIdx = -1;

  for (let i = 0; i < cells.length; i += 1) {
    const cellEnd = tickCursor + cells[i].spanInTicks;
    // Cell overlaps [firstTickIndex, lastTickIndex) if cellEnd > first && tickCursor < last
    if (cellEnd > firstTickIndex && tickCursor < lastTickIndex) {
      if (firstVisibleIdx === -1) {
        firstVisibleIdx = i;
      }
      lastVisibleIdx = i;
    }
    tickCursor = cellEnd;
  }

  if (firstVisibleIdx === -1) {
    return { visibleCells: [], offsetInTicks: 0 };
  }

  // Offset = tick position of the first visible cell
  let offsetInTicks = 0;
  for (let i = 0; i < firstVisibleIdx; i += 1) {
    offsetInTicks += cells[i].spanInTicks;
  }

  return {
    visibleCells: cells.slice(firstVisibleIdx, lastVisibleIdx + 1),
    offsetInTicks,
  };
}
