import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import { EventTimelinePremium as TimelinePrimitive } from '@mui/x-scheduler-headless-premium/event-timeline-premium';
import { SchedulerResourceId } from '@mui/x-scheduler-headless/models';
import { schedulerResourceSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-headless-premium/use-event-timeline-premium-store-context';
import { getPaletteVariants } from '@mui/x-scheduler/internals';
import { useEventTimelinePremiumStyledContext } from '../../EventTimelinePremiumStyledContext';

const EventTimelinePremiumTitleCellRow = styled(TimelinePrimitive.Row, {
  name: 'MuiEventTimeline',
  slot: 'TitleCellRow',
})(({ theme }) => ({
  padding: theme.spacing(2),
  alignContent: 'start',
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const EventTimelinePremiumTitleCellRoot = styled(TimelinePrimitive.Cell, {
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
})(({ theme }) => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  flexShrink: 0,
  backgroundColor: 'var(--event-surface-accent)',
  variants: getPaletteVariants(theme),
}));

export default function EventTimelinePremiumTitleCell(props: { resourceId: SchedulerResourceId }) {
  const { resourceId } = props;

  // Context hooks
  const store = useEventTimelinePremiumStoreContext();
  const { classes } = useEventTimelinePremiumStyledContext();

  // Selector hooks
  const eventColor = useStore(store, schedulerResourceSelectors.defaultEventColor, resourceId);
  const resource = useStore(store, schedulerResourceSelectors.processedResource, resourceId);

  return (
    <EventTimelinePremiumTitleCellRow className={classes.titleCellRow}>
      <EventTimelinePremiumTitleCellRoot
        id={`EventTimelinePremiumTitleCell-${resourceId}`}
        className={classes.titleCell}
      >
        <ResourceLegendColor
          className={classes.titleCellLegendColor}
          data-palette={eventColor}
        />
        {resource!.title}
      </EventTimelinePremiumTitleCellRoot>
    </EventTimelinePremiumTitleCellRow>
  );
}
