import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { Timeline as TimelinePrimitive } from '@mui/x-scheduler-headless/timeline';
import { SchedulerResourceId } from '@mui/x-scheduler-headless/models';
import { schedulerResourceSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useTimelineStoreContext } from '@mui/x-scheduler-headless/use-timeline-store-context';
import { getColorClassName } from '../../../internals/utils/color-utils';

export default function TimelineTitleCell(props: { resourceId: SchedulerResourceId }) {
  const { resourceId } = props;

  // Context hooks
  const store = useTimelineStoreContext();

  // Selector hooks
  const eventColor = useStore(store, schedulerResourceSelectors.defaultEventColor, resourceId);
  const resource = useStore(store, schedulerResourceSelectors.processedResource, resourceId);

  return (
    <TimelinePrimitive.Row className="TimelineRow">
      <TimelinePrimitive.Cell
        className={clsx('TimelineCell', 'TimelineTitleCell')}
        id={`TimelineTitleCell-${resourceId}`}
      >
        <span className={clsx('ResourceLegendColor', getColorClassName(eventColor))} />

        {resource!.title}
      </TimelinePrimitive.Cell>
    </TimelinePrimitive.Row>
  );
}
