import * as React from 'react';
import type { AnyEventCalendarStore } from 'test/utils/scheduler';
import {
  adapter,
  createSchedulerRenderer,
  EventBuilder,
  ResourceBuilder,
  SchedulerStoreRunner,
} from 'test/utils/scheduler';
import { screen } from '@mui/internal-test-utils';
import { spy } from 'sinon';
import type { SchedulerResource } from '@mui/x-scheduler-internals/models';
import { SchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import { MonthView } from '../../../month-view';
import { EventDialogContent, EventDialogProvider } from './EventDialog';
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

    const tabContent = document.querySelector(`.${eventCalendarClasses.eventDialogTabContent}`)!;
    const legends = Array.from(
      tabContent.getElementsByClassName(eventCalendarClasses.eventDialogSectionHeaderTitle),
    );
    expect(legends.map((legend) => legend.textContent)).to.deep.equal([
      'Date & time',
      'Resource & color',
    ]);

    // The description section has no legend, so check it renders after the other sections.
    const description = screen.getByRole('textbox', { name: 'Description' });
    expect(legends[1].compareDocumentPosition(description)).to.equal(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );

    // Pin the other side of the "hide the resource select when there are no resources"
    // condition: with resources configured, the select must still render.
    expect(screen.getByRole('combobox', { name: 'Resource' })).not.to.equal(null);
  });

  it('should not render the resource select when there are no resources, but should keep the color picker', () => {
    const noResourceEvent: SchedulerEvent = EventBuilder.new()
      .title('Running')
      .description('Morning run')
      .singleDay('2025-05-26T07:30:00Z', 45)
      .build();

    render(
      <EventCalendarProvider events={[noResourceEvent]}>
        <EventDialogContent
          open
          {...defaultProps}
          occurrence={EventBuilder.new()
            .id(noResourceEvent.id)
            .title(noResourceEvent.title)
            .span(noResourceEvent.start, noResourceEvent.end)
            .toOccurrence()}
        />
      </EventCalendarProvider>,
    );

    // The section still renders with a header matching its actual contents, and the color
    // picker is still there...
    expect(screen.queryByText('Resource & color')).to.equal(null);
    expect(screen.getByText('Color')).not.to.equal(null);
    expect(screen.getByRole('group', { name: 'Event color' })).not.to.equal(null);

    // ...but the resource select itself is gone since there are no resources to pick from.
    expect(screen.queryByRole('combobox', { name: 'Resource' })).to.equal(null);
    expect(screen.queryByText('No resource')).to.equal(null);
  });

  it('should allow saving when shouldEventRequireResource is true but no resources are configured', async () => {
    const onClose = spy();
    const onEventsChange = spy();
    const noResourceEvent: SchedulerEvent = EventBuilder.new()
      .title('Running')
      .description('Morning run')
      .singleDay('2025-05-26T07:30:00Z', 45)
      .build();

    // The store itself warns in dev about this contradictory configuration; what this test
    // guards against is that warning turning into a silent, unrecoverable submit failure now
    // that the resource picker (and its error message) no longer renders.
    await expect(async () => {
      const { user } = render(
        <EventCalendarProvider
          events={[noResourceEvent]}
          shouldEventRequireResource
          onEventsChange={onEventsChange}
        >
          <EventDialogContent
            open
            {...defaultProps}
            onClose={onClose}
            occurrence={EventBuilder.new()
              .id(noResourceEvent.id)
              .title(noResourceEvent.title)
              .span(noResourceEvent.start, noResourceEvent.end)
              .toOccurrence()}
          />
        </EventCalendarProvider>,
      );

      await user.click(screen.getByRole('button', { name: 'Save' }));
    }).toWarnDev([
      'MUI X Scheduler: `shouldEventRequireResource` is `true` but no resources are configured.',
    ]);

    expect(onClose.callCount).to.equal(1);
    expect(onEventsChange.callCount).to.equal(1);
    expect(screen.queryByRole('alert')).to.equal(null);
  });

  it('should discard the draft when the dialog is closed and reopened', async () => {
    const { user } = render(
      <EventCalendarProvider
        events={[DEFAULT_EVENT]}
        resources={resources}
        visibleDate={adapter.date('2025-05-26T00:00:00Z', 'default')}
      >
        <EventDialogProvider>
          <MonthView />
        </EventDialogProvider>
      </EventCalendarProvider>,
    );

    await user.click(screen.getByText(DEFAULT_EVENT.title));
    const titleInput = await screen.findByLabelText(/event title/i);
    await user.type(titleInput, ' edited');
    expect(titleInput).to.have.value('Running edited');

    // Closing unmounts the dialog content, which is what discards the draft store.
    await user.keyboard('{Escape}');
    expect(screen.queryByLabelText(/event title/i)).to.equal(null);

    await user.click(screen.getByText(DEFAULT_EVENT.title));
    expect(await screen.findByLabelText(/event title/i)).to.have.value(DEFAULT_EVENT.title);
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

  it('should warn when a custom event property collides with a built-in form key', () => {
    const eventWithCollidingProperty = {
      ...DEFAULT_EVENT,
      startDate: 'project-kickoff',
    } as SchedulerEvent;

    expect(() => {
      render(
        <EventCalendarProvider events={[eventWithCollidingProperty]} resources={resources}>
          <EventDialogContent open {...defaultProps} />
        </EventCalendarProvider>,
      );
    }).toWarnDev([
      'MUI X Scheduler: The event model contains a custom property "startDate" that collides with a built-in form key.',
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
