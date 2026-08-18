import * as React from 'react';

import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

const defaultVisibleDate = new Date('2025-07-01T00:00:00');

const initialEvents = [
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

const resources = [
  { id: 'work', title: 'Work', eventColor: 'purple' },
  { id: 'personal', title: 'Personal', eventColor: 'teal' },
];

export default function CustomEditingUI() {
  const [events, setEvents] = React.useState(initialEvents);
  const [editedEvent, setEditedEvent] = React.useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editedEvent == null) {
      return;
    }

    const { occurrence, isNew } = editedEvent;
    const title = new FormData(event.currentTarget).get('title') || '(No title)';
    if (isNew) {
      setEvents([
        ...events,
        {
          id: `custom-${Date.now()}`,
          title,
          start: new Date(occurrence.displayTimezone.start.timestamp).toISOString(),
          end: new Date(occurrence.displayTimezone.end.timestamp).toISOString(),
        },
      ]);
    } else {
      setEvents(
        events.map((item) =>
          item.id === occurrence.id ? { ...item, title } : item,
        ),
      );
    }
    setEditedEvent(null);
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
          setEditedEvent({ occurrence, isNew: eventDetails.reason === 'creation' });
        }}
      />
      <Dialog
        open={editedEvent != null}
        onClose={() => setEditedEvent(null)}
        fullWidth
        maxWidth="xs"
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editedEvent?.isNew ? 'New event' : 'Edit event'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              name="title"
              label="Title"
              margin="dense"
              defaultValue={
                editedEvent?.isNew ? '' : (editedEvent?.occurrence.title ?? '')
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditedEvent(null)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
