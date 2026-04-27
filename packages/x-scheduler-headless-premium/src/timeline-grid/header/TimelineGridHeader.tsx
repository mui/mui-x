'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useRenderElement, BaseUIComponentProps } from '@mui/x-scheduler-headless/base-ui-copy';
import { isWeekend } from '@mui/x-scheduler-headless/use-adapter';
import { useAdapterContext } from '@mui/x-scheduler-headless/use-adapter-context';
import { schedulerPreferenceSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
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

  const children = headers.map((level, levelIndex) => {
    const cells = iterate(adapter, level.unit, timeResolution, start, end);

    return (
      <div key={`${level.unit}:${levelIndex}`} className={classNames?.row} data-level={levelIndex}>
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
                : (level.formatDate?.(adapter, cell.date) ?? '')}
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
  }
}
