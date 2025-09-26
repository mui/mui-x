'use client';
import * as React from 'react';
import { DayViewProps } from './DayView.types';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import { useInitializeView } from '../../primitives/utils/useInitializeView';
import { isMultiDayEvent, processDate } from '../../primitives/utils/event-utils';
import {
  BuildOccurrencesPositionLookupParameters,
  CalendarViewConfig,
} from '../../primitives/models';
import { buildOccurrencePositionLookupForDayGrid } from '../../primitives/use-event-occurrences-with-day-grid-position';

function buildOccurrencesPositionLookupForDayTimeGrid(
  parameters: BuildOccurrencesPositionLookupParameters,
) {
  const occurrencesWithDayGridPosition = buildOccurrencePositionLookupForDayGrid({
    ...parameters,
    shouldAddPosition: isMultiDayEvent,
  });
}

const viewConfig: CalendarViewConfig = {
  siblingVisibleDateGetter: ({ adapter, date, delta }) => adapter.addDays(date, delta),
  getVisibleDays: ({ adapter, visibleDate }) => [processDate(visibleDate, adapter)],
  buildOccurrencesPositionLookup: buildOccurrencesPositionLookupForDayTimeGrid,
};

export const DayView = React.memo(
  React.forwardRef(function DayView(
    props: DayViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { days } = useInitializeView(viewConfig);

    return <DayTimeGrid ref={forwardedRef} days={days} {...props} />;
  }),
);
