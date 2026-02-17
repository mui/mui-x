import * as React from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { useEventTimelinePremiumApiRef } from '@mui/x-scheduler-premium/use-event-timeline-premium-api-ref';
import { EventTimelinePremiumView } from '@mui/x-scheduler-headless-premium/models';
import {
  initialEvents,
  resources as allResources,
  defaultVisibleDate,
} from '../../datasets/company-roadmap';

const resources = allResources.slice(0, 5);

export default function ExternalNavigation() {
  const [events, setEvents] = React.useState(initialEvents);
  const [view, setView] = React.useState<EventTimelinePremiumView>('weeks');
  const [visibleDate, setVisibleDate] = React.useState<Date>(defaultVisibleDate);
  const apiRef = useEventTimelinePremiumApiRef();

  const handleViewChange = (_: React.MouseEvent, newView: EventTimelinePremiumView | null) => {
    if (newView) {
      setView(newView);
    }
  };

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
          onChange={handleViewChange}
          size="small"
        >
          {(['time', 'days', 'weeks', 'months', 'years'] as const).map((value) => (
            <ToggleButton key={value} value={value}>
              {value}
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
