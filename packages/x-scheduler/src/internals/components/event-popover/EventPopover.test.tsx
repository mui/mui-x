import * as React from 'react';
import { spy } from 'sinon';
import {
  adapter,
  createOccurrenceFromEvent,
  createSchedulerRenderer,
  SchedulerStoreRunner,
  StateWatcher,
  StoreSpy,
} from 'test/utils/scheduler';
import { screen } from '@mui/internal-test-utils';
import {
  CalendarOccurrencePlaceholderCreation,
  CalendarResource,
  SchedulerEvent,
} from '@mui/x-scheduler-headless/models';
import { DEFAULT_EVENT_COLOR } from '@mui/x-scheduler-headless/constants';
import { Popover } from '@base-ui-components/react/popover';
import { EventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';
import { EventPopoverContent } from './EventPopover';
import { getColorClassName } from '../../utils/color-utils';
import { RecurringScopeDialog } from '../scope-dialog/ScopeDialog';

const DEFAULT_EVENT = {
  id: '1',
  start: adapter.date('2025-05-26T07:30:00'),
  end: adapter.date('2025-05-26T08:15:00'),
  title: 'Running',
  description: 'Morning run',
  resource: 'r2',
};

const resources: CalendarResource[] = [
  {
    id: 'r1',
    title: 'Work',
    eventColor: 'blue',
  },
  {
    id: 'r2',
    title: 'Personal',
    eventColor: 'cyan',
  },
];

describe('<EventPopoverContent />', () => {
  const anchor = document.createElement('button');
  document.body.appendChild(anchor);

  const defaultProps = {
    anchor,
    container: document.body,
    occurrence: createOccurrenceFromEvent(DEFAULT_EVENT),
    onClose: () => {},
  };

  const { render } = createSchedulerRenderer();

  it('should render the event data in the form fields', () => {
    render(
      <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources}>
        <Popover.Root open>
          <EventPopoverContent {...defaultProps} />
        </Popover.Root>
      </EventCalendarProvider>,
    );
    expect(screen.getByDisplayValue('Running')).not.to.equal(null);
    expect(screen.getByDisplayValue('Morning run')).not.to.equal(null);
    expect(screen.getByLabelText(/start date/i)).to.have.value('2025-05-26');
    expect(screen.getByLabelText(/end date/i)).to.have.value('2025-05-26');
    expect(screen.getByLabelText(/start time/i)).to.have.value('07:30');
    expect(screen.getByLabelText(/end time/i)).to.have.value('08:15');
    expect(screen.getByRole('checkbox', { name: /all day/i })).to.have.attribute(
      'aria-checked',
      'false',
    );
    expect(screen.getByRole('combobox', { name: /resource/i }).textContent).to.match(/personal/i);
    expect(screen.getByRole('combobox', { name: /recurrence/i }).textContent).to.match(
      /don't repeat/i,
    );
  });

  it('should call "onEventsChange" with updated values on submit', async () => {
    const onEventsChange = spy();
    const { user } = render(
      <EventCalendarProvider
        events={[DEFAULT_EVENT]}
        onEventsChange={onEventsChange}
        resources={resources}
      >
        <Popover.Root open>
          <EventPopoverContent {...defaultProps} />
        </Popover.Root>
      </EventCalendarProvider>,
    );
    await user.type(screen.getByLabelText(/event title/i), ' test');
    await user.click(screen.getByRole('checkbox', { name: /all day/i }));
    await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
    await user.click(await screen.findByRole('option', { name: /repeats daily/i }));
    await user.click(screen.getByRole('combobox', { name: /resource/i }));
    await user.click(await screen.findByRole('option', { name: /work/i }));
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(onEventsChange.calledOnce).to.equal(true);
    const updated = onEventsChange.firstCall.firstArg[0];

    const expectedUpdatedEvent: SchedulerEvent = {
      id: '1',
      title: 'Running test',
      description: 'Morning run',
      start: adapter.startOfDay(DEFAULT_EVENT.start),
      end: adapter.endOfDay(DEFAULT_EVENT.end),
      allDay: true,
      rrule: { freq: 'DAILY', interval: 1 },
      resource: 'r1',
    };

    expect(updated).to.deep.equal(expectedUpdatedEvent);
  });

  it('should show error if start date is after end date', async () => {
    const { user } = render(
      <EventCalendarProvider events={[DEFAULT_EVENT]}>
        <Popover.Root open>
          <EventPopoverContent {...defaultProps} />
        </Popover.Root>
      </EventCalendarProvider>,
    );
    await user.clear(screen.getByLabelText(/start date/i));
    await user.type(screen.getByLabelText(/start date/i), '2025-05-27');
    await user.clear(screen.getByLabelText(/end date/i));
    await user.type(screen.getByLabelText(/end date/i), '2025-05-26');
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(screen.getDescriptionOf(screen.getByLabelText(/start date/i)).textContent).to.match(
      /start.*before.*end/i,
    );
  });

  it('should call "onEventsChange" with the updated values when delete button is clicked', async () => {
    const onEventsChange = spy();
    const { user } = render(
      <EventCalendarProvider events={[DEFAULT_EVENT]} onEventsChange={onEventsChange}>
        <Popover.Root open>
          <EventPopoverContent {...defaultProps} />
        </Popover.Root>
      </EventCalendarProvider>,
    );
    await user.click(screen.getByRole('button', { name: /delete event/i }));
    expect(onEventsChange.calledOnce).to.equal(true);
    expect(onEventsChange.firstCall.firstArg).to.deep.equal([]);
  });

  it('should handle read-only events and render ReadonlyContent', () => {
    const readOnlyEvent = { ...DEFAULT_EVENT, readOnly: true };
    render(
      <EventCalendarProvider events={[readOnlyEvent]} resources={resources}>
        <Popover.Root open>
          <EventPopoverContent
            {...defaultProps}
            occurrence={createOccurrenceFromEvent(readOnlyEvent)}
          />
        </Popover.Root>
      </EventCalendarProvider>,
    );
    // Should display title as text, not in an input
    expect(screen.getByText('Running')).not.to.equal(null);
    expect(screen.queryByLabelText(/event title/i)).to.equal(null);

    // Should display description as text, not in an input
    expect(screen.getByText('Morning run')).not.to.equal(null);
    expect(screen.queryByLabelText(/description/i)).to.equal(null);

    // Should not have date/time inputs
    expect(screen.queryByLabelText(/start date/i)).to.equal(null);
    expect(screen.queryByLabelText(/end date/i)).to.equal(null);
    expect(screen.queryByLabelText(/start time/i)).to.equal(null);
    expect(screen.queryByLabelText(/end time/i)).to.equal(null);

    // Should not have all-day checkbox
    expect(screen.queryByRole('checkbox', { name: /all day/i })).to.equal(null);

    // Should not have resource/recurrence comboboxes
    expect(screen.queryByRole('combobox', { name: /resource/i })).to.equal(null);
    expect(screen.queryByRole('combobox', { name: /recurrence/i })).to.equal(null);
  });

  it('should handle read-only events if EventCalendar is read-only', () => {
    render(
      <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources} readOnly>
        <Popover.Root open>
          <EventPopoverContent
            {...defaultProps}
            occurrence={createOccurrenceFromEvent(DEFAULT_EVENT)}
          />
        </Popover.Root>
      </EventCalendarProvider>,
    );
    // Should display title as text, not in an input
    expect(screen.getByText('Running')).not.to.equal(null);
    expect(screen.queryByLabelText(/event title/i)).to.equal(null);

    // Should display description as text, not in an input
    expect(screen.getByText('Morning run')).not.to.equal(null);
    expect(screen.queryByLabelText(/description/i)).to.equal(null);

    // Should not have date/time inputs
    expect(screen.queryByLabelText(/start date/i)).to.equal(null);
    expect(screen.queryByLabelText(/end date/i)).to.equal(null);
    expect(screen.queryByLabelText(/start time/i)).to.equal(null);
    expect(screen.queryByLabelText(/end time/i)).to.equal(null);

    // Should not have all-day checkbox
    expect(screen.queryByRole('checkbox', { name: /all day/i })).to.equal(null);

    // Should not have resource/recurrence comboboxes
    expect(screen.queryByRole('combobox', { name: /resource/i })).to.equal(null);
    expect(screen.queryByRole('combobox', { name: /recurrence/i })).to.equal(null);
  });

  it('should handle a resource without an eventColor (fallback to default)', async () => {
    const onEventsChange = spy();

    const resourcesNoColor: CalendarResource[] = [
      { id: 'r1', title: 'Work', eventColor: 'blue' },
      { id: 'r2', title: 'Personal', eventColor: 'cyan' },
      { id: 'r3', title: 'NoColor' },
    ];

    const eventWithNoResourceColor: SchedulerEvent = {
      ...DEFAULT_EVENT,
      resource: 'r3',
    };

    render(
      <EventCalendarProvider
        events={[eventWithNoResourceColor]}
        onEventsChange={onEventsChange}
        resources={resourcesNoColor}
      >
        <Popover.Root open>
          <EventPopoverContent
            {...defaultProps}
            occurrence={createOccurrenceFromEvent(eventWithNoResourceColor)}
          />
        </Popover.Root>
      </EventCalendarProvider>,
    );

    expect(screen.getByRole('combobox', { name: /resource/i }).textContent).to.match(/NoColor/i);
    expect(document.querySelector('.ResourceLegendColor')).to.have.class(
      getColorClassName(DEFAULT_EVENT_COLOR),
    );
  });

  it('should fallback to "No resource" with default color when the event has no resource', async () => {
    const onEventsChange = spy();

    const eventWithoutResource: SchedulerEvent = {
      ...DEFAULT_EVENT,
      resource: undefined,
    };

    const { user } = render(
      <EventCalendarProvider
        events={[eventWithoutResource]}
        onEventsChange={onEventsChange}
        resources={resources}
      >
        <Popover.Root open>
          <EventPopoverContent
            {...defaultProps}
            occurrence={createOccurrenceFromEvent(eventWithoutResource)}
          />
        </Popover.Root>
      </EventCalendarProvider>,
    );

    expect(screen.getByRole('combobox', { name: /resource/i }).textContent).to.match(
      /no resource/i,
    );

    expect(document.querySelector('.ResourceLegendColor')).to.have.class(
      getColorClassName(DEFAULT_EVENT_COLOR),
    );

    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(onEventsChange.calledOnce).to.equal(true);
    const updated = onEventsChange.firstCall.firstArg[0];
    expect(updated.resource).to.equal(undefined);
  });

  describe('Event creation', () => {
    it('should change surface of the placeholder to day-grid when all-day is changed to true', async () => {
      const start = adapter.date('2025-05-26T07:30:00');
      const end = adapter.date('2025-05-26T08:30:00');
      const handleSurfaceChange = spy();

      const creationOccurrence = createOccurrenceFromEvent({
        id: 'tmp',
        start,
        end,
        title: '',
        description: '',
        allDay: false,
      });

      const { user } = render(
        <EventCalendarProvider events={[]} resources={resources}>
          <SchedulerStoreRunner
            context={EventCalendarStoreContext}
            onMount={(store) =>
              store.setOccurrencePlaceholder({
                type: 'creation',
                surfaceType: 'time-grid',
                start,
                end,
                lockSurfaceType: false,
              })
            }
          />
          <Popover.Root open>
            <EventPopoverContent {...defaultProps} occurrence={creationOccurrence} />
          </Popover.Root>
          <StateWatcher
            Context={EventCalendarStoreContext}
            selector={(s) => s.occurrencePlaceholder?.surfaceType}
            onValueChange={handleSurfaceChange}
          />
        </EventCalendarProvider>,
      );

      expect(handleSurfaceChange.lastCall?.firstArg).to.equal('time-grid');

      await user.click(screen.getByRole('checkbox', { name: /all day/i }));

      expect(handleSurfaceChange.lastCall?.firstArg).to.equal('day-grid');
    });

    it('should change surface of the placeholder to time-grid when all-day is changed to false', async () => {
      const start = adapter.date('2025-05-26T07:30:00');
      const end = adapter.date('2025-05-26T08:30:00');
      const handleSurfaceChange = spy();

      const creationOccurrence = createOccurrenceFromEvent({
        id: 'tmp',
        start,
        end,
        title: '',
        description: '',
        allDay: true,
      });

      const { user } = render(
        <EventCalendarProvider events={[]} resources={resources}>
          <SchedulerStoreRunner
            context={EventCalendarStoreContext}
            onMount={(store) =>
              store.setOccurrencePlaceholder({
                type: 'creation',
                surfaceType: 'day-grid',
                start,
                end,
                lockSurfaceType: false,
              })
            }
          />
          <Popover.Root open>
            <EventPopoverContent {...defaultProps} occurrence={creationOccurrence} />
          </Popover.Root>
          <StateWatcher
            Context={EventCalendarStoreContext}
            selector={(s) => s.occurrencePlaceholder?.surfaceType}
            onValueChange={handleSurfaceChange}
          />
        </EventCalendarProvider>,
      );

      expect(handleSurfaceChange.lastCall?.firstArg).to.equal('day-grid');

      await user.click(screen.getByRole('checkbox', { name: /all day/i }));

      expect(handleSurfaceChange.lastCall?.firstArg).to.equal('time-grid');
    });

    it('should not change surfaceType when all day changed to true and lockSurfaceType=true', async () => {
      const start = adapter.date('2025-05-26T07:30:00');
      const end = adapter.date('2025-05-26T08:30:00');
      const handleSurfaceChange = spy();

      const creationOccurrence = createOccurrenceFromEvent({
        id: 'tmp',
        start,
        end,
        title: '',
        description: '',
        allDay: false,
      });

      const { user } = render(
        <EventCalendarProvider events={[]} resources={resources}>
          <SchedulerStoreRunner
            context={EventCalendarStoreContext}
            onMount={(store) =>
              store.setOccurrencePlaceholder({
                type: 'creation',
                surfaceType: 'time-grid',
                start,
                end,
                lockSurfaceType: true,
              })
            }
          />
          <Popover.Root open>
            <EventPopoverContent {...defaultProps} occurrence={creationOccurrence as any} />
          </Popover.Root>
          <StateWatcher
            Context={EventCalendarStoreContext}
            selector={(s) => s.occurrencePlaceholder?.surfaceType}
            onValueChange={handleSurfaceChange}
          />
        </EventCalendarProvider>,
      );
      expect(handleSurfaceChange.lastCall?.firstArg).to.equal('time-grid');

      await user.click(screen.getByRole('checkbox', { name: /all day/i }));

      expect(handleSurfaceChange.lastCall?.firstArg).to.equal('time-grid');
    });

    it('should call createEvent with metaChanges + computed start/end on Submit', async () => {
      const start = adapter.date('2025-06-10T09:00:00');
      const end = adapter.date('2025-06-10T09:30:00');
      const placeholder: CalendarOccurrencePlaceholderCreation = {
        type: 'creation',
        surfaceType: 'time-grid' as const,
        start,
        end,
        lockSurfaceType: false,
      };

      const creationOccurrence = createOccurrenceFromEvent({
        id: 'placeholder-id',
        start,
        end,
        title: '',
        description: '',
        allDay: false,
      });

      const onEventsChange = spy();
      let createEventSpy;

      const { user } = render(
        <EventCalendarProvider events={[]} resources={resources} onEventsChange={onEventsChange}>
          <SchedulerStoreRunner
            context={EventCalendarStoreContext}
            onMount={(store) => store.setOccurrencePlaceholder(placeholder)}
          />
          <StoreSpy
            Context={EventCalendarStoreContext}
            method="createEvent"
            onSpyReady={(sp) => {
              createEventSpy = sp;
            }}
          />

          <Popover.Root open>
            <EventPopoverContent {...defaultProps} occurrence={creationOccurrence} />
          </Popover.Root>
        </EventCalendarProvider>,
      );

      await user.type(screen.getByLabelText(/event title/i), ' New title ');
      await user.type(screen.getByLabelText(/description/i), ' Some details ');
      await user.click(screen.getByRole('combobox', { name: /resource/i }));
      await user.click(await screen.findByRole('option', { name: /work/i }));
      await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
      await user.click(await screen.findByRole('option', { name: /daily/i }));
      await user.click(screen.getByRole('button', { name: /save changes/i }));

      expect(createEventSpy?.calledOnce).to.equal(true);
      const payload = createEventSpy.lastCall.firstArg;

      expect(payload.id).to.be.a('string');
      expect(payload.title).to.equal('New title');
      expect(payload.description).to.equal('Some details');
      expect(payload.allDay).to.equal(false);
      expect(payload.resource).to.equal('r1');
      expect(payload.start).toEqualDateTime(start);
      expect(payload.end).toEqualDateTime(end);
      expect(payload.rrule).to.deep.equal({ freq: 'DAILY', interval: 1 });
    });
  });
  describe('Event editing', () => {
    describe('Recurring events', () => {
      it('should not call updateRecurringEvent if the user cancels the scope dialog', async () => {
        const originalRecurringEvent = {
          id: 'recurring-1',
          title: 'Daily standup',
          description: 'sync',
          start: adapter.date('2025-06-11T10:00:00'),
          end: adapter.date('2025-06-11T10:30:00'),
          allDay: false,
          rrule: { freq: 'DAILY' as const, interval: 1 },
        };

        let updateRecurringEventSpy, selectRecurringEventUpdateScopeSpy;
        const containerRef = React.createRef<HTMLDivElement>();

        const { user } = render(
          <React.Fragment>
            <div ref={containerRef} />
            <EventCalendarProvider events={[originalRecurringEvent]} resources={resources}>
              <StoreSpy
                Context={EventCalendarStoreContext}
                method="updateRecurringEvent"
                onSpyReady={(sp) => {
                  updateRecurringEventSpy = sp;
                }}
              />
              <StoreSpy
                Context={EventCalendarStoreContext}
                method="selectRecurringEventUpdateScope"
                onSpyReady={(sp) => {
                  selectRecurringEventUpdateScopeSpy = sp;
                }}
              />
              <Popover.Root open>
                <EventPopoverContent
                  {...defaultProps}
                  occurrence={createOccurrenceFromEvent(originalRecurringEvent)}
                />
              </Popover.Root>
              <RecurringScopeDialog containerRef={containerRef} />
            </EventCalendarProvider>
          </React.Fragment>,
        );

        await user.clear(screen.getByLabelText(/start time/i));
        await user.type(screen.getByLabelText(/start time/i), '10:05');
        await user.clear(screen.getByLabelText(/end time/i));
        await user.type(screen.getByLabelText(/end time/i), '10:35');
        await user.click(screen.getByRole('button', { name: /save changes/i }));

        await screen.findByText(/Apply this change to:/i);
        await user.click(screen.getByLabelText(/All events in the series/i));
        await user.click(screen.getByRole('button', { name: /Cancel/i }));

        expect(updateRecurringEventSpy?.calledOnce).to.equal(true);
        expect(selectRecurringEventUpdateScopeSpy?.called).to.equal(true);
        expect(selectRecurringEventUpdateScopeSpy?.lastCall.firstArg).to.equal(null);
        expect(updateRecurringEventSpy?.callCount).to.equal(1);
      });

      it("should call updateRecurringEvent with scope 'all' and not include rrule if not modified on Submit", async () => {
        const originalRecurringEvent = {
          id: 'recurring-1',
          title: 'Daily standup',
          description: 'sync',
          start: adapter.date('2025-06-11T10:00:00'),
          end: adapter.date('2025-06-11T10:30:00'),
          allDay: false,
          rrule: { freq: 'DAILY' as const, interval: 1 },
        };

        let updateRecurringEventSpy, selectRecurringEventUpdateScopeSpy;
        const containerRef = React.createRef<HTMLDivElement>();

        const { user } = render(
          <React.Fragment>
            <div ref={containerRef} />
            <EventCalendarProvider events={[originalRecurringEvent]} resources={resources}>
              <StoreSpy
                Context={EventCalendarStoreContext}
                method="updateRecurringEvent"
                onSpyReady={(sp) => {
                  updateRecurringEventSpy = sp;
                }}
              />
              <StoreSpy
                Context={EventCalendarStoreContext}
                method="selectRecurringEventUpdateScope"
                onSpyReady={(sp) => {
                  selectRecurringEventUpdateScopeSpy = sp;
                }}
              />
              <Popover.Root open>
                <EventPopoverContent
                  {...defaultProps}
                  occurrence={createOccurrenceFromEvent(originalRecurringEvent)}
                />
              </Popover.Root>
              <RecurringScopeDialog containerRef={containerRef} />
            </EventCalendarProvider>
          </React.Fragment>,
        );

        await user.clear(screen.getByLabelText(/start time/i));
        await user.type(screen.getByLabelText(/start time/i), '10:05');
        await user.clear(screen.getByLabelText(/end time/i));
        await user.type(screen.getByLabelText(/end time/i), '10:35');
        await user.click(screen.getByRole('button', { name: /save changes/i }));

        await screen.findByText(/Apply this change to:/i);
        await user.click(screen.getByLabelText(/All events in the series/i));
        await user.click(screen.getByRole('button', { name: /Confirm/i }));

        expect(updateRecurringEventSpy?.calledOnce).to.equal(true);
        const openPayload = updateRecurringEventSpy.lastCall.firstArg;

        expect(openPayload.changes.id).to.equal('recurring-1');
        expect(openPayload.changes.title).to.equal('Daily standup');
        expect(openPayload.changes.description).to.equal('sync');
        expect(openPayload.changes.allDay).to.equal(false);
        expect(openPayload.changes.start).to.toEqualDateTime(adapter.date('2025-06-11T10:05:00'));
        expect(openPayload.changes.end).to.toEqualDateTime(adapter.date('2025-06-11T10:35:00'));
        expect(openPayload.changes).to.not.have.property('rrule');

        expect(selectRecurringEventUpdateScopeSpy?.calledOnce).to.equal(true);
        expect(selectRecurringEventUpdateScopeSpy?.lastCall.firstArg).to.equal('all');
      });

      it("should call updateRecurringEvent with scope 'only-this' and include rrule if modified on Submit", async () => {
        const originalRecurringEvent: SchedulerEvent = {
          id: 'recurring-2',
          title: 'Daily standup',
          description: 'sync',
          start: adapter.date('2025-06-11T10:00:00'),
          end: adapter.date('2025-06-11T10:30:00'),
          allDay: false,
          rrule: { freq: 'DAILY' as const, interval: 1 },
        };

        let updateRecurringEventSpy, selectRecurringEventUpdateScopeSpy;
        const containerRef = React.createRef<HTMLDivElement>();

        const { user } = render(
          <React.Fragment>
            <div ref={containerRef} />
            <EventCalendarProvider events={[originalRecurringEvent]} resources={resources}>
              <StoreSpy
                Context={EventCalendarStoreContext}
                method="updateRecurringEvent"
                onSpyReady={(sp) => {
                  updateRecurringEventSpy = sp;
                }}
              />
              <StoreSpy
                Context={EventCalendarStoreContext}
                method="selectRecurringEventUpdateScope"
                onSpyReady={(sp) => {
                  selectRecurringEventUpdateScopeSpy = sp;
                }}
              />
              <Popover.Root open>
                <EventPopoverContent
                  {...defaultProps}
                  occurrence={createOccurrenceFromEvent(originalRecurringEvent)}
                />
              </Popover.Root>
              <RecurringScopeDialog containerRef={containerRef} />
            </EventCalendarProvider>
          </React.Fragment>,
        );
        // We update the recurrence from daily to weekly
        await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
        await user.click(await screen.findByRole('option', { name: /repeats weekly/i }));
        await user.click(screen.getByRole('button', { name: /save changes/i }));

        await screen.findByText(/Apply this change to:/i);
        await user.click(screen.getByLabelText(/Only this event/i));
        await user.click(screen.getByRole('button', { name: /Confirm/i }));

        expect(updateRecurringEventSpy?.calledOnce).to.equal(true);
        const openPayload = updateRecurringEventSpy.lastCall.firstArg;

        expect(openPayload.changes.id).to.equal('recurring-2');
        expect(openPayload.changes.title).to.equal('Daily standup');
        expect(openPayload.changes.description).to.equal('sync');
        expect(openPayload.changes.allDay).to.equal(false);
        expect(openPayload.changes.rrule).to.deep.equal({
          freq: 'WEEKLY',
          interval: 1,
          byDay: ['WE'],
        });
        expect(selectRecurringEventUpdateScopeSpy?.calledOnce).to.equal(true);
        expect(selectRecurringEventUpdateScopeSpy?.lastCall.firstArg).to.equal('only-this');
      });

      it('should call updateRecurringEvent with scope "this-and-following" and send rrule as undefined when "no repeat" is selected on Submit', async () => {
        const originalRecurringEvent = {
          id: 'recurring-3',
          title: 'Daily standup',
          description: 'sync',
          start: adapter.date('2025-06-11T10:00:00'),
          end: adapter.date('2025-06-11T10:30:00'),
          allDay: false,
          rrule: { freq: 'DAILY' as const, interval: 1 },
        };

        let updateRecurringEventSpy, selectRecurringEventUpdateScopeSpy;
        const containerRef = React.createRef<HTMLDivElement>();

        const { user } = render(
          <React.Fragment>
            <div ref={containerRef} />
            <EventCalendarProvider events={[originalRecurringEvent]} resources={resources}>
              <StoreSpy
                Context={EventCalendarStoreContext}
                method="updateRecurringEvent"
                onSpyReady={(sp) => {
                  updateRecurringEventSpy = sp;
                }}
              />
              <StoreSpy
                Context={EventCalendarStoreContext}
                method="selectRecurringEventUpdateScope"
                onSpyReady={(sp) => {
                  selectRecurringEventUpdateScopeSpy = sp;
                }}
              />
              <Popover.Root open>
                <EventPopoverContent
                  {...defaultProps}
                  occurrence={createOccurrenceFromEvent(originalRecurringEvent)}
                />
              </Popover.Root>
              <RecurringScopeDialog containerRef={containerRef} />
            </EventCalendarProvider>
          </React.Fragment>,
        );

        await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
        await user.click(await screen.findByRole('option', { name: /don.?t repeat/i }));
        await user.click(screen.getByRole('button', { name: /save changes/i }));

        await screen.findByText(/Apply this change to:/i);
        await user.click(screen.getByLabelText(/This and following events/i));
        await user.click(screen.getByRole('button', { name: /Confirm/i }));

        expect(updateRecurringEventSpy?.calledOnce).to.equal(true);
        const openPayload = updateRecurringEventSpy.lastCall.firstArg;

        expect(openPayload.changes.id).to.equal('recurring-3');
        expect(openPayload.changes.rrule).to.equal(undefined);

        expect(selectRecurringEventUpdateScopeSpy?.calledOnce).to.equal(true);
        expect(selectRecurringEventUpdateScopeSpy?.lastCall.firstArg).to.equal(
          'this-and-following',
        );
      });
    });

    describe('Non-recurring events', () => {
      it('should call updateEvent with updated values on Submit', async () => {
        const nonRecurringEvent: SchedulerEvent = {
          id: 'non-recurring-1',
          title: 'Task',
          description: 'description',
          start: adapter.date('2025-06-12T14:00:00'),
          end: adapter.date('2025-06-12T15:00:00'),
          allDay: false,
        };

        let updateEventSpy;

        const { user } = render(
          <EventCalendarProvider events={[nonRecurringEvent]} resources={resources}>
            <StoreSpy
              Context={EventCalendarStoreContext}
              method="updateEvent"
              onSpyReady={(sp) => {
                updateEventSpy = sp;
              }}
            />
            <Popover.Root open>
              <EventPopoverContent
                {...defaultProps}
                occurrence={createOccurrenceFromEvent(nonRecurringEvent)}
              />
            </Popover.Root>
          </EventCalendarProvider>,
        );
        await user.type(screen.getByLabelText(/event title/i), ' updated ');
        await user.clear(screen.getByLabelText(/description/i));
        await user.type(screen.getByLabelText(/description/i), '  new description  ');
        await user.click(screen.getByRole('combobox', { name: /resource/i }));
        await user.click(await screen.findByRole('option', { name: /work/i }));
        await user.click(screen.getByRole('button', { name: /save changes/i }));

        expect(updateEventSpy?.calledOnce).to.equal(true);
        const payload = updateEventSpy.lastCall.firstArg;

        expect(payload.id).to.equal('non-recurring-1');
        expect(payload.title).to.equal('Task updated');
        expect(payload.description).to.equal('new description');
        expect(payload.resource).to.equal('r1');
        expect(payload.allDay).to.equal(false);
        expect(payload.start).toEqualDateTime(adapter.date('2025-06-12T14:00:00'));
        expect(payload.end).toEqualDateTime(adapter.date('2025-06-12T15:00:00'));
        expect(payload.rrule).to.equal(undefined);
      });

      it('should call updateEvent with updated values and send rrule if recurrence was selected on Submit', async () => {
        const nonRecurringEvent: SchedulerEvent = {
          id: 'non-recurring-1',
          title: 'Task',
          description: 'description',
          start: adapter.date('2025-06-12T14:00:00'),
          end: adapter.date('2025-06-12T15:00:00'),
        };

        let updateEventSpy;

        const { user } = render(
          <EventCalendarProvider events={[nonRecurringEvent]} resources={resources}>
            <StoreSpy
              Context={EventCalendarStoreContext}
              method="updateEvent"
              onSpyReady={(sp) => {
                updateEventSpy = sp;
              }}
            />
            <Popover.Root open>
              <EventPopoverContent
                {...defaultProps}
                occurrence={createOccurrenceFromEvent(nonRecurringEvent)}
              />
            </Popover.Root>
          </EventCalendarProvider>,
        );
        await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
        await user.click(await screen.findByRole('option', { name: /repeats daily/i }));
        await user.click(screen.getByRole('button', { name: /save changes/i }));

        expect(updateEventSpy?.calledOnce).to.equal(true);
        const payload = updateEventSpy.lastCall.firstArg;

        expect(payload.id).to.equal('non-recurring-1');
        expect(payload.rrule).to.deep.equal({
          freq: 'DAILY',
          interval: 1,
        });
      });
    });
  });
});
