import * as React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import {
  DateTimeSection,
  ResourceAndColorSection,
  DescriptionSection,
  SectionFieldset,
  SectionHeaderTitle,
  useEventDialogFormField,
} from '@mui/x-scheduler/event-dialog';

function PrioritySection() {
  const priority = useEventDialogFormField<string>('priority', {
    defaultValue: 'medium',
  });
  return (
    <SectionFieldset>
      <SectionHeaderTitle>Priority</SectionHeaderTitle>
      <TextField
        select
        label="Priority"
        value={priority.value}
        onChange={(event) => priority.setValue(event.target.value)}
      >
        <MenuItem value="low">Low</MenuItem>
        <MenuItem value="medium">Medium</MenuItem>
        <MenuItem value="high">High</MenuItem>
      </TextField>
    </SectionFieldset>
  );
}

// Defined at module scope: an inline component would remount on every form render.
function CustomGeneralTabContent() {
  return (
    <React.Fragment>
      <DateTimeSection />
      <Divider />
      <PrioritySection />
      <Divider />
      <ResourceAndColorSection />
      <Divider />
      <DescriptionSection />
    </React.Fragment>
  );
}

interface DemoEvent extends SchedulerEvent {
  priority?: string;
}

const defaultVisibleDate = new Date('2025-07-01T00:00:00');

const initialEvents: DemoEvent[] = [
  {
    id: 'team-sync',
    title: 'Team Sync',
    start: '2025-07-01T09:00:00',
    end: '2025-07-01T10:00:00',
    resource: 'work',
    priority: 'high',
  },
  {
    id: 'lunch',
    title: 'Lunch with Sarah',
    start: '2025-07-02T12:00:00',
    end: '2025-07-02T13:00:00',
    resource: 'personal',
  },
];

const resources: SchedulerResource[] = [
  { id: 'work', title: 'Work', eventColor: 'purple' },
  { id: 'personal', title: 'Personal', eventColor: 'teal' },
];

export default function CustomGeneralTab() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <EventCalendar
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        defaultPreferences={{ isSidePanelOpen: false }}
        slots={{ eventDialogGeneralTab: CustomGeneralTabContent }}
      />
    </div>
  );
}
