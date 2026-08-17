import * as React from 'react';
import {
  SchedulerEvent,
  SchedulerResource,
  SchedulerRenderableEventOccurrence,
} from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

const defaultVisibleDate = new Date('2025-07-01T00:00:00');

const initialEvents: SchedulerEvent[] = [
  {
    id: 'team-sync',
    title: 'Team Sync',
    start: '2025-07-01T09:00:00',
    end: '2025-07-01T10:00:00',
    resource: 'work',
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

export default function CustomEditingUI() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);
  const [editedOccurrence, setEditedOccurrence] =
    React.useState<SchedulerRenderableEventOccurrence | null>(null);

  const isNewEvent =
    editedOccurrence != null &&
    !events.some((event) => event.id === editedOccurrence.id);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editedOccurrence == null) {
      return;
    }

    const title =
      (new FormData(event.currentTarget).get('title') as string) || '(No title)';
    if (isNewEvent) {
      setEvents([
        ...events,
        {
          id: `custom-${Date.now()}`,
          title,
          start: editedOccurrence.displayTimezone.start.value,
          end: editedOccurrence.displayTimezone.end.value,
        },
      ]);
    } else {
      setEvents(
        events.map((item) =>
          item.id === editedOccurrence.id ? { ...item, title } : item,
        ),
      );
    }
    setEditedOccurrence(null);
  };

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <EventCalendar
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        defaultPreferences={{ isSidePanelOpen: false }}
        onEventEditingStart={(occurrence, eventDetails) => {
          eventDetails.cancel();
          setEditedOccurrence(occurrence);
        }}
      />
      <Dialog
        open={editedOccurrence != null}
        onClose={() => setEditedOccurrence(null)}
        fullWidth
        maxWidth="xs"
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>{isNewEvent ? 'New event' : 'Edit event'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              name="title"
              label="Title"
              margin="dense"
              defaultValue={isNewEvent ? '' : (editedOccurrence?.title ?? '')}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditedOccurrence(null)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
