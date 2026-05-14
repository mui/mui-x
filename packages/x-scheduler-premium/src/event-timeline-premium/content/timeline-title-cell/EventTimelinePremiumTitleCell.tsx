import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import { TimelineGrid } from '@mui/x-scheduler-internals-premium/timeline-grid';
import { SchedulerResourceId } from '@mui/x-scheduler-internals/models';
import { schedulerResourceSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import { getPaletteVariants } from '@mui/x-scheduler/internals';
import { Virtualization } from '@mui/x-virtualizer';
import { useEventTimelinePremiumStyledContext } from '../../EventTimelinePremiumStyledContext';
import { useEventTimelinePremiumVirtualizerStore } from '../EventTimelinePremiumVirtualizerContext';

const EventTimelinePremiumTitleCellRoot = styled(TimelineGrid.TitleRow, {
  name: 'MuiEventTimeline',
  slot: 'TitleCell',
})(({ theme }) => ({
  flex: '0 0 auto',
  width: 'var(--title-column-width)',
  borderRight: `1px solid ${(theme.vars || theme).palette.divider}`,
  overflow: 'hidden',
  padding: theme.spacing(2),
  paddingLeft: `calc(${theme.spacing(2)} + var(--resource-depth) * ${theme.spacing(2)})`,
  alignContent: 'start',
  fontSize: theme.typography.body2.fontSize,
  display: 'flex',
  alignItems: 'start',
  gap: theme.spacing(1),
  position: 'absolute',
  height: '100%',
  zIndex: 3,
  backgroundColor: (theme.vars || theme).palette.background.default,
  variants: getPaletteVariants(theme),
  '&:focus-visible': {
    outline: 'none',
    boxShadow: `inset 0 0 0 2px ${(theme.vars || theme).palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
  },
}));

const EventTimelinePremiumTitleCellContent = styled('span', {
  name: 'MuiEventTimeline',
  slot: 'TitleCellContent',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1),
  minWidth: 0,
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
  const virtualizerStore = useEventTimelinePremiumVirtualizerStore();
  const { schedulerId, classes } = useEventTimelinePremiumStyledContext();

  // Selector hooks
  const eventColor = useStore(store, schedulerResourceSelectors.defaultEventColor, resourceId);
  const resource = useStore(store, schedulerResourceSelectors.processedResource, resourceId);
  const depth = useStore(store, schedulerResourceSelectors.resourceDepth, resourceId);
  const pinnedLeftOffset = virtualizerStore.use(Virtualization.selectors.pinnedLeftOffsetSelector);

  return (
    <EventTimelinePremiumTitleCellRoot
      id={`${schedulerId}-EventTimelinePremiumTitleCell-${resourceId}`}
      className={classes.titleCell}
      style={{ '--resource-depth': depth, left: pinnedLeftOffset } as React.CSSProperties}
      data-palette={eventColor}
    >
      <EventTimelinePremiumTitleCellContent className={classes.titleCellContent}>
        <ResourceLegendColor className={classes.titleCellLegendColor} />
        {resource!.title}
      </EventTimelinePremiumTitleCellContent>
    </EventTimelinePremiumTitleCellRoot>
  );
}
