import * as React from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { useEventTimelinePremiumApiRef } from '@mui/x-scheduler-premium/use-event-timeline-premium-api-ref';
import { EventTimelinePremiumView } from '@mui/x-scheduler-headless-premium/models';
import {
  initialEvents,
  resources as allResources,
  defaultVisibleDate,
} from '../../datasets/company-roadmap';

const resources = allResources.slice(0, 5);
const resourceIds = new Set(resources.map((r) => r.id));

export default function ExternalNavigation() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>(() =>
    initialEvents.filter((e) => resourceIds.has(e.resource as string)),
  );
  const [view, setView] = React.useState<EventTimelinePremiumView>('weeks');
  const [visibleDate, setVisibleDate] = React.useState<Date>(defaultVisibleDate);
  const apiRef = useEventTimelinePremiumApiRef();

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton
          onClick={(event) => apiRef.current?.goToPreviousVisibleDate(event)}
        >
          <ChevronLeftIcon />
        </IconButton>
        <Button
          variant="outlined"
          onClick={(event) =>
            apiRef.current?.setVisibleDate({ visibleDate: new Date(), event })
          }
        >
          Today
        </Button>
        <IconButton onClick={(event) => apiRef.current?.goToNextVisibleDate(event)}>
          <ChevronRightIcon />
        </IconButton>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, newView) => {
            if (newView) {
              setView(newView);
            }
          }}
          size="small"
        >
          {(['time', 'days', 'weeks', 'months', 'years'] as const).map((v) => (
            <ToggleButton key={v} value={v}>
              {v}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
      <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
        <EventTimelinePremium
          apiRef={apiRef}
          events={events}
          resources={resources}
          view={view}
          onViewChange={setView}
          visibleDate={visibleDate}
          onVisibleDateChange={setVisibleDate}
          onEventsChange={setEvents}
        />
      </div>
    </Stack>
  );
}
