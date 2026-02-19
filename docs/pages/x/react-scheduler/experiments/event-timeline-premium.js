import * as React from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { useEventTimelinePremiumApiRef } from '@mui/x-scheduler-premium/use-event-timeline-premium-api-ref';
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
  const [view, setView] = React.useState('months');
  const [visibleDate, setVisibleDate] = React.useState(dataset.defaultVisibleDate);
  const apiRef = useEventTimelinePremiumApiRef();

  const handleViewChange = (event) => {
    setView(event.target.value);
  };

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton onClick={(event) => apiRef.current?.goToPreviousVisibleDate(event)}>
          <ChevronLeftIcon />
        </IconButton>
        <Button
          variant="outlined"
          onClick={(event) =>
            apiRef.current?.setVisibleDate({ visibleDate: new Date(), event })
          }
        >
          Today
        </Button>
        <IconButton onClick={(event) => apiRef.current?.goToNextVisibleDate(event)}>
          <ChevronRightIcon />
        </IconButton>
        <Select value={view} onChange={handleViewChange} size="small">
          {['time', 'days', 'weeks', 'months', 'years'].map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <EventTimelinePremium
          apiRef={apiRef}
          events={events}
          resources={dataset.resources}
          view={view}
          onViewChange={setView}
          visibleDate={visibleDate}
          onVisibleDateChange={setVisibleDate}
          onEventsChange={setEvents}
          areEventsDraggable
          areEventsResizable
        />
      </div>
    </Stack>
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
