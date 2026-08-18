import * as React from 'react';
import {
  SchedulerEvent,
  SchedulerRenderableEventOccurrence,
} from '@mui/x-scheduler/models';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../../datasets/company-roadmap';

interface EditedEvent {
  occurrence: SchedulerRenderableEventOccurrence;
  isNew: boolean;
}

export default function CustomEditingUI() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);
  const [editedEvent, setEditedEvent] = React.useState<EditedEvent | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editedEvent == null) {
      return;
    }

    const { occurrence, isNew } = editedEvent;
    const title =
      (new FormData(event.currentTarget).get('title') as string) || '(No title)';
    if (isNew) {
      setEvents([
        ...events,
        {
          id: `custom-${Date.now()}`,
          title,
          start: new Date(occurrence.displayTimezone.start.timestamp).toISOString(),
          end: new Date(occurrence.displayTimezone.end.timestamp).toISOString(),
          allDay: occurrence.allDay,
          resource: occurrence.resource,
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
    <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
      <EventTimelinePremium
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        defaultPreset="monthAndYear"
        onEventEditingStart={(_occurrence, eventDetails) => {
          eventDetails.cancel();
          setEditedEvent({
            occurrence: eventDetails.occurrence,
            isNew: eventDetails.reason === 'creation',
          });
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
