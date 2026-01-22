import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import { Timeline as TimelinePrimitive } from '@mui/x-scheduler-headless-premium/timeline-premium';
import { SchedulerResourceId } from '@mui/x-scheduler-headless/models';
import { schedulerResourceSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useTimelinePremiumStoreContext } from '@mui/x-scheduler-headless-premium/use-timeline-premium-store-context';
import { getDataPaletteProps } from '@mui/x-scheduler/internals';

const TimelineRow = styled(TimelinePrimitive.Row, {
  name: 'MuiEventTimeline',
  slot: 'TitleCellRow',
})(({ theme }) => ({
  padding: theme.spacing(2),
  alignContent: 'start',
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const TimelineTitleCellRoot = styled(TimelinePrimitive.Cell, {
  name: 'MuiEventTimeline',
  slot: 'TitleCell',
})(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const ResourceLegendColor = styled('span', {
  name: 'MuiEventTimeline',
  slot: 'TitleCellLegendColor',
})({
  width: 10,
  height: 10,
  borderRadius: '50%',
  flexShrink: 0,
  backgroundColor: 'var(--event-color-9)',
});

export default function TimelineTitleCell(props: { resourceId: SchedulerResourceId }) {
  const { resourceId } = props;

  // Context hooks
  const store = useTimelinePremiumStoreContext();

  // Selector hooks
  const eventColor = useStore(store, schedulerResourceSelectors.defaultEventColor, resourceId);
  const resource = useStore(store, schedulerResourceSelectors.processedResource, resourceId);

  return (
    <TimelineRow>
      <TimelineTitleCellRoot id={`TimelineTitleCell-${resourceId}`}>
        <ResourceLegendColor {...getDataPaletteProps(eventColor)} />
        {resource!.title}
      </TimelineTitleCellRoot>
    </TimelineRow>
  );
}
