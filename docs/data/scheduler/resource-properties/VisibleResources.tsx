import * as React from 'react';
import { SchedulerResourceId } from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { initialEvents, resources, defaultVisibleDate } from '../datasets/personal-agenda';

export default function VisibleResources() {
  const [events, setEvents] = React.useState(initialEvents);
  const [visibleResources, setVisibleResources] = React.useState<
    Map<SchedulerResourceId, boolean>
  >(
    () =>
      new Map([
        ['holidays', false],
        ['medical', false],
      ]),
  );

  const handleVisibleResourcesChange = React.useCallback(
    (newVisibleResources: Map<SchedulerResourceId, boolean>) => {
      setVisibleResources(newVisibleResources);
    },
    [],
  );

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <EventCalendar
        events={events}
        onEventsChange={setEvents}
        defaultVisibleDate={defaultVisibleDate}
        resources={resources}
        visibleResources={visibleResources}
        onVisibleResourcesChange={handleVisibleResourcesChange}
      />
    </div>
  );
}
