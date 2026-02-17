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
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../../../data/scheduler/datasets/company-roadmap';

export default function FullEventTimelinePremium() {
  const [events, setEvents] = React.useState(initialEvents);
  const [view, setView] = React.useState('months');
  const [visibleDate, setVisibleDate] = React.useState(defaultVisibleDate);
  const apiRef = useEventTimelinePremiumApiRef();

  const handleViewChange = (_, newView) => {
    if (newView) {
      setView(newView);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 2, flexShrink: 0 }}>
        <IconButton onClick={(event) => apiRef.current?.goToPreviousVisibleDate(event)}>
          <ChevronLeftIcon />
        </IconButton>
        <Button
          variant="outlined"
          onClick={(event) => apiRef.current?.setVisibleDate({ visibleDate: new Date(), event })}
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
          {['time', 'days', 'weeks', 'months', 'years'].map((value) => (
            <ToggleButton key={value} value={value}>
              {value}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <EventTimelinePremium
          apiRef={apiRef}
          events={events}
          resources={resources}
          view={view}
          onViewChange={setView}
          visibleDate={visibleDate}
          onVisibleDateChange={setVisibleDate}
          defaultVisibleDate={defaultVisibleDate}
          onEventsChange={setEvents}
          areEventsDraggable
          areEventsResizable
        />
      </div>
    </div>
  );
}
