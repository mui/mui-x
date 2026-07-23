import * as React from 'react';
import type { AnyEventCalendarStore } from 'test/utils/scheduler';
import {
  createSchedulerRenderer,
  EventBuilder,
  ResourceBuilder,
  SchedulerStoreRunner,
} from 'test/utils/scheduler';
import { screen } from '@mui/internal-test-utils';
import type { SchedulerResource } from '@mui/x-scheduler-internals/models';
import { SchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import { EventDialogContent } from './EventDialog';
import { EventCalendarProvider } from '../EventCalendarProvider';
import { eventCalendarClasses } from '../../../event-calendar/eventCalendarClasses';

const personalResource = ResourceBuilder.new().title('Personal').eventColor('teal').build();

const DEFAULT_EVENT: SchedulerEvent = EventBuilder.new()
  .title('Running')
  .description('Morning run')
  .singleDay('2025-05-26T07:30:00Z', 45)
  .resource(personalResource)
  .build();

const resources: SchedulerResource[] = [personalResource];

describe('<EventDialogContent /> — community (no recurring-events plugin)', () => {
  const anchor = document.createElement('button');
  document.body.appendChild(anchor);

  const defaultProps = {
    anchor,
    container: document.body,
    anchorRef: { current: anchor },
    occurrence: EventBuilder.new()
      .id(DEFAULT_EVENT.id)
      .title(DEFAULT_EVENT.title)
      .span(DEFAULT_EVENT.start, DEFAULT_EVENT.end)
      .resource(personalResource)
      .toOccurrence(),
    onClose: () => {},
  };

  const { render } = createSchedulerRenderer();

  it('should render the general tab sections in the default order', () => {
    render(
      <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources}>
        <EventDialogContent open {...defaultProps} />
      </EventCalendarProvider>,
    );

    const legends = Array.from(
      document.body.getElementsByClassName(eventCalendarClasses.eventDialogSectionHeaderTitle),
    );
    expect(legends.map((legend) => legend.textContent)).to.deep.equal([
      'Date & time',
      'Resource & color',
    ]);

    // The description section has no legend, so check it renders after the other sections.
    const description = screen.getByRole('textbox', { name: 'Description' });
    expect(
      legends[1].compareDocumentPosition(description) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).not.to.equal(0);
  });

  it('should not render the recurrence tab when no slot is provided', () => {
    render(
      <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources}>
        <EventDialogContent open {...defaultProps} />
      </EventCalendarProvider>,
    );

    expect(screen.queryByRole('tab', { name: /recurrence/i })).to.equal(null);
    expect(screen.queryByRole('tab', { name: /general/i })).to.equal(null);
  });

  it('should not render the recurrence label on a readonly event with rrule', () => {
    const readonlyRecurringEvent: SchedulerEvent = EventBuilder.new()
      .title('Weekly standup')
      .singleDay('2025-05-26T07:30:00Z', 45)
      .resource(personalResource)
      .recurrent('DAILY')
      .readOnly()
      .build();

    expect(() => {
      render(
        <EventCalendarProvider events={[readonlyRecurringEvent]} resources={resources}>
          <EventDialogContent
            open
            {...defaultProps}
            occurrence={EventBuilder.new()
              .id(readonlyRecurringEvent.id)
              .title(readonlyRecurringEvent.title)
              .span(readonlyRecurringEvent.start, readonlyRecurringEvent.end)
              .resource(personalResource)
              .toOccurrence()}
          />
        </EventCalendarProvider>,
      );
    }).toWarnDev([
      'MUI X Scheduler: Recurring events are a premium feature. The `rrule` property will be ignored.',
    ]);

    expect(screen.queryByText(/repeats/i)).to.equal(null);
  });

  it('should warn and strip the rrule when createEvent is called with one', () => {
    expect(() => {
      render(
        <EventCalendarProvider
          events={[DEFAULT_EVENT]}
          resources={resources}
          onEventsChange={() => {}}
        >
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext}
            onMount={(store) => {
              store.createEvent({
                title: 'New recurring',
                start: '2025-05-26T07:30:00Z',
                end: '2025-05-26T08:30:00Z',
                rrule: 'FREQ=DAILY',
              });
            }}
          />
        </EventCalendarProvider>,
      );
    }).toWarnDev([
      'MUI X Scheduler: Recurring events are a premium feature. The `rrule` property will be ignored.',
    ]);
  });

  it('should warn and strip the rrule when updateEvent is called with one', () => {
    expect(() => {
      render(
        <EventCalendarProvider
          events={[DEFAULT_EVENT]}
          resources={resources}
          onEventsChange={() => {}}
        >
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext}
            onMount={(store) => {
              store.updateEvent({ id: DEFAULT_EVENT.id, rrule: 'FREQ=DAILY' });
            }}
          />
        </EventCalendarProvider>,
      );
    }).toWarnDev([
      'MUI X Scheduler: Recurring events are a premium feature. The `rrule` property will be ignored.',
    ]);
  });

  it('should warn when updateRecurringEvent is called without a plugin', () => {
    expect(() => {
      render(
        <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources}>
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext}
            onMount={(store) => {
              store.updateRecurringEvent({
                occurrenceStart: new Date('2025-05-26T07:30:00Z'),
                changes: { id: DEFAULT_EVENT.id, start: new Date(), end: new Date() },
              });
            }}
          />
        </EventCalendarProvider>,
      );
    }).toWarnDev(['MUI X Scheduler: Recurring event updates are a premium feature.']);
  });
});
