import * as React from 'react';
import { DateTime } from 'luxon';
import { screen } from '@mui/internal-test-utils';
import { createSchedulerRenderer } from 'test/utils/scheduler';
import { Timeline } from '@mui/x-scheduler/material/timeline';
import { CalendarEvent, CalendarResource } from '@mui/x-scheduler/primitives';

const baseResources: CalendarResource[] = [
  { id: 'resource-1', name: 'Engineering', eventColor: 'blue' },
  { id: 'resource-2', name: 'Design', eventColor: 'jade' },
];

const baseEvents: CalendarEvent[] = [
  {
    id: 'event-1',
    title: 'Spec Review',
    start: DateTime.fromISO('2025-07-03T09:00:00Z'),
    end: DateTime.fromISO('2025-07-03T10:00:00Z'),
    resource: 'resource-1',
  },
  {
    id: 'event-2',
    title: 'UX Sync',
    start: DateTime.fromISO('2025-07-03T11:00:00Z'),
    end: DateTime.fromISO('2025-07-06T12:00:00Z'),
    resource: 'resource-2',
  },
  {
    id: 'event-3',
    title: 'Architecture Session',
    start: DateTime.fromISO('2025-07-04T13:00:00Z'),
    end: DateTime.fromISO('2025-08-04T14:30:00Z'),
    resource: 'resource-1',
  },
];

describe('<Timeline />', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date('2025-07-03T00:00:00Z'),
  });

  const visibleDate = DateTime.fromISO('2025-07-03T00:00:00Z');
  function mountTimeline(options?: {
    resources?: any[];
    events?: any[];
    view?: any;
    views?: any[];
  }) {
    return render(
      <Timeline
        resources={options?.resources ?? baseResources}
        events={options?.events ?? baseEvents}
        visibleDate={visibleDate}
        view={options?.view ?? 'days'}
        views={options?.views ?? ['time', 'days', 'weeks', 'months', 'years']}
      />,
    );
  }

  describe('resources', () => {
    it('renders all resource titles', () => {
      mountTimeline();

      baseResources.forEach((resourceItem) => {
        expect(screen.getByText(resourceItem.name)).not.to.equal(null);
      });
      const resourceTitleCells = document.querySelectorAll('.TimelineTitleCell');
      expect(resourceTitleCells.length).to.equal(baseResources.length);
    });

    it('does not render resources with no events', () => {
      const extendedResources: CalendarResource[] = [
        ...baseResources,
        { id: 'resource-3', name: 'QA', eventColor: 'red' },
      ];
      mountTimeline({ resources: extendedResources });

      expect(screen.queryByText('QA')).to.equal(null);
    });
  });

  describe('events', () => {
    it('renders all visible Events events', () => {
      mountTimeline();
      baseEvents.forEach((eventItem) => {
        expect(screen.getByText(eventItem.title)).not.to.equal(null);
      });
    });
    it('does not render events out of range', () => {
      const extendedEvents: CalendarEvent[] = [
        ...baseEvents,
        {
          id: 'event-4',
          title: 'Out of range',
          start: DateTime.fromISO('2050-07-04T13:00:00Z'),
          end: DateTime.fromISO('2050-08-04T14:30:00Z'),
          resource: 'resource-1',
        },
      ];

      mountTimeline({ events: extendedEvents });
      baseEvents.forEach((eventItem) => {
        expect(screen.getByText(eventItem.title)).not.to.equal(null);
      });

      expect(screen.queryByText('Out of range')).to.equal(null);
    });

    it('keeps events visible after rerender', () => {
      const { rerender: localRerender } = mountTimeline();
      localRerender(
        <Timeline
          resources={baseResources}
          events={baseEvents}
          visibleDate={visibleDate}
          view="days"
          views={['days', 'weeks']}
        />,
      );
      baseEvents.forEach((eventItem) => {
        expect(screen.getByText(eventItem.title)).not.to.equal(null);
      });
    });
  });

  describe('views', () => {
    it('renders the correct header and updates CSS variable when switching views', async () => {
      const { container: firstContainer } = mountTimeline({
        view: 'time',
        views: ['days', 'time'],
      });

      const rootElement = firstContainer.querySelector('.TimelineRoot') as HTMLElement;
      expect(firstContainer.querySelector('.TimeHeader')).not.to.equal(null);

      expect(rootElement.style.getPropertyValue('--unit-width')).to.contain('time-cell-width');

      const daysSwitchControl = screen.getByRole('button', { name: /days/i });
      expect(daysSwitchControl).not.to.equal(null);

      const { container: secondContainer } = mountTimeline({
        view: 'days',
        views: ['days', 'time'],
      });

      const updatedRootElement = secondContainer.querySelector('.TimelineRoot') as HTMLElement;
      expect(secondContainer.querySelector('.DaysHeader')).not.to.equal(null);
      expect(updatedRootElement.style.getPropertyValue('--unit-width')).to.contain(
        'days-cell-width',
      );
    });
  });
});
