import * as React from 'react';
import clsx from 'clsx';
import { Timeline as TimelinePrimitive } from '../../../../primitives/timeline';
import { getColorClassName } from '../../../internals/utils/color-utils';
import { DEFAULT_EVENT_COLOR } from '../../../../primitives/utils/SchedulerStore';
import { CalendarResource } from '../../../../primitives';

export default function TimelineTitleCell({ resource }: { resource: CalendarResource }) {
  return (
    <TimelinePrimitive.Row className="TimelineRow">
      <TimelinePrimitive.Cell
        className={clsx('TimelineCell', 'TimelineTitleCell')}
        id={`TimelineTitleCell-${resource!.id}`}
      >
        <span
          className={clsx(
            'ResourceLegendColor',
            getColorClassName(resource!.eventColor ?? DEFAULT_EVENT_COLOR),
          )}
        />

        {resource!.name}
      </TimelinePrimitive.Cell>
    </TimelinePrimitive.Row>
  );
}
