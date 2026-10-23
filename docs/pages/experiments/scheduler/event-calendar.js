import * as React from 'react';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { DatasetSwitcher } from 'docs/src/modules/components/DatasetSwitcher';
import { ExperimentLayout } from 'docs/src/modules/components/ExperimentLayout';
import {
  initialEvents as personalAgendaEvents,
  defaultVisibleDate as personalAgendaDate,
  resources as personalAgendaResources,
} from 'docs/data/scheduler/datasets/personal-agenda';
import {
  initialEvents as allDayEvents,
  defaultVisibleDate as allDayDate,
  resources as allDayResources,
} from 'docs/data/scheduler/datasets/all-day-events';
import {
  initialEvents as recurringEvents,
  defaultVisibleDate as recurringDate,
  resources as recurringResources,
} from 'docs/data/scheduler/datasets/recurring-events';
import {
  initialEventsWithResources as calendarPaletteEvents,
  defaultVisibleDate as calendarPaletteDate,
  resources as calendarPaletteResources,
} from 'docs/data/scheduler/datasets/calendar-palette-demo';

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
    <EventCalendar
      events={events}
      resources={dataset.resources}
      defaultVisibleDate={dataset.defaultVisibleDate}
      onEventsChange={setEvents}
      areEventsDraggable
      areEventsResizable
    />
  );
}

export default function EventCalendarExperiment() {
  const [datasetIndex, setDatasetIndex] = React.useState(0);

  return (
    <React.Fragment>
      <SchedulerContent key={datasetIndex} dataset={datasets[datasetIndex]} />
      <DatasetSwitcher
        datasets={datasets}
        selectedIndex={datasetIndex}
        onSelectDataset={setDatasetIndex}
      />
    </React.Fragment>
  );
}

EventCalendarExperiment.getLayout = (page) => (
  <ExperimentLayout fullScreen>{page}</ExperimentLayout>
);
