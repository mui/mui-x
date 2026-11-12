import * as React from 'react';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { createChartsFeature } from '@mui/x-scheduler-premium/charts';
import { ChartsRenderer } from '@mui/x-charts-premium/ChartsRenderer';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from 'docs/data/scheduler/datasets/personal-agenda';

const features = { charts: createChartsFeature({ renderer: ChartsRenderer }) };

const localeText = {
  chartsEventsPerDay: 'Eventos por día',
  chartsEventsPerWeek: 'Eventos por semana',
  chartsHoursPerDay: 'Horas por día',
  chartsHoursPerWeek: 'Horas por semana',
  chartsShareByResource: 'Reparto por recurso',
  labelNoResource: 'Sin recurso',
};

export default function LocalizedCharts() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '760px', width: '100%' }}>
      <EventCalendarPremium
        features={features}
        charts={{ cards: ['byDay', 'byResource'] }}
        localeText={localeText}
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
      />
    </div>
  );
}
