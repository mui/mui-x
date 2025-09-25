import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { useTimelineStoreContext } from '../../../../primitives/utils/useTimelineStoreContext';
import { Timeline as TimelinePrimitive } from '../../../../primitives/timeline';
import { selectors } from '../../../../primitives/use-timeline';
import { getColorClassName } from '../../../internals/utils/color-utils';
import { DEFAULT_EVENT_COLOR } from '../../../../primitives/utils/SchedulerStore';

export default function TimelineTitleCell({ resourceId }: { resourceId: string }) {
  const store = useTimelineStoreContext();
  const resource = useStore(store, selectors.resource, resourceId);
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
