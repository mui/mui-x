import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { Timeline as TimelinePrimitive } from '@mui/x-scheduler-headless/timeline';
import { SchedulerResource } from '@mui/x-scheduler-headless/models';
import { schedulerResourceSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useTimelineStoreContext } from '@mui/x-scheduler-headless/use-timeline-store-context';
import { getColorClassName } from '../../../internals/utils/color-utils';

export default function TimelineTitleCell({ resource }: { resource: SchedulerResource }) {
  const store = useTimelineStoreContext();
  const eventColor = useStore(store, schedulerResourceSelectors.defaultEventColor, resource.id);

  return (
    <TimelinePrimitive.Row className="TimelineRow">
      <TimelinePrimitive.Cell
        className={clsx('TimelineCell', 'TimelineTitleCell')}
        id={`TimelineTitleCell-${resource.id}`}
      >
        <span className={clsx('ResourceLegendColor', getColorClassName(eventColor))} />

        {resource.title}
      </TimelinePrimitive.Cell>
    </TimelinePrimitive.Row>
  );
}
