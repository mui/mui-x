import * as React from 'react';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import {
  EventDialogGeneralTabContent,
  EventDialogSectionFieldset,
  EventDialogSectionHeaderTitle,
  useEventDialogFormField,
} from '@mui/x-scheduler/event-dialog';

interface DemoEvent extends SchedulerEvent {
  meetingLink?: string;
}

function MeetingLinkSection() {
  const link = useEventDialogFormField('meetingLink', {
    defaultValue: '',
    validate: (value) =>
      value && !/^https?:\/\//.test(value)
        ? 'The meeting link must start with http:// or https://'
        : null,
  });
  return (
    <EventDialogSectionFieldset>
      <EventDialogSectionHeaderTitle>Meeting link</EventDialogSectionHeaderTitle>
      <TextField
        label="Link"
        value={link.value}
        onChange={(event) => link.setValue(event.target.value)}
        error={link.error != null}
        helperText={link.error}
      />
    </EventDialogSectionFieldset>
  );
}

// Defined at module scope: an inline component would remount on every form render.
function GeneralTabWithMeetingLink() {
  return (
    <React.Fragment>
      <EventDialogGeneralTabContent />
      <Divider />
      <MeetingLinkSection />
    </React.Fragment>
  );
}

const defaultVisibleDate = new Date('2025-07-01T00:00:00');

const initialEvents: DemoEvent[] = [
  {
    id: 'team-sync',
    title: 'Team Sync',
    start: '2025-07-01T09:00:00',
    end: '2025-07-01T10:00:00',
    resource: 'work',
    meetingLink: 'https://example.com/team-sync',
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

export default function CustomValidation() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <EventCalendar
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        defaultPreferences={{ isSidePanelOpen: false }}
        slots={{ eventDialogGeneralTab: GeneralTabWithMeetingLink }}
      />
    </div>
  );
}
