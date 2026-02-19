import * as React from 'react';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { DatasetSwitcher } from '../../../../src/modules/components/DatasetSwitcher';
import { ExperimentLayout } from '../../../../src/modules/components/ExperimentLayout';
import {
  initialEvents as companyRoadmapEvents,
  defaultVisibleDate as companyRoadmapDate,
  resources as companyRoadmapResources,
} from '../../../../data/scheduler/datasets/company-roadmap';
import {
  initialEvents as allDayEvents,
  defaultVisibleDate as allDayDate,
  resources as allDayResources,
} from '../../../../data/scheduler/datasets/all-day-events';
import {
  initialEvents as apartmentBookingsEvents,
  defaultVisibleDate as apartmentBookingsDate,
  resources as apartmentBookingsResources,
} from '../../../../data/scheduler/datasets/apartment-bookings';
import {
  initialEvents as carRentalEvents,
  defaultVisibleDate as carRentalDate,
  resources as carRentalResources,
} from '../../../../data/scheduler/datasets/car-rental';
import {
  initialEventsWithResources as timelinePaletteEvents,
  defaultVisibleDate as timelinePaletteDate,
  resourcesWithColors as timelinePaletteResources,
} from '../../../../data/scheduler/datasets/timeline-palette-demo';

const datasets = [
  {
    label: 'Company Roadmap',
    initialEvents: companyRoadmapEvents,
    defaultVisibleDate: companyRoadmapDate,
    resources: companyRoadmapResources,
  },
  {
    label: 'All-Day Events',
    initialEvents: allDayEvents,
    defaultVisibleDate: allDayDate,
    resources: allDayResources,
  },
  {
    label: 'Apartment Bookings',
    initialEvents: apartmentBookingsEvents,
    defaultVisibleDate: apartmentBookingsDate,
    resources: apartmentBookingsResources,
  },
  {
    label: 'Car Rental',
    initialEvents: carRentalEvents,
    defaultVisibleDate: carRentalDate,
    resources: carRentalResources,
  },
  {
    label: 'Color Palette',
    initialEvents: timelinePaletteEvents,
    defaultVisibleDate: timelinePaletteDate,
    resources: timelinePaletteResources,
  },
];

function SchedulerContent({ dataset }) {
  const [events, setEvents] = React.useState(dataset.initialEvents);

  return (
    <EventTimelinePremium
      events={events}
      resources={dataset.resources}
      defaultVisibleDate={dataset.defaultVisibleDate}
      onEventsChange={setEvents}
      areEventsDraggable
      areEventsResizable
    />
  );
}

export default function EventTimelinePremiumExperiment() {
  const [datasetIndex, setDatasetIndex] = React.useState(0);

  return (
    <ExperimentLayout>
      <SchedulerContent key={datasetIndex} dataset={datasets[datasetIndex]} />
      <DatasetSwitcher
        datasets={datasets}
        selectedIndex={datasetIndex}
        onSelectDataset={setDatasetIndex}
      />
    </ExperimentLayout>
  );
}
