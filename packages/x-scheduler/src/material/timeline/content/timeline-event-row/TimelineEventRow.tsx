'use client';
import * as React from 'react';
import { Timeline as TimelinePrimitive } from '../../../../primitives/timeline';
import { useEventOccurrencesWithTimelinePosition } from '../../../../primitives/use-event-occurrences-with-timeline-position';
import { TimelineEvent } from './timeline-event';
import { TimelineEventRowProps } from './TimelineEventRow.types';

export default function TimelineEventRow({ start, end, occurrences }: TimelineEventRowProps) {
  const occurrencesWithPosition = useEventOccurrencesWithTimelinePosition({
    occurrences,
    maxSpan: 1,
  });

  return (
    <TimelinePrimitive.EventRow
      className="TimelineEventRow"
      start={start}
      end={end}
      style={{} as React.CSSProperties}
    >
      {occurrencesWithPosition.occurrences.map((occurrence) => (
        <TimelineEvent
          key={occurrence.key}
          occurrence={occurrence}
          ariaLabelledBy=""
          variant="regular"
        />
      ))}
    </TimelinePrimitive.EventRow>
  );
}
