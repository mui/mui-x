import * as React from 'react';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { DatasetSwitcher } from '../../../../src/modules/components/DatasetSwitcher';
import {
  initialEvents as personalAgendaEvents,
  defaultVisibleDate as personalAgendaDate,
  resources as personalAgendaResources,
} from '../../../../data/scheduler/datasets/personal-agenda';
import {
  initialEvents as allDayEvents,
  defaultVisibleDate as allDayDate,
  resources as allDayResources,
} from '../../../../data/scheduler/datasets/all-day-events';
import {
  initialEvents as recurringEvents,
  defaultVisibleDate as recurringDate,
  resources as recurringResources,
} from '../../../../data/scheduler/datasets/recurring-events';
import {
  initialEventsWithResources as calendarPaletteEvents,
  defaultVisibleDate as calendarPaletteDate,
  resources as calendarPaletteResources,
} from '../../../../data/scheduler/datasets/calendar-palette-demo';

const datasets = [
  {
    label: 'Personal Agenda',
    initialEvents: personalAgendaEvents,
    defaultVisibleDate: personalAgendaDate,
    resources: personalAgendaResources,
  },
  {
    label: 'All-Day Events',
    initialEvents: allDayEvents,
    defaultVisibleDate: allDayDate,
    resources: allDayResources,
  },
  {
    label: 'Recurring Events',
    initialEvents: recurringEvents,
    defaultVisibleDate: recurringDate,
    resources: recurringResources,
  },
  {
    label: 'Color Palette',
    initialEvents: calendarPaletteEvents,
    defaultVisibleDate: calendarPaletteDate,
    resources: calendarPaletteResources,
  },
];

function SchedulerContent({ dataset }) {
  const [events, setEvents] = React.useState(dataset.initialEvents);

  return (
    <EventCalendarPremium
      events={events}
      resources={dataset.resources}
      defaultVisibleDate={dataset.defaultVisibleDate}
      onEventsChange={setEvents}
      areEventsDraggable
      areEventsResizable
    />
  );
}

export default function EventCalendarPremiumExperiment() {
  const [datasetIndex, setDatasetIndex] = React.useState(0);

  return (
    <div style={{ display: 'flex', padding: 12, height: '100vh' }}>
      <SchedulerContent key={datasetIndex} dataset={datasets[datasetIndex]} />
      <DatasetSwitcher
        datasets={datasets}
        selectedIndex={datasetIndex}
        onSelectDataset={setDatasetIndex}
      />
    </div>
  );
}
