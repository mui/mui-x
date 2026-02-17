import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import {
  SchedulerEvent,
  SchedulerEventId,
  SchedulerResource,
} from '@mui/x-scheduler-headless/models';
import {
  resources as agendaResources,
  defaultVisibleDate,
} from '../../datasets/personal-agenda';

const flatResources: SchedulerResource[] = agendaResources.map((r) => ({
  id: r.id,
  title: r.title,
  eventColor: r.eventColor,
}));

const TITLES = [
  'Daily Standup',
  'Client Call',
  'Design Review',
  '1:1 Meeting',
  'Planning Session',
  'Code Review',
  'Remote Work',
  'Workshop',
  'Dentist Appointment',
  'Dinner with Friends',
  'Shopping',
];

type DateLike = Date | string | number;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

function clampToRange(date: Date, start: Date, end: Date) {
  if (date < start) {
    return start;
  }
  if (date > end) {
    return end;
  }
  return date;
}

function generateRandomEventsInRange(
  rangeStart: DateLike,
  rangeEnd: DateLike,
  resources: SchedulerResource[],
): SchedulerEvent[] {
  const start = new Date(rangeStart);
  const end = new Date(rangeEnd);

  const msStart = start.getTime();
  const msEnd = end.getTime();

  if (msEnd <= msStart || resources.length === 0) {
    return [];
  }

  const eventsCount = randomInt(10, 30);
  const events: SchedulerEvent[] = [];

  for (let i = 0; i < eventsCount; i += 1) {
    const startMs = randomInt(msStart, msEnd - 60 * 60 * 1000);
    const baseStart = new Date(startMs);

    const hour = randomInt(8, 20);
    const minute = randomChoice([0, 15, 30, 45]);

    const eventStart = new Date(baseStart);
    eventStart.setHours(hour, minute, 0, 0);

    const durationMinutes = randomChoice([30, 45, 60, 90, 120, 180]);
    const eventEnd = new Date(eventStart.getTime() + durationMinutes * 60 * 1000);

    const clampedEnd = clampToRange(eventEnd, start, end);
    if (clampedEnd <= eventStart) {
      continue;
    }

    const resource = randomChoice(resources);

    const allDay = Math.random() < 0.15;
    const readOnly = Math.random() < 0.2;

    const id = `event-${eventStart.getTime()}-${i}`;

    events.push({
      id,
      start: allDay ? new Date(eventStart.setHours(0, 0, 0, 0)) : eventStart,
      end: allDay ? new Date(eventStart.setHours(23, 59, 59, 999)) : clampedEnd,
      title: randomChoice(TITLES),
      resource: resource.id,
      allDay,
      readOnly,
    });
  }

  return events;
}

const resolveUpdate = async (_params: {
  deleted: SchedulerEventId[];
  updated: SchedulerEventId[];
  created: SchedulerEventId[];
}) => {
  return new Promise<{ success: boolean }>((resolve) => {
    resolve({ success: true });
  });
};

export default function ErrorHandling() {
  const [failRequests, setFailRequests] = React.useState(false);

  const fetchData = async (start: Date, end: Date): Promise<SchedulerEvent[]> => {
    const generated = generateRandomEventsInRange(start, end, flatResources);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (failRequests) {
          reject(new Error('Error fetching data'));
        } else {
          resolve(generated);
        }
      }, 1000);
    });
  };

  return (
    <Stack spacing={2} width="100%">
      <FormControlLabel
        control={
          <Switch
            checked={failRequests}
            onChange={(event) => setFailRequests(event.target.checked)}
          />
        }
        label="Fail requests"
      />
      <div style={{ height: '700px', width: '100%' }}>
        <EventCalendarPremium
          events={[]}
          dataSource={{ getEvents: fetchData, updateEvents: resolveUpdate }}
          resources={flatResources}
          defaultVisibleDate={defaultVisibleDate}
          defaultPreferences={{ isSidePanelOpen: false }}
        />
      </div>
    </Stack>
  );
}
