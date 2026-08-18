'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import type { EventDropData, EventDropDataLookup } from '../../build-is-valid-drop-target';
import { EVENT_DRAG_PRECISION_MINUTE, EVENT_DRAG_PRECISION_MS } from '../../constants';
import type {
  EventSurfaceType,
  SchedulerEvent,
  SchedulerResourceId,
  TemporalSupportedObject,
} from '../../models';
import type { Adapter } from '../../use-adapter/useAdapter.types';
import { useAdapterContext } from '../../use-adapter-context';
import { clampResizedEventEdge } from './resize-utils';
import {
  dateToTimelineAxisOffsetMs,
  getTimelineAxisDurationMs,
  timelineAxisOffsetToDate,
} from './timeline-axis';
import type { TimelineAxis } from './timeline-axis';
import { useDropTarget } from './useDropTarget';

type LinearAxis = 'horizontal' | 'vertical';

interface PointerInput {
  clientX?: number;
  clientY?: number;
}

interface ElementMeasurement {
  getBoundingClientRect: () => Pick<DOMRect, 'x' | 'y'>;
}

interface CollectionMeasurement {
  offsetHeight: number;
  offsetWidth: number;
}

interface LinearTimeInteractionEngineParameters {
  adapter: Adapter;
  axis: LinearAxis;
  timeScale: LinearTimeScale;
  constrainEventToTimeAxis: boolean;
}

type LinearTimeScale =
  | {
      type: 'continuous';
      start: TemporalSupportedObject;
      end: TemporalSupportedObject;
    }
  | {
      type: 'timeline-axis';
      axis: TimelineAxis & { durationMs?: number };
    };

interface EventRangeParameters {
  start: TemporalSupportedObject;
  end: TemporalSupportedObject;
  cursorPositionInCollectionMs: number;
  initialCursorPositionInEventMs: number;
}

interface LinearEventData {
  start: TemporalSupportedObject;
  end: TemporalSupportedObject;
  initialCursorPositionInEventMs: number;
}

interface InternalEventData {
  start: TemporalSupportedObject;
  end: TemporalSupportedObject;
  originalOccurrence: unknown;
}

type DropSourceFor<Shape> = Extract<
  {
    [Source in keyof EventDropDataLookup]: EventDropDataLookup[Source] extends Shape
      ? Source
      : never;
  }[keyof EventDropDataLookup],
  string
>;

type InternalDropData = Parameters<useDropTarget.GetDataFromInside>[0];
type ExternalDropData = Parameters<useDropTarget.GetDataFromOutside>[0];
type LinearEventDropData = InternalDropData & LinearEventData;
type LinearResizeDropData = LinearEventDropData & { side: 'start' | 'end' };

/**
 * Creates the date calculations shared by every drag-and-drop surface laid out on a linear time
 * axis. DOM measurement stays at the hook boundary so the calculations can remain deterministic.
 */
export function createLinearTimeInteractionEngine(
  parameters: LinearTimeInteractionEngineParameters,
) {
  const { adapter, axis, timeScale, constrainEventToTimeAxis } = parameters;
  const timeAxis = timeScale.type === 'continuous' ? null : timeScale.axis;
  const timeAxisStart = timeScale.type === 'continuous' ? timeScale.start : timeScale.axis.start;
  const timeAxisEnd = timeScale.type === 'continuous' ? timeScale.end : timeScale.axis.end;
  const timeAxisDurationMs =
    timeScale.type === 'continuous'
      ? adapter.getTime(timeScale.end) - adapter.getTime(timeScale.start)
      : (timeScale.axis.durationMs ?? getTimelineAxisDurationMs(adapter, timeScale.axis));

  const offsetToDate = (offsetMs: number) =>
    timeAxis
      ? timelineAxisOffsetToDate(adapter, timeAxis, offsetMs)
      : adapter.addMilliseconds(timeAxisStart, offsetMs);
  const dateToOffset = (date: TemporalSupportedObject) =>
    timeAxis
      ? dateToTimelineAxisOffsetMs(adapter, timeAxis, date)
      : adapter.getTime(date) - adapter.getTime(timeAxisStart);

  const getDateAtOffset = (offsetMs: number) => {
    const roundedOffsetMs =
      Math.round(offsetMs / EVENT_DRAG_PRECISION_MS) * EVENT_DRAG_PRECISION_MS;
    return offsetToDate(roundedOffsetMs);
  };

  const getCursorPositionInElementMs = (input: {
    pointer: PointerInput;
    element: ElementMeasurement;
    collection: CollectionMeasurement;
  }) => {
    const { pointer, element, collection } = input;
    const elementPosition = element.getBoundingClientRect();
    const pointerPosition = axis === 'horizontal' ? pointer.clientX : pointer.clientY;
    const elementStart = axis === 'horizontal' ? elementPosition.x : elementPosition.y;
    const collectionSize = axis === 'horizontal' ? collection.offsetWidth : collection.offsetHeight;

    if (pointerPosition == null) {
      return 0;
    }

    const relativePosition = Math.max(
      0,
      Math.min(1, (pointerPosition - elementStart) / collectionSize),
    );
    return Math.round(timeAxisDurationMs * relativePosition);
  };

  const getMovedEventRange = (input: EventRangeParameters) => {
    const { start, end, cursorPositionInCollectionMs, initialCursorPositionInEventMs } = input;
    const eventDurationMs = adapter.getTime(end) - adapter.getTime(start);
    const startAnchor = offsetToDate(dateToOffset(start));
    const hiddenRemainderMs = adapter.getTime(start) - adapter.getTime(startAnchor);
    const newStartAnchor = getDateAtOffset(
      cursorPositionInCollectionMs - initialCursorPositionInEventMs,
    );
    let newStart = adapter.addMilliseconds(newStartAnchor, hiddenRemainderMs);

    if (constrainEventToTimeAxis) {
      if (adapter.isBefore(newStart, timeAxisStart)) {
        newStart = timeAxisStart;
      }

      const maxStart = adapter.addMilliseconds(timeAxisEnd, -eventDurationMs);
      if (adapter.isAfter(newStart, maxStart)) {
        newStart = maxStart;
      }
    }

    return {
      start: newStart,
      end: adapter.addMilliseconds(newStart, eventDurationMs),
    };
  };

  const getResizedEventRange = (input: EventRangeParameters & { side: 'start' | 'end' }) => {
    const { start, end, side, cursorPositionInCollectionMs, initialCursorPositionInEventMs } =
      input;
    const eventAxisDurationMs = dateToOffset(end) - dateToOffset(start);
    const cursorOffsetMs =
      cursorPositionInCollectionMs -
      initialCursorPositionInEventMs +
      (side === 'end' ? eventAxisDurationMs : 0);
    let cursorDate = getDateAtOffset(cursorOffsetMs);

    if (constrainEventToTimeAxis) {
      if (side === 'start' && adapter.isBefore(cursorDate, timeAxisStart)) {
        cursorDate = timeAxisStart;
      } else if (side === 'end' && adapter.isAfter(cursorDate, timeAxisEnd)) {
        cursorDate = timeAxisEnd;
      }
    }

    return clampResizedEventEdge({
      adapter,
      side,
      start,
      end,
      cursorDate,
      precisionMinute: EVENT_DRAG_PRECISION_MINUTE,
    });
  };

  return {
    getCursorPositionInElementMs,
    getDateAtOffset,
    getMovedEventRange,
    getResizedEventRange,
    timeAxisDurationMs,
  };
}

/**
 * Registers a drop target whose primary axis represents a linear time scale.
 */
export function useLinearTimeDropTarget(parameters: useLinearTimeDropTarget.Parameters) {
  const {
    axis,
    timeScale,
    constrainEventToTimeAxis,
    sources,
    surfaceType,
    resourceId,
    getFixedDurationInMinutes,
    addPropertiesToDroppedEvent,
  } = parameters;
  const adapter = useAdapterContext();
  const ref = React.useRef<HTMLDivElement>(null);
  const engine = createLinearTimeInteractionEngine({
    adapter,
    axis,
    timeScale,
    constrainEventToTimeAxis,
  });

  const validSources = React.useMemo(
    () => new Set(Object.values(sources).filter((source) => source != null)),
    [sources.external, sources.fixedDuration, sources.move, sources.resize],
  );
  const isValidDropTarget = React.useCallback(
    (data: any): data is EventDropData => validSources.has(data.source),
    [validSources],
  );

  const getCursorPositionInElementMs = useStableCallback(
    ({ input, elementRef }: useLinearTimeDropTarget.CursorPositionParameters) => {
      if (!ref.current || !elementRef.current) {
        return 0;
      }

      return engine.getCursorPositionInElementMs({
        pointer: input,
        element: elementRef.current,
        collection: ref.current,
      });
    },
  );

  const getDateAtPointer = useStableCallback((input: { clientX: number; clientY: number }) => {
    const collectionSize =
      axis === 'horizontal' ? ref.current?.offsetWidth : ref.current?.offsetHeight;
    if (!ref.current || collectionSize === 0) {
      return null;
    }

    const offsetMs = getCursorPositionInElementMs({ input, elementRef: ref });
    return engine.getDateAtOffset(offsetMs);
  });

  const getEventDropData: useDropTarget.GetEventDropData = useStableCallback(
    ({ data, getDataFromInside, getDataFromOutside, input }) => {
      if (!isValidDropTarget(data)) {
        return undefined;
      }

      const cursorPositionInCollectionMs = getCursorPositionInElementMs({
        input,
        elementRef: ref,
      });

      if (data.source === sources.move) {
        const eventData = data as LinearEventDropData;
        const range = engine.getMovedEventRange({
          start: eventData.start,
          end: eventData.end,
          cursorPositionInCollectionMs,
          initialCursorPositionInEventMs: eventData.initialCursorPositionInEventMs,
        });
        return getDataFromInside(eventData, range.start, range.end, 'drag');
      }

      if (data.source === sources.resize) {
        const resizeData = data as LinearResizeDropData;
        const range = engine.getResizedEventRange({
          start: resizeData.start,
          end: resizeData.end,
          side: resizeData.side,
          cursorPositionInCollectionMs,
          initialCursorPositionInEventMs: resizeData.initialCursorPositionInEventMs,
        });
        return getDataFromInside(resizeData, range.start, range.end, 'resize');
      }

      if (sources.fixedDuration != null && data.source === sources.fixedDuration) {
        const start = engine.getDateAtOffset(cursorPositionInCollectionMs);
        const end = adapter.addMinutes(start, getFixedDurationInMinutes!());
        return getDataFromInside(data as InternalDropData, start, end, 'drag');
      }

      if (data.source === sources.external) {
        const offsetMs =
          parameters.externalDropStart === 'last-slot'
            ? Math.min(
                cursorPositionInCollectionMs,
                engine.timeAxisDurationMs - EVENT_DRAG_PRECISION_MS,
              )
            : cursorPositionInCollectionMs;
        return getDataFromOutside(data as ExternalDropData, engine.getDateAtOffset(offsetMs));
      }

      return undefined;
    },
  );

  useDropTarget({
    ref,
    resourceId,
    surfaceType,
    getEventDropData,
    isValidDropTarget,
    addPropertiesToDroppedEvent,
  });

  return { getCursorPositionInElementMs, getDateAtPointer, ref };
}

export namespace useLinearTimeDropTarget {
  export interface Sources {
    move: DropSourceFor<LinearEventData>;
    resize: DropSourceFor<LinearEventData & { side: 'start' | 'end' }>;
    fixedDuration?: DropSourceFor<InternalEventData>;
    external: DropSourceFor<{ eventData: unknown }>;
  }

  interface SharedParameters {
    axis: LinearAxis;
    timeScale: LinearTimeScale;
    constrainEventToTimeAxis: boolean;
    externalDropStart?: 'pointer' | 'last-slot';
    sources: Sources;
    surfaceType: EventSurfaceType;
    resourceId?: SchedulerResourceId | null;
    addPropertiesToDroppedEvent?: () => Partial<SchedulerEvent>;
  }

  export type Parameters = SharedParameters &
    (
      | {
          sources: Sources & { fixedDuration: DropSourceFor<InternalEventData> };
          getFixedDurationInMinutes: () => number;
        }
      | {
          sources: Sources & { fixedDuration?: undefined };
          getFixedDurationInMinutes?: undefined;
        }
    );

  export interface CursorPositionParameters {
    input: PointerInput;
    elementRef: React.RefObject<HTMLElement | null>;
  }
}
