import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import { TimelineGrid } from '@mui/x-scheduler-headless-premium/timeline-grid';
import { SchedulerResourceId } from '@mui/x-scheduler-headless/models';
import { schedulerResourceSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-headless-premium/use-event-timeline-premium-store-context';
import { getPaletteVariants } from '@mui/x-scheduler/internals';
import { useEventTimelinePremiumStyledContext } from '../../EventTimelinePremiumStyledContext';

const EventTimelinePremiumTitleCellRow = styled(TimelineGrid.TitleRow, {
  name: 'MuiEventTimeline',
  slot: 'TitleCellRow',
})(({ theme }) => ({
  padding: theme.spacing(2),
  paddingLeft: `calc(${theme.spacing(2)} + var(--resource-depth) * ${theme.spacing(2)})`,
  alignContent: 'start',
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
  },
  '&:focus-visible': {
    outline: 'none',
    boxShadow: `inset 0 0 0 2px ${(theme.vars || theme).palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
  },
}));

const EventTimelinePremiumTitleCellRoot = styled(TimelineGrid.Cell, {
  name: 'MuiEventTimeline',
  slot: 'TitleCell',
})(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  variants: getPaletteVariants(theme),
}));

const ResourceLegendColor = styled('span', {
  name: 'MuiEventTimeline',
  slot: 'TitleCellLegendColor',
})({
  width: 10,
  height: 10,
  borderRadius: '50%',
  flexShrink: 0,
  backgroundColor: 'var(--event-surface-accent)',
});

export default function EventTimelinePremiumTitleCell(props: { resourceId: SchedulerResourceId }) {
  const { resourceId } = props;

  // Context hooks
  const store = useEventTimelinePremiumStoreContext();
  const { schedulerId, classes } = useEventTimelinePremiumStyledContext();

  // Selector hooks
  const eventColor = useStore(store, schedulerResourceSelectors.defaultEventColor, resourceId);
  const resource = useStore(store, schedulerResourceSelectors.processedResource, resourceId);
  const depth = useStore(store, schedulerResourceSelectors.resourceDepth, resourceId);

  return (
    <EventTimelinePremiumTitleCellRow
      className={classes.titleCellRow}
      style={{ '--resource-depth': depth } as React.CSSProperties}
    >
      <EventTimelinePremiumTitleCellRoot
        id={`${schedulerId}-EventTimelinePremiumTitleCell-${resourceId}`}
        className={classes.titleCell}
        aria-colindex={1}
        data-palette={eventColor}
      >
        <ResourceLegendColor className={classes.titleCellLegendColor} />
        {resource!.title}
      </EventTimelinePremiumTitleCellRoot>
    </EventTimelinePremiumTitleCellRow>
  );
}
