'use client';
import * as React from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { TimeGridColumnContext } from './TimeGridColumnContext';
import { getAdapter } from '../../utils/adapter/getAdapter';
import { SchedulerValidDate } from '../../models';
import { mergeDateAndTime } from '../../utils/date-utils';
import { useTimeGridRootContext } from '../root/TimeGridRootContext';
import { TimeGridEvent } from '../event';

const adapter = getAdapter();

export const TimeGridColumn = React.forwardRef(function TimeGridColumn(
  componentProps: TimeGridColumn.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Internal props
    value,
    startTime,
    endTime,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const ref = React.useRef<HTMLDivElement>(null);
  const { onEventChange } = useTimeGridRootContext();

  const contextValue: TimeGridColumnContext = React.useMemo(
    () => ({
      start:
        startTime == null ? adapter.startOfDay(value) : mergeDateAndTime(adapter, value, startTime),
      end: endTime == null ? adapter.endOfDay(value) : mergeDateAndTime(adapter, value, endTime),
    }),
    [value, startTime, endTime],
  );

  const props = React.useMemo(() => ({ role: 'gridcell' }), []);

  const state: TimeGridColumn.State = React.useMemo(() => ({}), []);

  const element = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, ref],
    props: [props, elementProps],
  });

  React.useEffect(() => {
    return dropTargetForElements({
      element: ref.current!,
      canDrop: (args) => args.source.data.type === 'event',
      getData: () => ({ type: 'column' }),
      onDrop: ({ source, location }) => {
        const data = source.data as unknown as TimeGridEvent.EventDragData;

        const pageY = location.current.input.pageY;
        const columnOffsetTop = ref.current!.offsetTop;
        const columnHeight = ref.current!.offsetHeight;
        const y = pageY - columnOffsetTop;

        const newTime = Math.round((y / columnHeight) * 1440); // 1440 minutes in a day

        const eventDuration =
          (adapter.toJsDate(data.end).getTime() - adapter.toJsDate(data.start).getTime()) /
          (60 * 1000);

        const newStartDate = adapter.setMinutes(
          adapter.setHours(value, Math.floor(newTime / 60)),
          newTime % 60,
        );

        // TODO: Avoid JS Date conversion
        const newEndDate = adapter.addMinutes(newStartDate, eventDuration);

        onEventChange({
          start: newStartDate,
          end: newEndDate,
          id: data.id,
        });
      },
    });
  }, []);

  return (
    <TimeGridColumnContext.Provider value={contextValue}>{element}</TimeGridColumnContext.Provider>
  );
});

export namespace TimeGridColumn {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {
    /**
     * The value of the column.
     */
    value: SchedulerValidDate;
    /**
     * The start time of the column.
     * The date part is ignored, only the time part is used.
     * @defaultValue 00:00:00
     */
    startTime?: SchedulerValidDate;
    /**
     * The end time of the column.
     * The date part is ignored, only the time part is used.
     * @defaultValue 23:59:59
     */
    endTime?: SchedulerValidDate;
  }
}
