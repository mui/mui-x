import * as React from 'react';
import clsx from 'clsx';
import { Timeline as TimelinePrimitive } from '@mui/x-scheduler-headless/timeline';
import { DEFAULT_EVENT_COLOR } from '@mui/x-scheduler-headless/constants';
import { CalendarResource } from '@mui/x-scheduler-headless/models';
import { getColorClassName } from '../../../internals/utils/color-utils';

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

        {resource!.title}
      </TimelinePrimitive.Cell>
    </TimelinePrimitive.Row>
  );
}
