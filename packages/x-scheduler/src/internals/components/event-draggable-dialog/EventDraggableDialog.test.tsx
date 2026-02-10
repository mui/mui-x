import * as React from 'react';
import { spy } from 'sinon';
import {
  adapter,
  createSchedulerRenderer,
  EventBuilder,
  SchedulerStoreRunner,
  StateWatcher,
  StoreSpy,
  AnyEventCalendarStore,
} from 'test/utils/scheduler';
import { screen, within } from '@mui/internal-test-utils';
import {
  SchedulerResource,
  SchedulerResourceId,
  SchedulerOccurrencePlaceholderCreation,
  TemporalSupportedObject,
} from '@mui/x-scheduler-headless/models';
import { SchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import { EventDraggableDialogContent } from './EventDraggableDialog';
import { EventCalendarProvider } from '../EventCalendarProvider';
import { RecurringScopeDialog } from '../scope-dialog/ScopeDialog';

const DEFAULT_EVENT: SchedulerEvent = EventBuilder.new()
  .title('Running')
  .description('Morning run')
  .singleDay('2025-05-26T07:30:00Z', 45)
  .resource('r2')
  .build();

const resources: SchedulerResource[] = [
  {
    id: 'r1',
    title: 'Work',
    eventColor: 'blue',
  },
  {
    id: 'r2',
    title: 'Personal',
    eventColor: 'teal',
  },
];

describe('<EventDraggableDialogContent open />', () => {
  const anchor = document.createElement('button');
  document.body.appendChild(anchor);

  const defaultProps = {
    anchor,
    container: document.body,
    anchorRef: { current: anchor },
    occurrence: EventBuilder.new()
      .id(DEFAULT_EVENT.id)
      .title(DEFAULT_EVENT.title)
      .description(DEFAULT_EVENT.description)
      .span(DEFAULT_EVENT.start, DEFAULT_EVENT.end)
      .resource(DEFAULT_EVENT.resource as SchedulerResourceId)
      .toOccurrence(),
    onClose: () => {},
  };

  const { render } = createSchedulerRenderer();

  it('should render the event data in the form fields', async () => {
    const { user } = render(
      <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources}>
        <EventDraggableDialogContent open {...defaultProps} />
      </EventCalendarProvider>,
    );
    expect(screen.getByDisplayValue(DEFAULT_EVENT.title)).not.to.equal(null);
    expect(screen.getByDisplayValue(DEFAULT_EVENT.description ?? '')).not.to.equal(null);
    expect(screen.getByLabelText(/start date/i)).to.have.value('2025-05-26');
    expect(screen.getByLabelText(/end date/i)).to.have.value('2025-05-26');
    expect(screen.getByLabelText(/start time/i)).to.have.value('07:30');
    expect(screen.getByLabelText(/end time/i)).to.have.value('08:15');
    expect(
      (screen.getByRole('checkbox', { name: /all day/i }) as HTMLInputElement).checked,
    ).to.equal(false);
    expect(screen.getByRole('button', { name: /resource/i }).textContent).to.match(/personal/i);
    // Verify recurrence tab is clickable (recurrence value tested in other tests)
    await user.click(screen.getByRole('tab', { name: /recurrence/i }));
    expect(screen.getByRole('combobox', { name: /recurrence/i })).to.not.equal(null);
  });

  it('should call "onEventsChange" with updated values on submit', async () => {
    const onEventsChange = spy();
    const { user } = render(
      <EventCalendarProvider
        events={[DEFAULT_EVENT]}
        onEventsChange={onEventsChange}
        resources={resources}
      >
        <EventDraggableDialogContent open {...defaultProps} />
      </EventCalendarProvider>,
    );
    await user.type(screen.getByLabelText(/event title/i), ' test');
    await user.click(screen.getByRole('checkbox', { name: /all day/i }));
    await user.click(screen.getByRole('tab', { name: /recurrence/i }));
    await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
    await user.click(await screen.findByRole('option', { name: /repeats daily/i }));
    await user.click(screen.getByRole('button', { name: /resource/i }));
    await user.click(await screen.findByRole('menuitem', { name: /work/i }));
    // Menu closes after resource selection, re-open for color
    await user.click(screen.getByRole('button', { name: /resource/i }));
    await user.click(await screen.findByRole('button', { name: /pink/i }));
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(onEventsChange.calledOnce).to.equal(true);
    const updated = onEventsChange.firstCall.firstArg[0];

    const expectedUpdatedEvent = {
      id: DEFAULT_EVENT.id,
      title: 'Running test',
      description: DEFAULT_EVENT.description,
      start: adapter.startOfDay(DEFAULT_EVENT.start as TemporalSupportedObject),
      end: adapter.endOfDay(DEFAULT_EVENT.end as TemporalSupportedObject),
      allDay: true,
      rrule: { freq: 'DAILY', interval: 1 },
      resource: 'r1',
      color: 'pink',
    };

    expect(updated).to.deep.equal(expectedUpdatedEvent);
  }, 10_000);

  it('should show error if start date is after end date', async () => {
    const { user } = render(
      <EventCalendarProvider events={[DEFAULT_EVENT]}>
        <EventDraggableDialogContent open {...defaultProps} />
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
        <EventDraggableDialogContent open {...defaultProps} />
      </EventCalendarProvider>,
    );
    await user.click(screen.getByRole('button', { name: /delete event/i }));
    expect(onEventsChange.calledOnce).to.equal(true);
    expect(onEventsChange.firstCall.firstArg).to.deep.equal([]);
  });

  it('should handle read-only events and render ReadonlyContent', () => {
    const readOnlyEvent = { ...DEFAULT_EVENT, readOnly: true };

    const readOnlyOccurrence = EventBuilder.new(adapter)
      .id(readOnlyEvent.id)
      .title(readOnlyEvent.title)
      .description(readOnlyEvent.description)
      .span(readOnlyEvent.start, readOnlyEvent.end)
      .readOnly(true)
      .toOccurrence();

    render(
      <EventCalendarProvider events={[readOnlyEvent]} resources={resources}>
        <EventDraggableDialogContent open {...defaultProps} occurrence={readOnlyOccurrence} />
      </EventCalendarProvider>,
    );
    // Should display title as text, not in an input
    expect(screen.getByText(DEFAULT_EVENT.title)).not.to.equal(null);
    expect(screen.queryByLabelText(/event title/i)).to.equal(null);

    // Should display description as text, not in an input
    expect(screen.getByText(DEFAULT_EVENT.description ?? '')).not.to.equal(null);
    expect(screen.queryByLabelText(/description/i)).to.equal(null);

    // Should not have date/time inputs
    expect(screen.queryByLabelText(/start date/i)).to.equal(null);
    expect(screen.queryByLabelText(/end date/i)).to.equal(null);
    expect(screen.queryByLabelText(/start time/i)).to.equal(null);
    expect(screen.queryByLabelText(/end time/i)).to.equal(null);

    // Should not have all-day checkbox
    expect(screen.queryByRole('checkbox', { name: /all day/i })).to.equal(null);

    // Should not have resource/recurrence comboboxes
    expect(screen.queryByRole('button', { name: /resource/i })).to.equal(null);
    expect(screen.queryByRole('combobox', { name: /recurrence/i })).to.equal(null);
  });

  it('should handle read-only events if EventCalendar is read-only', () => {
    const readOnlyOccurrence = EventBuilder.new(adapter)
      .id(DEFAULT_EVENT.id)
      .title(DEFAULT_EVENT.title)
      .description(DEFAULT_EVENT.description)
      .span(DEFAULT_EVENT.start, DEFAULT_EVENT.end)
      .readOnly(true)
      .toOccurrence();

    render(
      <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources} readOnly>
        <EventDraggableDialogContent open {...defaultProps} occurrence={readOnlyOccurrence} />
      </EventCalendarProvider>,
    );
    // Should display title as text, not in an input
    expect(screen.getByText(DEFAULT_EVENT.title)).not.to.equal(null);
    expect(screen.queryByLabelText(/event title/i)).to.equal(null);

    // Should display description as text, not in an input
    expect(screen.getByText(DEFAULT_EVENT.description ?? '')).not.to.equal(null);
    expect(screen.queryByLabelText(/description/i)).to.equal(null);

    // Should not have date/time inputs
    expect(screen.queryByLabelText(/start date/i)).to.equal(null);
    expect(screen.queryByLabelText(/end date/i)).to.equal(null);
    expect(screen.queryByLabelText(/start time/i)).to.equal(null);
    expect(screen.queryByLabelText(/end time/i)).to.equal(null);

    // Should not have all-day checkbox
    expect(screen.queryByRole('checkbox', { name: /all day/i })).to.equal(null);

    // Should not have resource/recurrence comboboxes
    expect(screen.queryByRole('button', { name: /resource/i })).to.equal(null);
    expect(screen.queryByRole('combobox', { name: /recurrence/i })).to.equal(null);
  });

  it('should handle a resource without an eventColor (fallback to default)', async () => {
    const onEventsChange = spy();

    const resourcesNoColor: SchedulerResource[] = [
      { id: 'r1', title: 'Work', eventColor: 'blue' },
      { id: 'r2', title: 'Personal', eventColor: 'teal' },
      { id: 'r3', title: 'NoColor' },
    ];

    const eventWithNoResourceColor: SchedulerEvent = {
      ...DEFAULT_EVENT,
      resource: 'r3',
    };

    const eventWithNoResourceColorOccurrence = EventBuilder.new(adapter)
      .id(eventWithNoResourceColor.id)
      .title(eventWithNoResourceColor.title)
      .description(eventWithNoResourceColor.description)
      .span(eventWithNoResourceColor.start, eventWithNoResourceColor.end)
      .resource(eventWithNoResourceColor.resource as SchedulerResourceId)
      .toOccurrence();

    render(
      <EventCalendarProvider
        events={[eventWithNoResourceColor]}
        onEventsChange={onEventsChange}
        resources={resourcesNoColor}
      >
        <EventDraggableDialogContent
          open
          {...defaultProps}
          occurrence={eventWithNoResourceColorOccurrence}
        />
      </EventCalendarProvider>,
    );

    expect(screen.getByRole('button', { name: /resource/i }).textContent).to.match(/NoColor/i);
    expect(
      document.querySelector(`.${eventCalendarClasses.eventDialogResourceMenuColorDot}`),
    ).to.have.attribute('data-palette', 'teal');
  });

  it('should fallback to "No resource" with default color when the event has no resource', async () => {
    const onEventsChange = spy();

    const eventWithoutResource: SchedulerEvent = {
      ...DEFAULT_EVENT,
      resource: undefined,
    };

    const eventWithoutResourceOccurrence = EventBuilder.new(adapter)
      .id(eventWithoutResource.id)
      .title(eventWithoutResource.title)
      .description(eventWithoutResource.description)
      .span(eventWithoutResource.start, eventWithoutResource.end)
      .toOccurrence();

    const { user } = render(
      <EventCalendarProvider
        events={[eventWithoutResource]}
        onEventsChange={onEventsChange}
        resources={resources}
      >
        <EventDraggableDialogContent
          open
          {...defaultProps}
          occurrence={eventWithoutResourceOccurrence}
        />
      </EventCalendarProvider>,
    );

    expect(screen.getByRole('button', { name: /resource/i }).textContent).to.match(/no resource/i);

    expect(
      document.querySelector(`.${eventCalendarClasses.eventDialogResourceMenuColorDot}`),
    ).to.have.attribute('data-palette', 'teal');

    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(onEventsChange.calledOnce).to.equal(true);
    const updated = onEventsChange.firstCall.firstArg[0];
    expect(updated.resource).to.equal(undefined);
  });

  describe('Event creation', () => {
    it('should change surface of the placeholder to day-grid when all-day is changed to true', async () => {
      const start = adapter.date('2025-05-26T07:30:00Z', 'default');
      const end = adapter.date('2025-05-26T08:30:00Z', 'default');
      const handleSurfaceChange = spy();

      const creationOccurrence = EventBuilder.new(adapter)
        .id('tmp')
        .span(start, end)
        .toOccurrence();

      const { user } = render(
        <EventCalendarProvider events={[]} resources={resources}>
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext}
            onMount={(store) =>
              store.setOccurrencePlaceholder({
                type: 'creation',
                surfaceType: 'time-grid',
                start,
                end,
                lockSurfaceType: false,
                resourceId: null,
              })
            }
          />

          <EventDraggableDialogContent open {...defaultProps} occurrence={creationOccurrence} />

          <StateWatcher
            Context={SchedulerStoreContext}
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
      const start = adapter.date('2025-05-26T07:30:00Z', 'default');
      const end = adapter.date('2025-05-26T08:30:00Z', 'default');
      const handleSurfaceChange = spy();

      const creationOccurrence = EventBuilder.new(adapter)
        .id('tmp')
        .span(start, end)
        .allDay(true)
        .toOccurrence();

      const { user } = render(
        <EventCalendarProvider events={[]} resources={resources}>
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext}
            onMount={(store) =>
              store.setOccurrencePlaceholder({
                type: 'creation',
                surfaceType: 'day-grid',
                start,
                end,
                lockSurfaceType: false,
                resourceId: null,
              })
            }
          />

          <EventDraggableDialogContent open {...defaultProps} occurrence={creationOccurrence} />

          <StateWatcher
            Context={SchedulerStoreContext}
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
      const start = adapter.date('2025-05-26T07:30:00Z', 'default');
      const end = adapter.date('2025-05-26T08:30:00Z', 'default');
      const handleSurfaceChange = spy();

      const creationOccurrence = EventBuilder.new(adapter)
        .id('tmp')
        .span(start, end)
        .toOccurrence();

      const { user } = render(
        <EventCalendarProvider events={[]} resources={resources}>
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext}
            onMount={(store) =>
              store.setOccurrencePlaceholder({
                type: 'creation',
                surfaceType: 'time-grid',
                start,
                end,
                lockSurfaceType: true,
                resourceId: null,
              })
            }
          />

          <EventDraggableDialogContent
            open
            {...defaultProps}
            occurrence={creationOccurrence as any}
          />

          <StateWatcher
            Context={SchedulerStoreContext}
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
      const start = adapter.date('2025-06-10T09:00:00Z', 'default');
      const end = adapter.date('2025-06-10T09:30:00Z', 'default');
      const placeholder: SchedulerOccurrencePlaceholderCreation = {
        type: 'creation',
        surfaceType: 'time-grid' as const,
        start,
        end,
        lockSurfaceType: false,
        resourceId: null,
      };

      const creationOccurrence = EventBuilder.new(adapter)
        .id('placeholder-id')
        .span(start, end)
        .title('')
        .description('')
        .toOccurrence();

      const onEventsChange = spy();
      let createEventSpy;

      const { user } = render(
        <EventCalendarProvider events={[]} resources={resources} onEventsChange={onEventsChange}>
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext}
            onMount={(store) => store.setOccurrencePlaceholder(placeholder)}
          />
          <StoreSpy
            Context={SchedulerStoreContext}
            method="createEvent"
            onSpyReady={(sp) => {
              createEventSpy = sp;
            }}
          />

          <EventDraggableDialogContent open {...defaultProps} occurrence={creationOccurrence} />
        </EventCalendarProvider>,
      );

      await user.type(screen.getByLabelText(/event title/i), ' New title ');
      await user.type(screen.getByLabelText(/description/i), ' Some details ');
      await user.click(screen.getByRole('button', { name: /resource/i }));
      await user.click(await screen.findByRole('menuitem', { name: /work/i }));
      await user.click(screen.getByRole('tab', { name: /recurrence/i }));
      await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
      await user.click(await screen.findByRole('option', { name: /daily/i }));
      await user.click(screen.getByRole('button', { name: /save changes/i }));

      expect(createEventSpy?.calledOnce).to.equal(true);
      const payload = createEventSpy.lastCall.firstArg;

      expect(payload.title).to.equal('New title');
      expect(payload.description).to.equal('Some details');
      expect(payload.allDay).to.equal(false);
      expect(payload.resource).to.equal('r1');
      expect(payload.start).toEqualDateTime(start);
      expect(payload.end).toEqualDateTime(end);
      expect(payload.rrule).to.deep.equal({ freq: 'DAILY', interval: 1 });
    });

    it('should interpret form date/time in the displayTimezone when creating an event', async () => {
      const displayTimezone = 'Pacific/Kiritimati';

      const start = adapter.date('2025-06-10T09:00:00Z', 'default');
      const end = adapter.date('2025-06-10T09:30:00Z', 'default');

      const placeholder: SchedulerOccurrencePlaceholderCreation = {
        type: 'creation',
        surfaceType: 'time-grid' as const,
        start,
        end,
        lockSurfaceType: false,
        resourceId: null,
      };

      const creationOccurrence = EventBuilder.new(adapter)
        .id('placeholder-id')
        .span(start, end)
        .title('')
        .toOccurrence();

      const onEventsChange = spy();
      let createEventSpy;

      const { user } = render(
        <EventCalendarProvider
          events={[]}
          resources={resources}
          onEventsChange={onEventsChange}
          displayTimezone={displayTimezone}
        >
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext}
            onMount={(store) => store.setOccurrencePlaceholder(placeholder)}
          />
          <StoreSpy
            Context={SchedulerStoreContext}
            method="createEvent"
            onSpyReady={(sp) => {
              createEventSpy = sp;
            }}
          />
          <EventDraggableDialogContent open {...defaultProps} occurrence={creationOccurrence} />
        </EventCalendarProvider>,
      );

      await user.type(screen.getByLabelText(/event title/i), 'My event');

      await user.clear(screen.getByLabelText(/start date/i));
      await user.type(screen.getByLabelText(/start date/i), '2025-06-10');
      await user.clear(screen.getByLabelText(/start time/i));
      await user.type(screen.getByLabelText(/start time/i), '09:00');

      await user.clear(screen.getByLabelText(/end date/i));
      await user.type(screen.getByLabelText(/end date/i), '2025-06-10');
      await user.clear(screen.getByLabelText(/end time/i));
      await user.type(screen.getByLabelText(/end time/i), '10:00');

      await user.click(screen.getByRole('button', { name: /save changes/i }));

      expect(createEventSpy?.calledOnce).to.equal(true);
      const payload = createEventSpy.lastCall.firstArg;

      // Form inputs are wall-time values.
      // They must be interpreted in displayTimezone, not in 'default'.
      const expectedStart = adapter.date('2025-06-10T09:00:00', displayTimezone);
      const expectedEnd = adapter.date('2025-06-10T10:00:00', displayTimezone);

      expect(payload.start).toEqualDateTime(expectedStart);
      expect(payload.end).toEqualDateTime(expectedEnd);
    });
  });
  describe('Event editing', () => {
    describe('Recurring events', () => {
      const originalRecurringEvent = EventBuilder.new()
        .title('Daily standup')
        .description('sync')
        .singleDay('2025-06-11T10:00:00Z', 30)
        .resource('r2')
        .recurrent('DAILY')
        .build();
      const originalRecurringEventOccurrence = EventBuilder.new(adapter)
        .id(originalRecurringEvent.id)
        .title(originalRecurringEvent.title)
        .description(originalRecurringEvent.description)
        .span(originalRecurringEvent.start, originalRecurringEvent.end)
        .recurrent('DAILY')
        .toOccurrence();

      it('should not call updateRecurringEvent if the user cancels the scope dialog', async () => {
        let updateRecurringEventSpy, selectRecurringEventUpdateScopeSpy;
        const containerRef = React.createRef<HTMLDivElement>();

        const { user } = render(
          <React.Fragment>
            <div ref={containerRef} />
            <EventCalendarProvider events={[originalRecurringEvent]} resources={resources}>
              <StoreSpy
                Context={SchedulerStoreContext}
                method="updateRecurringEvent"
                onSpyReady={(sp) => {
                  updateRecurringEventSpy = sp;
                }}
              />
              <StoreSpy
                Context={SchedulerStoreContext}
                method="selectRecurringEventUpdateScope"
                onSpyReady={(sp) => {
                  selectRecurringEventUpdateScopeSpy = sp;
                }}
              />

              <EventDraggableDialogContent
                open
                {...defaultProps}
                occurrence={originalRecurringEventOccurrence}
              />

              <RecurringScopeDialog />
            </EventCalendarProvider>
          </React.Fragment>,
        );

        await user.clear(screen.getByLabelText(/start time/i));
        await user.type(screen.getByLabelText(/start time/i), '10:05');
        await user.clear(screen.getByLabelText(/end time/i));
        await user.type(screen.getByLabelText(/end time/i), '10:35');
        await user.click(screen.getByRole('button', { name: /save changes/i }));

        await screen.findByText(/Apply this change to:/i);
        await user.click(screen.getByText(/All events in the series/i));
        await user.click(screen.getByRole('button', { name: /Cancel/i }));

        expect(updateRecurringEventSpy?.calledOnce).to.equal(true);
        expect(selectRecurringEventUpdateScopeSpy?.called).to.equal(true);
        expect(selectRecurringEventUpdateScopeSpy?.lastCall.firstArg).to.equal(null);
        expect(updateRecurringEventSpy?.callCount).to.equal(1);
      });

      it("should call updateRecurringEvent with scope 'all' and not include rrule if not modified on Submit", async () => {
        let updateRecurringEventSpy, selectRecurringEventUpdateScopeSpy;
        const containerRef = React.createRef<HTMLDivElement>();

        const { user } = render(
          <React.Fragment>
            <div ref={containerRef} />
            <EventCalendarProvider events={[originalRecurringEvent]} resources={resources}>
              <StoreSpy
                Context={SchedulerStoreContext}
                method="updateRecurringEvent"
                onSpyReady={(sp) => {
                  updateRecurringEventSpy = sp;
                }}
              />
              <StoreSpy
                Context={SchedulerStoreContext}
                method="selectRecurringEventUpdateScope"
                onSpyReady={(sp) => {
                  selectRecurringEventUpdateScopeSpy = sp;
                }}
              />

              <EventDraggableDialogContent
                open
                {...defaultProps}
                occurrence={originalRecurringEventOccurrence}
              />

              <RecurringScopeDialog />
            </EventCalendarProvider>
          </React.Fragment>,
        );

        await user.clear(screen.getByLabelText(/start time/i));
        await user.type(screen.getByLabelText(/start time/i), '10:05');
        await user.clear(screen.getByLabelText(/end time/i));
        await user.type(screen.getByLabelText(/end time/i), '10:35');
        await user.click(screen.getByRole('button', { name: /save changes/i }));

        await screen.findByText(/Apply this change to:/i);
        await user.click(screen.getByText(/All events in the series/i));
        await user.click(screen.getByRole('button', { name: /Confirm/i }));

        expect(updateRecurringEventSpy?.calledOnce).to.equal(true);
        const openPayload = updateRecurringEventSpy.lastCall.firstArg;

        expect(openPayload.changes.id).to.equal(originalRecurringEvent.id);
        expect(openPayload.changes.title).to.equal('Daily standup');
        expect(openPayload.changes.description).to.equal('sync');
        expect(openPayload.changes.allDay).to.equal(false);
        expect(openPayload.changes.start).to.toEqualDateTime(
          adapter.date('2025-06-11T10:05:00', 'default'),
        );
        expect(openPayload.changes.end).to.toEqualDateTime(
          adapter.date('2025-06-11T10:35:00', 'default'),
        );
        expect(openPayload.changes).to.not.have.property('rrule');

        expect(selectRecurringEventUpdateScopeSpy?.calledOnce).to.equal(true);
        expect(selectRecurringEventUpdateScopeSpy?.lastCall.firstArg).to.equal('all');
      });

      it("should call updateRecurringEvent with scope 'only-this' and include rrule if modified on Submit", async () => {
        let updateRecurringEventSpy, selectRecurringEventUpdateScopeSpy;
        const containerRef = React.createRef<HTMLDivElement>();

        const { user } = render(
          <React.Fragment>
            <div ref={containerRef} />
            <EventCalendarProvider events={[originalRecurringEvent]} resources={resources}>
              <StoreSpy
                Context={SchedulerStoreContext}
                method="updateRecurringEvent"
                onSpyReady={(sp) => {
                  updateRecurringEventSpy = sp;
                }}
              />
              <StoreSpy
                Context={SchedulerStoreContext}
                method="selectRecurringEventUpdateScope"
                onSpyReady={(sp) => {
                  selectRecurringEventUpdateScopeSpy = sp;
                }}
              />

              <EventDraggableDialogContent
                open
                {...defaultProps}
                occurrence={originalRecurringEventOccurrence}
              />

              <RecurringScopeDialog />
            </EventCalendarProvider>
          </React.Fragment>,
        );
        // We update the recurrence from daily to weekly
        await user.click(screen.getByRole('tab', { name: /recurrence/i }));
        await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
        await user.click(await screen.findByRole('option', { name: /repeats weekly/i }));
        await user.click(screen.getByRole('button', { name: /save changes/i }));

        await screen.findByText(/Apply this change to:/i);
        await user.click(screen.getByText(/Only this event/i));
        await user.click(screen.getByRole('button', { name: /Confirm/i }));

        expect(updateRecurringEventSpy?.calledOnce).to.equal(true);
        const openPayload = updateRecurringEventSpy.lastCall.firstArg;

        expect(openPayload.changes.id).to.equal(originalRecurringEvent.id);
        expect(openPayload.changes.title).to.equal(originalRecurringEventOccurrence.title);
        expect(openPayload.changes.description).to.equal(
          originalRecurringEventOccurrence.description,
        );
        expect(openPayload.changes.allDay).to.equal(originalRecurringEventOccurrence.allDay);
        expect(openPayload.changes.rrule).to.deep.equal({
          freq: 'WEEKLY',
          interval: 1,
          byDay: ['WE'],
        });
        expect(selectRecurringEventUpdateScopeSpy?.calledOnce).to.equal(true);
        expect(selectRecurringEventUpdateScopeSpy?.lastCall.firstArg).to.equal('only-this');
      });

      it('should call updateRecurringEvent with scope "this-and-following" and send rrule as undefined when "no repeat" is selected on Submit', async () => {
        let updateRecurringEventSpy, selectRecurringEventUpdateScopeSpy;
        const containerRef = React.createRef<HTMLDivElement>();

        const { user } = render(
          <React.Fragment>
            <div ref={containerRef} />
            <EventCalendarProvider events={[originalRecurringEvent]} resources={resources}>
              <StoreSpy
                Context={SchedulerStoreContext}
                method="updateRecurringEvent"
                onSpyReady={(sp) => {
                  updateRecurringEventSpy = sp;
                }}
              />
              <StoreSpy
                Context={SchedulerStoreContext}
                method="selectRecurringEventUpdateScope"
                onSpyReady={(sp) => {
                  selectRecurringEventUpdateScopeSpy = sp;
                }}
              />

              <EventDraggableDialogContent
                open
                {...defaultProps}
                occurrence={originalRecurringEventOccurrence}
              />

              <RecurringScopeDialog />
            </EventCalendarProvider>
          </React.Fragment>,
        );

        await user.click(screen.getByRole('tab', { name: /recurrence/i }));
        await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
        await user.click(await screen.findByRole('option', { name: /don.?t repeat/i }));
        await user.click(screen.getByRole('button', { name: /save changes/i }));

        await screen.findByText(/Apply this change to:/i);
        await user.click(screen.getByText(/This and following events/i));
        await user.click(screen.getByRole('button', { name: /Confirm/i }));

        expect(updateRecurringEventSpy?.calledOnce).to.equal(true);
        const openPayload = updateRecurringEventSpy.lastCall.firstArg;

        expect(openPayload.changes.id).to.equal(originalRecurringEvent.id);
        expect(openPayload.changes.rrule).to.equal(undefined);

        expect(selectRecurringEventUpdateScopeSpy?.calledOnce).to.equal(true);
        expect(selectRecurringEventUpdateScopeSpy?.lastCall.firstArg).to.equal(
          'this-and-following',
        );
      });

      describe('Recurrence Custom behavior', () => {
        it('should render recurrence fields as disabled when not recurrent', async () => {
          const { user } = render(
            <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources}>
              <EventDraggableDialogContent open {...defaultProps} />
            </EventCalendarProvider>,
          );

          await user.click(screen.getByRole('tab', { name: /recurrence/i }));

          expect(screen.getByRole('combobox', { name: /recurrence/i })).to.not.equal(null);

          // MUI FormControl with disabled disables the child inputs
          const repeatFieldset = screen.getByRole('group', { name: /repeat/i });
          const intervalInput = within(repeatFieldset).getByRole('spinbutton');
          expect(intervalInput).to.have.attribute('disabled');
          const freqCombobox = within(repeatFieldset).getByRole('combobox');
          expect(freqCombobox).to.have.attribute('aria-disabled', 'true');
        });

        it('should keep recurrence fields disabled when a preset is selected', async () => {
          const { user } = render(
            <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources}>
              <EventDraggableDialogContent open {...defaultProps} />
            </EventCalendarProvider>,
          );

          await user.click(screen.getByRole('tab', { name: /recurrence/i }));
          await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
          await user.click(await screen.findByRole('option', { name: /repeats daily/i }));

          // MUI FormControl with disabled disables the child inputs
          const repeatFieldset = screen.getByRole('group', { name: /repeat/i });
          const intervalInput = within(repeatFieldset).getByRole('spinbutton');
          expect(intervalInput).to.have.attribute('disabled');
          const freqCombobox = within(repeatFieldset).getByRole('combobox');
          expect(freqCombobox).to.have.attribute('aria-disabled', 'true');
        });

        it('should enable recurrence fields when selecting the custom repeat rule option', async () => {
          const { user } = render(
            <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources}>
              <EventDraggableDialogContent open {...defaultProps} />
            </EventCalendarProvider>,
          );

          await user.click(screen.getByRole('tab', { name: /recurrence/i }));
          await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
          await user.click(await screen.findByRole('option', { name: /custom repeat rule/i }));

          // MUI FormControl without disabled renders enabled child inputs
          const repeatFieldset = screen.getByRole('group', { name: /repeat/i });
          const intervalInput = within(repeatFieldset).getByRole('spinbutton');
          expect(intervalInput).not.to.have.attribute('disabled');
          const freqCombobox = within(repeatFieldset).getByRole('combobox');
          expect(freqCombobox).not.to.have.attribute('aria-disabled');
        });

        it('should submit custom recurrence with Ends: after', async () => {
          const onEventsChange = spy();

          const { user } = render(
            <EventCalendarProvider
              events={[DEFAULT_EVENT]}
              resources={resources}
              onEventsChange={onEventsChange}
            >
              <EventDraggableDialogContent open {...defaultProps} />
            </EventCalendarProvider>,
          );

          await user.click(screen.getByRole('tab', { name: /recurrence/i }));
          await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
          await user.click(await screen.findByRole('option', { name: /custom/i }));

          // Every: set interval = 2
          const repeatGroup = screen.getByRole('group', { name: /repeat/i });
          const intervalInput = within(repeatGroup).getByRole('spinbutton');
          await user.click(intervalInput);
          await user.keyboard('{Control>}a{/Control}2');

          // Frequency: weeks
          const freqCombo = within(repeatGroup).getByRole('combobox');
          await user.click(freqCombo);
          await user.click(await screen.findByRole('option', { name: /weeks/i }));

          // Ends: select "After"
          const endsFieldset = screen.getByRole('group', { name: /ends/i });
          const afterRadio = within(endsFieldset).getByText('After');
          await user.click(afterRadio);

          // Set count = 5
          const countInput = within(endsFieldset).getByRole('spinbutton');
          await user.click(countInput);
          await user.keyboard('{Control>}a{/Control}5');

          await user.click(screen.getByRole('button', { name: /save changes/i }));

          expect(onEventsChange.calledOnce).to.equal(true);
          const updated = onEventsChange.firstCall.firstArg[0];

          expect(updated.rrule).to.deep.equal({
            freq: 'WEEKLY',
            byDay: [],
            byMonthDay: [],
            interval: 2,
            count: 5,
            until: undefined,
          });
        });

        it('should submit custom recurrence with Ends: never', async () => {
          const onEventsChange = spy();

          const { user } = render(
            <EventCalendarProvider
              events={[DEFAULT_EVENT]}
              resources={resources}
              onEventsChange={onEventsChange}
            >
              <EventDraggableDialogContent open {...defaultProps} />
            </EventCalendarProvider>,
          );

          await user.click(screen.getByRole('tab', { name: /recurrence/i }));
          await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
          await user.click(await screen.findByRole('option', { name: /custom/i }));

          // Every: set interval = 2, frequency = months
          const repeatGroup = screen.getByRole('group', { name: /repeat/i });
          const intervalInput = within(repeatGroup).getByRole('spinbutton');
          await user.click(intervalInput);
          await user.keyboard('{Control>}a{/Control}2');

          const freqCombo = within(repeatGroup).getByRole('combobox');
          await user.click(freqCombo);
          await user.click(await screen.findByRole('option', { name: /months/i }));

          // Ends: keep Never (default)
          const endsFieldset = screen.getByRole('group', { name: /ends/i });
          // MUI Radio uses native radio inputs, not aria-checked
          const neverRadio = within(endsFieldset).getByRole('radio', {
            name: /never/i,
          }) as HTMLInputElement;
          expect(neverRadio.checked).to.equal(true);

          await user.click(screen.getByRole('button', { name: /save changes/i }));

          expect(onEventsChange.calledOnce).to.equal(true);
          const updated = onEventsChange.firstCall.firstArg[0];

          // DEFAULT_EVENT is 2025-05-26, so byMonthDay defaults to [26]
          expect(updated.rrule).to.deep.equal({
            freq: 'MONTHLY',
            byDay: [],
            byMonthDay: [26],
            interval: 2,
          });
        });

        it('should submit custom recurrence with Ends: until and selected date', async () => {
          const onEventsChange = spy();

          const { user } = render(
            <EventCalendarProvider
              events={[DEFAULT_EVENT]}
              resources={resources}
              onEventsChange={onEventsChange}
            >
              <EventDraggableDialogContent open {...defaultProps} />
            </EventCalendarProvider>,
          );

          await user.click(screen.getByRole('tab', { name: /recurrence/i }));
          await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
          await user.click(await screen.findByRole('option', { name: /custom/i }));

          // Every: set interval = 3, frequency = years
          const repeatGroup = screen.getByRole('group', { name: /repeat/i });
          const intervalInput = within(repeatGroup).getByRole('spinbutton');
          await user.click(intervalInput);
          await user.keyboard('{Control>}a{/Control}3');

          const freqCombo = within(repeatGroup).getByRole('combobox');
          await user.click(freqCombo);
          await user.click(await screen.findByRole('option', { name: /years/i }));

          // Ends: "Until" and date 2025-07-20
          const endsFieldset = screen.getByRole('group', { name: /ends/i });
          const untilRadio = within(endsFieldset).getByRole('radio', { name: /until/i });
          await user.click(untilRadio);
          // In MUI, the date input is a sibling TextField, not inside the label
          const dateInput = endsFieldset.querySelector('input[type="date"]') as HTMLInputElement;
          await user.click(dateInput);
          await user.clear(dateInput);
          await user.type(dateInput, '2025-07-20');

          await user.click(screen.getByRole('button', { name: /save changes/i }));

          expect(onEventsChange.calledOnce).to.equal(true);
          const updated = onEventsChange.firstCall.firstArg[0];

          expect(updated.rrule).to.deep.include({ freq: 'YEARLY', interval: 3 });
          expect(updated.rrule?.count ?? undefined).to.equal(undefined);
          expect(updated.rrule?.until).toEqualDateTime('2025-07-20T00:00:00.000Z');
        });

        it('should submit custom weekly with selected weekdays', async () => {
          const onEventsChange = spy();

          const { user } = render(
            <EventCalendarProvider
              events={[DEFAULT_EVENT]}
              resources={resources}
              onEventsChange={onEventsChange}
            >
              <EventDraggableDialogContent open {...defaultProps} />
            </EventCalendarProvider>,
          );

          await user.click(screen.getByRole('tab', { name: /recurrence/i }));
          await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
          await user.click(await screen.findByRole('option', { name: /custom/i }));

          const repeatGroup = screen.getByRole('group', { name: /repeat/i });
          const freqCombo = within(repeatGroup).getByRole('combobox');
          await user.click(freqCombo);
          await user.click(await screen.findByRole('option', { name: /weeks/i }));

          // Select Monday and Friday in the weekly day toggles
          await user.click(screen.getByRole('button', { name: /monday/i }));
          await user.click(screen.getByRole('button', { name: /friday/i }));

          await user.click(screen.getByRole('button', { name: /save changes/i }));

          expect(onEventsChange.calledOnce).to.equal(true);
          const updated = onEventsChange.firstCall.firstArg[0];

          expect(updated.rrule).to.deep.equal({
            freq: 'WEEKLY',
            interval: 1,
            byDay: ['MO', 'FR'],
            byMonthDay: [],
          });
        });

        it('should submit custom monthly with "day of month" option', async () => {
          const onEventsChange = spy();

          const { user } = render(
            <EventCalendarProvider
              events={[DEFAULT_EVENT]}
              resources={resources}
              onEventsChange={onEventsChange}
            >
              <EventDraggableDialogContent open {...defaultProps} />
            </EventCalendarProvider>,
          );

          await user.click(screen.getByRole('tab', { name: /recurrence/i }));
          await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
          await user.click(await screen.findByRole('option', { name: /custom/i }));

          const repeatGroup = screen.getByRole('group', { name: /repeat/i });
          const freqCombo = within(repeatGroup).getByRole('combobox');
          await user.click(freqCombo);
          await user.click(await screen.findByRole('option', { name: /months/i }));

          // The "Day 26" button is selected by default when switching to MONTHLY mode
          // Verify it's selected
          const dayButton = screen.getByRole('button', { name: /day 26/i }); // DEFAULT_EVENT is 2025-05-26
          expect(dayButton).to.have.attribute('aria-pressed', 'true');

          await user.click(screen.getByRole('button', { name: /save changes/i }));

          expect(onEventsChange.calledOnce).to.equal(true);
          const updated = onEventsChange.firstCall.firstArg[0];

          expect(updated.rrule).to.deep.equal({
            freq: 'MONTHLY',
            interval: 1,
            byDay: [],
            byMonthDay: [26],
          });
        });

        it('should submit custom monthly with "ordinal weekday" option', async () => {
          const onEventsChange = spy();

          const { user } = render(
            <EventCalendarProvider
              events={[DEFAULT_EVENT]}
              resources={resources}
              onEventsChange={onEventsChange}
            >
              <EventDraggableDialogContent open {...defaultProps} />
            </EventCalendarProvider>,
          );

          await user.click(screen.getByRole('tab', { name: /recurrence/i }));
          await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
          await user.click(await screen.findByRole('option', { name: /custom/i }));

          const repeatGroup = screen.getByRole('group', { name: /repeat/i });
          const freqCombo = within(repeatGroup).getByRole('combobox');
          await user.click(freqCombo);
          await user.click(await screen.findByRole('option', { name: /months/i }));

          // The DEFAULT_EVENT (2025-05-26 Mon) is the last Monday of the month ("-1MO")
          await user.click(screen.getByRole('button', { name: /mon.*last week/i }));

          await user.click(screen.getByRole('button', { name: /save changes/i }));

          expect(onEventsChange.calledOnce).to.equal(true);
          const updated = onEventsChange.firstCall.firstArg[0];

          expect(updated.rrule).to.deep.equal({
            freq: 'MONTHLY',
            interval: 1,
            byDay: ['-1MO'],
          });
        });
      });
    });

    describe('Non-recurring events', () => {
      const nonRecurringEvent: SchedulerEvent = EventBuilder.new()
        .id('non-recurring-1')
        .title('Task')
        .description('description')
        .singleDay('2025-06-12T14:00:00Z')
        .build();
      const nonRecurringEventOccurrence = EventBuilder.new(adapter)
        .id(nonRecurringEvent.id)
        .title(nonRecurringEvent.title)
        .description(nonRecurringEvent.description)
        .singleDay('2025-06-12T14:00:00Z')
        .toOccurrence();

      it('should call updateEvent with updated values on Submit', async () => {
        let updateEventSpy;

        const { user } = render(
          <EventCalendarProvider events={[nonRecurringEvent]} resources={resources}>
            <StoreSpy
              Context={SchedulerStoreContext}
              method="updateEvent"
              onSpyReady={(sp) => {
                updateEventSpy = sp;
              }}
            />

            <EventDraggableDialogContent
              open
              {...defaultProps}
              occurrence={nonRecurringEventOccurrence}
            />
          </EventCalendarProvider>,
        );
        await user.type(screen.getByLabelText(/event title/i), ' updated ');
        await user.clear(screen.getByLabelText(/description/i));
        await user.type(screen.getByLabelText(/description/i), '  new description  ');
        await user.click(screen.getByRole('button', { name: /resource/i }));
        await user.click(await screen.findByRole('menuitem', { name: /work/i }));
        await user.click(screen.getByRole('button', { name: /save changes/i }));

        expect(updateEventSpy?.calledOnce).to.equal(true);
        const payload = updateEventSpy.lastCall.firstArg;

        expect(payload.id).to.equal(nonRecurringEvent.id);
        expect(payload.title).to.equal('Task updated');
        expect(payload.description).to.equal('new description');
        expect(payload.resource).to.equal('r1');
        expect(payload.allDay).to.equal(false);
        expect(payload.start).toEqualDateTime(adapter.date('2025-06-12T14:00:00', 'default'));
        expect(payload.end).toEqualDateTime(adapter.date('2025-06-12T15:00:00', 'default'));
        expect(payload.rrule).to.equal(undefined);
      });

      it('should call updateEvent with updated values and send rrule if recurrence was selected on Submit', async () => {
        let updateEventSpy;

        const { user } = render(
          <EventCalendarProvider events={[nonRecurringEvent]} resources={resources}>
            <StoreSpy
              Context={SchedulerStoreContext}
              method="updateEvent"
              onSpyReady={(sp) => {
                updateEventSpy = sp;
              }}
            />

            <EventDraggableDialogContent
              open
              {...defaultProps}
              occurrence={nonRecurringEventOccurrence}
            />
          </EventCalendarProvider>,
        );
        await user.click(screen.getByRole('tab', { name: /recurrence/i }));
        await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
        await user.click(await screen.findByRole('option', { name: /repeats daily/i }));
        await user.click(screen.getByRole('button', { name: /save changes/i }));

        expect(updateEventSpy?.calledOnce).to.equal(true);
        const payload = updateEventSpy.lastCall.firstArg;

        expect(payload.id).to.equal(nonRecurringEvent.id);
        expect(payload.rrule).to.deep.equal({
          freq: 'DAILY',
          interval: 1,
        });
      });
    });
  });

  describe('Event dialog classes', () => {
    it('should apply built-in classes to dialog elements', () => {
      render(
        <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources}>
          <EventDraggableDialogContent open {...defaultProps} />
        </EventCalendarProvider>,
      );

      expect(document.querySelector('.MuiEventCalendar-eventDialog')).not.to.equal(null);
      expect(document.querySelector('.MuiEventCalendar-eventDialogCloseButton')).not.to.equal(null);
      expect(document.querySelector('.MuiEventCalendar-eventDialogDragHandle')).not.to.equal(null);
      expect(document.querySelector('.MuiEventCalendar-eventDialogHeader')).not.to.equal(null);
      expect(document.querySelector('.MuiEventCalendar-eventDialogHeaderContent')).not.to.equal(
        null,
      );
      expect(document.querySelector('.MuiEventCalendar-eventDialogContent')).not.to.equal(null);
      expect(document.querySelector('.MuiEventCalendar-eventDialogGeneralTabContent')).not.to.equal(
        null,
      );
      expect(
        document.querySelector('.MuiEventCalendar-eventDialogDateTimeFieldsContainer'),
      ).not.to.equal(null);
      expect(document.querySelector('.MuiEventCalendar-eventDialogDateTimeFieldsRow')).not.to.equal(
        null,
      );
      expect(document.querySelector('.MuiEventCalendar-eventDialogFormActions')).not.to.equal(null);
    });

    it('should apply built-in classes to readonly dialog elements', () => {
      const readOnlyEvent = { ...DEFAULT_EVENT, readOnly: true };
      const readOnlyOccurrence = EventBuilder.new(adapter)
        .id(readOnlyEvent.id)
        .title(readOnlyEvent.title)
        .description(readOnlyEvent.description)
        .span(readOnlyEvent.start, readOnlyEvent.end)
        .readOnly(true)
        .toOccurrence();

      render(
        <EventCalendarProvider events={[readOnlyEvent]} resources={resources}>
          <EventDraggableDialogContent open {...defaultProps} occurrence={readOnlyOccurrence} />
        </EventCalendarProvider>,
      );

      expect(document.querySelector('.MuiEventCalendar-eventDialog')).not.to.equal(null);
      expect(document.querySelector('.MuiEventCalendar-eventDialogHeader')).not.to.equal(null);
      expect(document.querySelector('.MuiEventCalendar-eventDialogReadonlyContent')).not.to.equal(
        null,
      );
      expect(document.querySelector('.MuiEventCalendar-eventDialogActions')).not.to.equal(null);
      expect(document.querySelector('.MuiEventCalendar-eventDialogTitle')).not.to.equal(null);
      expect(document.querySelector('.MuiEventCalendar-eventDialogDateTimeContainer')).not.to.equal(
        null,
      );
    });
  });
});
