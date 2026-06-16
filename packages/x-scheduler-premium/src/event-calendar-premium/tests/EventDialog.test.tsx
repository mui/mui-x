import * as React from 'react';
import { spy } from 'sinon';
import {
  adapter,
  createSchedulerRenderer,
  EventBuilder,
  ResourceBuilder,
  SchedulerStoreRunner,
  StateWatcher,
  StoreSpy,
  AnyEventCalendarStore,
} from 'test/utils/scheduler';
import { screen, within } from '@mui/internal-test-utils';
import {
  SchedulerResource,
  SchedulerOccurrencePlaceholderCreation,
} from '@mui/x-scheduler-internals/models';
import { SchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { ExtendableEventCalendarStore } from '@mui/x-scheduler-internals/use-event-calendar';
import { schedulerRecurringEventsPlugin } from '@mui/x-scheduler-internals-premium/internals';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import {
  EventCalendarProvider,
  EventDialogContent,
  EventEditingOptionalRenderersContext,
} from '@mui/x-scheduler/internals';
import { PREMIUM_EVENT_DIALOG_OPTIONAL_RENDERERS } from '../../internals/eventDialogOptionalRenderers';
import { RecurringScopeDialog } from '../../internals/components/recurring-scope-dialog/RecurringScopeDialog';

/**
 * Wraps EventDialogContent with the premium renderers the production code supplies
 * at runtime. Tests render EventDialogContent in isolation (without
 * EventCalendarPremium), so we provide the renderers manually here.
 */
function TestEventDialogContent(props: React.ComponentProps<typeof EventDialogContent>) {
  return (
    <EventEditingOptionalRenderersContext.Provider value={PREMIUM_EVENT_DIALOG_OPTIONAL_RENDERERS}>
      <EventDialogContent {...props} />
    </EventEditingOptionalRenderersContext.Provider>
  );
}

/**
 * A test store that behaves like a premium store, enabling recurring event features.
 */
class PremiumTestStore extends ExtendableEventCalendarStore<any, any> {
  public constructor(parameters: any, adapterParam: any) {
    super(parameters, adapterParam, 'EventCalendarPremiumStore', schedulerRecurringEventsPlugin);
  }
}

const workResource = ResourceBuilder.new().title('Work').eventColor('blue').build();
const personalResource = ResourceBuilder.new().title('Personal').eventColor('teal').build();

const DEFAULT_EVENT: SchedulerEvent = EventBuilder.new()
  .title('Running')
  .description('Morning run')
  .singleDay('2025-05-26T07:30:00Z', 45)
  .resource(personalResource)
  .build();

const resources: SchedulerResource[] = [workResource, personalResource];

describe('<EventDialogContent open />', () => {
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
      .resource(personalResource)
      .toOccurrence(),
    onClose: () => {},
  };

  const { render } = createSchedulerRenderer();

  it('should render the event data in the form fields', async () => {
    const { user } = render(
      <EventCalendarProvider
        events={[DEFAULT_EVENT]}
        resources={resources}
        storeClass={PremiumTestStore}
      >
        <TestEventDialogContent open {...defaultProps} />
      </EventCalendarProvider>,
    );
    expect(screen.getByDisplayValue(DEFAULT_EVENT.title)).not.to.equal(null);
    expect(screen.getByDisplayValue(DEFAULT_EVENT.description ?? '')).not.to.equal(null);
    expect(screen.getByLabelText(/start date/i)).to.have.value('2025-05-26');
    expect(screen.getByLabelText(/end date/i)).to.have.value('2025-05-26');
    expect(screen.getByLabelText(/start time/i)).to.have.value('07:30');
    expect(screen.getByLabelText(/end time/i)).to.have.value('08:15');
    expect((screen.getByRole('switch', { name: /all day/i }) as HTMLInputElement).checked).to.equal(
      false,
    );
    expect(screen.getByRole('combobox', { name: /resource/i }).textContent).to.match(/personal/i);
    expect(screen.getByRole('group', { name: /date & time/i })).to.not.equal(null);
    expect(screen.getByRole('group', { name: /resource & color/i })).to.not.equal(null);
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
        storeClass={PremiumTestStore}
      >
        <TestEventDialogContent open {...defaultProps} />
      </EventCalendarProvider>,
    );
    await user.type(screen.getByLabelText(/event title/i), ' test');
    await user.click(screen.getByRole('switch', { name: /all day/i }));
    await user.click(screen.getByRole('tab', { name: /recurrence/i }));
    await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
    await user.click(await screen.findByRole('option', { name: /repeats daily/i }));
    await user.click(screen.getByRole('tab', { name: /general/i }));
    await user.click(screen.getByRole('combobox', { name: /resource/i }));
    await user.click(await screen.findByRole('option', { name: /work/i }));
    await user.click(screen.getByRole('button', { name: /pink/i }));
    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(onEventsChange.calledOnce).to.equal(true);
    const updated = onEventsChange.firstCall.firstArg[0];

    const expectedUpdatedEvent = {
      id: DEFAULT_EVENT.id,
      title: 'Running test',
      description: DEFAULT_EVENT.description,
      start: adapter.startOfDay(adapter.date(DEFAULT_EVENT.start, 'default')).toISOString(),
      end: adapter.endOfDay(adapter.date(DEFAULT_EVENT.end, 'default')).toISOString(),
      allDay: true,
      rrule: { freq: 'DAILY', interval: 1 },
      resource: workResource.id,
      color: 'pink',
    };

    expect(updated).to.deep.equal(expectedUpdatedEvent);
  }, 10_000);

  it('should clear the color when clicking the active color toggle', async () => {
    const onEventsChange = spy();
    const { user } = render(
      <EventCalendarProvider
        events={[DEFAULT_EVENT]}
        onEventsChange={onEventsChange}
        resources={resources}
        storeClass={PremiumTestStore}
      >
        <TestEventDialogContent open {...defaultProps} />
      </EventCalendarProvider>,
    );
    const pinkToggle = screen.getByRole('button', { name: /pink/i });
    await user.click(pinkToggle);
    expect(pinkToggle).to.have.attribute('aria-pressed', 'true');
    await user.click(pinkToggle);
    expect(pinkToggle).to.have.attribute('aria-pressed', 'false');
    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(onEventsChange.calledOnce).to.equal(true);
    expect(onEventsChange.firstCall.firstArg[0].color).to.not.equal('pink');
  });

  it('should show error if start date is after end date', async () => {
    const { user } = render(
      <EventCalendarProvider
        events={[DEFAULT_EVENT]}
        resources={resources}
        storeClass={PremiumTestStore}
      >
        <TestEventDialogContent open {...defaultProps} />
      </EventCalendarProvider>,
    );
    await user.clear(screen.getByLabelText(/start date/i));
    await user.type(screen.getByLabelText(/start date/i), '2025-05-27');
    await user.clear(screen.getByLabelText(/end date/i));
    await user.type(screen.getByLabelText(/end date/i), '2025-05-26');
    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(screen.getDescriptionOf(screen.getByLabelText(/start date/i)).textContent).to.match(
      /start.*before.*end/i,
    );
  });

  it('should call "onEventsChange" with the updated values when delete button is clicked', async () => {
    const onEventsChange = spy();
    const { user } = render(
      <EventCalendarProvider
        events={[DEFAULT_EVENT]}
        onEventsChange={onEventsChange}
        resources={resources}
        storeClass={PremiumTestStore}
      >
        <TestEventDialogContent open {...defaultProps} />
      </EventCalendarProvider>,
    );
    await user.click(screen.getByRole('button', { name: /delete event/i }));
    expect(onEventsChange.calledOnce).to.equal(true);
    expect(onEventsChange.firstCall.firstArg).to.deep.equal([]);
  });

  it('should delete a non-recurring event directly without opening the scope dialog', async () => {
    let deleteEventSpy, deleteRecurringEventSpy;
    const { user } = render(
      <EventCalendarProvider
        events={[DEFAULT_EVENT]}
        resources={resources}
        storeClass={PremiumTestStore}
      >
        <StoreSpy
          Context={SchedulerStoreContext}
          method="deleteEvent"
          onSpyReady={(sp) => {
            deleteEventSpy = sp;
          }}
        />
        <StoreSpy
          Context={SchedulerStoreContext}
          method="deleteRecurringEvent"
          onSpyReady={(sp) => {
            deleteRecurringEventSpy = sp;
          }}
        />
        <TestEventDialogContent open {...defaultProps} />
        <RecurringScopeDialog />
      </EventCalendarProvider>,
    );

    await user.click(screen.getByRole('button', { name: /delete event/i }));

    expect(deleteEventSpy?.calledOnce).to.equal(true);
    expect(deleteRecurringEventSpy?.called).to.equal(false);
    expect(screen.queryByText(/Apply this change to:/i)).to.equal(null);
  });

  describe('read-only events', () => {
    it('should render ReadonlyContent', () => {
      const readOnlyEvent = { ...DEFAULT_EVENT, readOnly: true };

      const readOnlyOccurrence = EventBuilder.new(adapter)
        .id(readOnlyEvent.id)
        .title(readOnlyEvent.title)
        .description(readOnlyEvent.description)
        .span(readOnlyEvent.start, readOnlyEvent.end)
        .readOnly(true)
        .toOccurrence();

      render(
        <EventCalendarProvider
          events={[readOnlyEvent]}
          resources={resources}
          storeClass={PremiumTestStore}
        >
          <TestEventDialogContent open {...defaultProps} occurrence={readOnlyOccurrence} />
        </EventCalendarProvider>,
      );

      const dialogs = screen.getAllByRole('dialog');
      const dialog = within(dialogs[dialogs.length - 1]);

      // Should display title as text, not in an input
      expect(dialog.getByText(DEFAULT_EVENT.title)).not.to.equal(null);
      expect(dialog.queryByLabelText(/event title/i)).to.equal(null);

      // Should display description as text, not in an input
      expect(dialog.getByText(DEFAULT_EVENT.description ?? '')).not.to.equal(null);
      expect(dialog.queryByLabelText(/description/i)).to.equal(null);

      // Should not have date/time inputs
      expect(dialog.queryByLabelText(/start date/i)).to.equal(null);
      expect(dialog.queryByLabelText(/end date/i)).to.equal(null);
      expect(dialog.queryByLabelText(/start time/i)).to.equal(null);
      expect(dialog.queryByLabelText(/end time/i)).to.equal(null);

      // Should not have all-day checkbox
      expect(dialog.queryByRole('switch', { name: /all day/i })).to.equal(null);

      // Should not have resource/recurrence comboboxes
      expect(dialog.queryByRole('combobox', { name: /resource/i })).to.equal(null);
      expect(dialog.queryByRole('combobox', { name: /recurrence/i })).to.equal(null);
    });

    it('should display recurrence label for recurring events', () => {
      const recurringEventBuilder = EventBuilder.new(adapter)
        .title('Daily Standup')
        .singleDay('2025-05-26T09:00:00Z', 30)
        .recurrent('DAILY')
        .readOnly(true);

      const recurringOccurrence = recurringEventBuilder.toOccurrence();

      render(
        <EventCalendarProvider
          events={[recurringEventBuilder.build()]}
          resources={resources}
          storeClass={PremiumTestStore}
        >
          <TestEventDialogContent open {...defaultProps} occurrence={recurringOccurrence} />
        </EventCalendarProvider>,
      );

      const dialogs = screen.getAllByRole('dialog');
      const dialog = within(dialogs[dialogs.length - 1]);

      expect(dialog.getByText(/repeats daily/i)).not.to.equal(null);
    });

    it('should not display recurrence label for non-recurring events', () => {
      const readOnlyEvent = { ...DEFAULT_EVENT, readOnly: true };

      const readOnlyOccurrence = EventBuilder.new(adapter)
        .id(readOnlyEvent.id)
        .title(readOnlyEvent.title)
        .description(readOnlyEvent.description)
        .span(readOnlyEvent.start, readOnlyEvent.end)
        .readOnly(true)
        .toOccurrence();

      render(
        <EventCalendarProvider
          events={[readOnlyEvent]}
          resources={resources}
          storeClass={PremiumTestStore}
        >
          <TestEventDialogContent open {...defaultProps} occurrence={readOnlyOccurrence} />
        </EventCalendarProvider>,
      );

      const dialogs = screen.getAllByRole('dialog');
      const dialog = within(dialogs[dialogs.length - 1]);

      expect(dialog.queryByText(/repeats daily/i)).to.equal(null);
      expect(dialog.queryByText(/repeats weekly/i)).to.equal(null);
      expect(dialog.queryByText(/repeats monthly/i)).to.equal(null);
      expect(dialog.queryByText(/repeats annually/i)).to.equal(null);
      expect(dialog.queryByText(/custom repeat/i)).to.equal(null);
      expect(dialog.queryByText(/don.?t repeat/i)).to.equal(null);
    });

    it('should render ReadonlyContent if EventCalendar is read-only', () => {
      const readOnlyOccurrence = EventBuilder.new(adapter)
        .id(DEFAULT_EVENT.id)
        .title(DEFAULT_EVENT.title)
        .description(DEFAULT_EVENT.description)
        .span(DEFAULT_EVENT.start, DEFAULT_EVENT.end)
        .readOnly(true)
        .toOccurrence();

      render(
        <EventCalendarProvider
          events={[DEFAULT_EVENT]}
          resources={resources}
          readOnly
          storeClass={PremiumTestStore}
        >
          <TestEventDialogContent open {...defaultProps} occurrence={readOnlyOccurrence} />
        </EventCalendarProvider>,
      );

      const dialogs = screen.getAllByRole('dialog');
      const dialog = within(dialogs[dialogs.length - 1]);

      // Should display title as text, not in an input
      expect(dialog.getByText(DEFAULT_EVENT.title)).not.to.equal(null);
      expect(dialog.queryByLabelText(/event title/i)).to.equal(null);

      // Should display description as text, not in an input
      expect(dialog.getByText(DEFAULT_EVENT.description ?? '')).not.to.equal(null);
      expect(dialog.queryByLabelText(/description/i)).to.equal(null);

      // Should not have date/time inputs
      expect(dialog.queryByLabelText(/start date/i)).to.equal(null);
      expect(dialog.queryByLabelText(/end date/i)).to.equal(null);
      expect(dialog.queryByLabelText(/start time/i)).to.equal(null);
      expect(dialog.queryByLabelText(/end time/i)).to.equal(null);

      // Should not have all-day checkbox
      expect(dialog.queryByRole('switch', { name: /all day/i })).to.equal(null);

      // Should not have resource/recurrence comboboxes
      expect(dialog.queryByRole('combobox', { name: /resource/i })).to.equal(null);
      expect(dialog.queryByRole('combobox', { name: /recurrence/i })).to.equal(null);
    });
  });

  it('should handle a resource without an eventColor (fallback to default)', async () => {
    const onEventsChange = spy();

    const noColorResource = ResourceBuilder.new().title('NoColor').build();
    const resourcesNoColor: SchedulerResource[] = [workResource, personalResource, noColorResource];

    const eventWithNoResourceColor: SchedulerEvent = {
      ...DEFAULT_EVENT,
      resource: noColorResource.id,
    };

    const eventWithNoResourceColorOccurrence = EventBuilder.new(adapter)
      .id(eventWithNoResourceColor.id)
      .title(eventWithNoResourceColor.title)
      .description(eventWithNoResourceColor.description)
      .span(eventWithNoResourceColor.start, eventWithNoResourceColor.end)
      .resource(noColorResource)
      .toOccurrence();

    render(
      <EventCalendarProvider
        events={[eventWithNoResourceColor]}
        onEventsChange={onEventsChange}
        resources={resourcesNoColor}
        storeClass={PremiumTestStore}
      >
        <TestEventDialogContent
          open
          {...defaultProps}
          occurrence={eventWithNoResourceColorOccurrence}
        />
      </EventCalendarProvider>,
    );

    const dialogs = screen.getAllByRole('dialog');
    const currentDialog = dialogs[dialogs.length - 1];

    expect(within(currentDialog).getByRole('combobox', { name: /resource/i }).textContent).to.match(
      /NoColor/i,
    );
    expect(
      currentDialog.querySelector(`.${eventCalendarClasses.eventDialogResourceMenuColorDot}`),
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
        storeClass={PremiumTestStore}
      >
        <TestEventDialogContent
          open
          {...defaultProps}
          occurrence={eventWithoutResourceOccurrence}
        />
      </EventCalendarProvider>,
    );

    const dialogs = screen.getAllByRole('dialog');
    const currentDialog = dialogs[dialogs.length - 1];

    expect(within(currentDialog).getByRole('combobox', { name: /resource/i }).textContent).to.match(
      /no resource/i,
    );

    expect(
      currentDialog.querySelector(`.${eventCalendarClasses.eventDialogResourceMenuColorDot}`),
    ).to.have.attribute('data-palette', 'teal');

    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(onEventsChange.calledOnce).to.equal(true);
    const updated = onEventsChange.firstCall.firstArg[0];
    expect(updated.resource).to.equal(undefined);
  });

  describe('shouldEventRequireResource', () => {
    const eventWithoutResource: SchedulerEvent = { ...DEFAULT_EVENT, resource: undefined };
    const eventWithoutResourceOccurrence = EventBuilder.new(adapter)
      .id(eventWithoutResource.id)
      .title(eventWithoutResource.title)
      .description(eventWithoutResource.description)
      .span(eventWithoutResource.start, eventWithoutResource.end)
      .toOccurrence();

    it('should not show the "No resource" option in the dropdown when `shouldEventRequireResource={true}`', async () => {
      const { user } = render(
        <EventCalendarProvider
          events={[DEFAULT_EVENT]}
          resources={resources}
          shouldEventRequireResource
          storeClass={PremiumTestStore}
        >
          <TestEventDialogContent open {...defaultProps} />
        </EventCalendarProvider>,
      );

      await user.click(screen.getByRole('combobox', { name: /resource/i }));

      expect(screen.queryByRole('option', { name: /no resource/i })).to.equal(null);
      expect(screen.getByRole('option', { name: /work/i })).not.to.equal(null);
      expect(screen.getByRole('option', { name: /personal/i })).not.to.equal(null);
    });

    it('should show the "No resource" option when `shouldEventRequireResource={false}`', async () => {
      const { user } = render(
        <EventCalendarProvider
          events={[DEFAULT_EVENT]}
          resources={resources}
          shouldEventRequireResource={false}
          storeClass={PremiumTestStore}
        >
          <TestEventDialogContent open {...defaultProps} />
        </EventCalendarProvider>,
      );

      await user.click(screen.getByRole('combobox', { name: /resource/i }));

      expect(screen.getByRole('option', { name: /no resource/i })).not.to.equal(null);
    });

    it('should block submit and not call `onEventsChange` when `shouldEventRequireResource={true}` and the event has no resource', async () => {
      const onEventsChange = spy();

      const { user } = render(
        <EventCalendarProvider
          events={[eventWithoutResource]}
          onEventsChange={onEventsChange}
          resources={resources}
          shouldEventRequireResource
          storeClass={PremiumTestStore}
        >
          <TestEventDialogContent
            open
            {...defaultProps}
            occurrence={eventWithoutResourceOccurrence}
          />
        </EventCalendarProvider>,
      );

      expect(screen.queryByText(/a resource is required/i)).to.equal(null);
      // An unassigned resource is not the same as an invalid one: the Select reflects
      // the current state ("No resource") and the error label flags the validation.
      expect(screen.queryByText(/invalid resource/i)).to.equal(null);
      expect(screen.getByRole('combobox', { name: /resource/i }).textContent).to.match(
        /no resource/i,
      );

      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(onEventsChange.called).to.equal(false);
      expect(screen.getByText(/a resource is required/i)).not.to.equal(null);
    });

    it('should unblock submit and clear the error after a resource is selected', async () => {
      const onEventsChange = spy();

      const { user } = render(
        <EventCalendarProvider
          events={[eventWithoutResource]}
          onEventsChange={onEventsChange}
          resources={resources}
          shouldEventRequireResource
          storeClass={PremiumTestStore}
        >
          <TestEventDialogContent
            open
            {...defaultProps}
            occurrence={eventWithoutResourceOccurrence}
          />
        </EventCalendarProvider>,
      );

      await user.click(screen.getByRole('button', { name: /save/i }));
      expect(onEventsChange.called).to.equal(false);
      expect(screen.getByText(/a resource is required/i)).not.to.equal(null);

      await user.click(screen.getByRole('combobox', { name: /resource/i }));
      await user.click(await screen.findByRole('option', { name: /work/i }));

      // The error should clear as soon as a valid resource is picked, not only after the next save.
      expect(screen.queryByText(/a resource is required/i)).to.equal(null);

      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(onEventsChange.calledOnce).to.equal(true);
      expect(onEventsChange.firstCall.firstArg[0].resource).to.equal(workResource.id);
    });

    it('should block submit on a Calendar creation placeholder when `shouldEventRequireResource={true}` and no resource is selected', async () => {
      const onEventsChange = spy();
      const start = adapter.date('2025-05-26T07:30:00Z', 'default');
      const end = adapter.date('2025-05-26T08:30:00Z', 'default');

      const creationOccurrence = EventBuilder.new(adapter)
        .id('tmp')
        .span(start.toISOString(), end.toISOString())
        .toOccurrence();

      const { user } = render(
        <EventCalendarProvider
          events={[]}
          onEventsChange={onEventsChange}
          resources={resources}
          shouldEventRequireResource
          storeClass={PremiumTestStore}
        >
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
          <TestEventDialogContent open {...defaultProps} occurrence={creationOccurrence} />
        </EventCalendarProvider>,
      );

      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(onEventsChange.called).to.equal(false);
      expect(screen.getByText(/a resource is required/i)).not.to.equal(null);
    });
  });

  describe('Event creation', () => {
    it('should change surface of the placeholder to day-grid when all-day is changed to true', async () => {
      const start = adapter.date('2025-05-26T07:30:00Z', 'default');
      const end = adapter.date('2025-05-26T08:30:00Z', 'default');
      const handleSurfaceChange = spy();

      const creationOccurrence = EventBuilder.new(adapter)
        .id('tmp')
        .span(start.toISOString(), end.toISOString())
        .toOccurrence();

      const { user } = render(
        <EventCalendarProvider events={[]} resources={resources} storeClass={PremiumTestStore}>
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

          <TestEventDialogContent open {...defaultProps} occurrence={creationOccurrence} />

          <StateWatcher
            Context={SchedulerStoreContext}
            selector={(s) => s.occurrencePlaceholder?.surfaceType}
            onValueChange={handleSurfaceChange}
          />
        </EventCalendarProvider>,
      );

      expect(handleSurfaceChange.lastCall?.firstArg).to.equal('time-grid');

      await user.click(screen.getByRole('switch', { name: /all day/i }));

      expect(handleSurfaceChange.lastCall?.firstArg).to.equal('day-grid');
    });

    it('should change surface of the placeholder to time-grid when all-day is changed to false', async () => {
      const start = adapter.date('2025-05-26T07:30:00Z', 'default');
      const end = adapter.date('2025-05-26T08:30:00Z', 'default');
      const handleSurfaceChange = spy();

      const creationOccurrence = EventBuilder.new(adapter)
        .id('tmp')
        .span(start.toISOString(), end.toISOString())
        .allDay(true)
        .toOccurrence();

      const { user } = render(
        <EventCalendarProvider events={[]} resources={resources} storeClass={PremiumTestStore}>
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

          <TestEventDialogContent open {...defaultProps} occurrence={creationOccurrence} />

          <StateWatcher
            Context={SchedulerStoreContext}
            selector={(s) => s.occurrencePlaceholder?.surfaceType}
            onValueChange={handleSurfaceChange}
          />
        </EventCalendarProvider>,
      );

      expect(handleSurfaceChange.lastCall?.firstArg).to.equal('day-grid');

      await user.click(screen.getByRole('switch', { name: /all day/i }));

      expect(handleSurfaceChange.lastCall?.firstArg).to.equal('time-grid');
    });

    it('should not change surfaceType when all day changed to true and lockSurfaceType=true', async () => {
      const start = adapter.date('2025-05-26T07:30:00Z', 'default');
      const end = adapter.date('2025-05-26T08:30:00Z', 'default');
      const handleSurfaceChange = spy();

      const creationOccurrence = EventBuilder.new(adapter)
        .id('tmp')
        .span(start.toISOString(), end.toISOString())
        .toOccurrence();

      const { user } = render(
        <EventCalendarProvider events={[]} resources={resources} storeClass={PremiumTestStore}>
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

          <TestEventDialogContent open {...defaultProps} occurrence={creationOccurrence as any} />

          <StateWatcher
            Context={SchedulerStoreContext}
            selector={(s) => s.occurrencePlaceholder?.surfaceType}
            onValueChange={handleSurfaceChange}
          />
        </EventCalendarProvider>,
      );
      expect(handleSurfaceChange.lastCall?.firstArg).to.equal('time-grid');

      await user.click(screen.getByRole('switch', { name: /all day/i }));

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
        .span(start.toISOString(), end.toISOString())
        .title('')
        .description('')
        .toOccurrence();

      const onEventsChange = spy();
      let createEventSpy;

      const { user } = render(
        <EventCalendarProvider
          events={[]}
          resources={resources}
          onEventsChange={onEventsChange}
          storeClass={PremiumTestStore}
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

          <TestEventDialogContent open {...defaultProps} occurrence={creationOccurrence} />
        </EventCalendarProvider>,
      );

      await user.type(screen.getByLabelText(/event title/i), ' New title ');
      await user.type(screen.getByLabelText(/description/i), ' Some details ');
      await user.click(screen.getByRole('combobox', { name: /resource/i }));
      await user.click(await screen.findByRole('option', { name: /work/i }));
      await user.click(screen.getByRole('tab', { name: /recurrence/i }));
      await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
      await user.click(await screen.findByRole('option', { name: /daily/i }));
      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(createEventSpy?.calledOnce).to.equal(true);
      const payload = createEventSpy.lastCall.firstArg;

      expect(payload.title).to.equal('New title');
      expect(payload.description).to.equal('Some details');
      expect(payload.allDay).to.equal(false);
      expect(payload.resource).to.equal(workResource.id);
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
        .span(start.toISOString(), end.toISOString())
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
          storeClass={PremiumTestStore}
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
          <TestEventDialogContent open {...defaultProps} occurrence={creationOccurrence} />
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

      await user.click(screen.getByRole('button', { name: /save/i }));

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
        .resource(personalResource)
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
        let updateRecurringEventSpy, selectRecurringEventScopeSpy;
        const containerRef = React.createRef<HTMLDivElement>();

        const { user } = render(
          <React.Fragment>
            <div ref={containerRef} />
            <EventCalendarProvider
              events={[originalRecurringEvent]}
              resources={resources}
              storeClass={PremiumTestStore}
            >
              <StoreSpy
                Context={SchedulerStoreContext}
                method="updateRecurringEvent"
                onSpyReady={(sp) => {
                  updateRecurringEventSpy = sp;
                }}
              />
              <StoreSpy
                Context={SchedulerStoreContext}
                method="selectRecurringEventScope"
                onSpyReady={(sp) => {
                  selectRecurringEventScopeSpy = sp;
                }}
              />

              <TestEventDialogContent
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
        await user.click(screen.getByRole('button', { name: /save/i }));

        await screen.findByText(/Apply this change to:/i);
        await user.click(screen.getByText(/All events/i));
        await user.click(screen.getByRole('button', { name: /Cancel/i }));

        expect(updateRecurringEventSpy?.calledOnce).to.equal(true);
        expect(selectRecurringEventScopeSpy?.called).to.equal(true);
        expect(selectRecurringEventScopeSpy?.lastCall.firstArg).to.equal(null);
        expect(updateRecurringEventSpy?.callCount).to.equal(1);
      });

      it("should call updateRecurringEvent with scope 'all' and not include rrule if not modified on Submit", async () => {
        let updateRecurringEventSpy, selectRecurringEventScopeSpy;
        const containerRef = React.createRef<HTMLDivElement>();

        const { user } = render(
          <React.Fragment>
            <div ref={containerRef} />
            <EventCalendarProvider
              events={[originalRecurringEvent]}
              resources={resources}
              storeClass={PremiumTestStore}
            >
              <StoreSpy
                Context={SchedulerStoreContext}
                method="updateRecurringEvent"
                onSpyReady={(sp) => {
                  updateRecurringEventSpy = sp;
                }}
              />
              <StoreSpy
                Context={SchedulerStoreContext}
                method="selectRecurringEventScope"
                onSpyReady={(sp) => {
                  selectRecurringEventScopeSpy = sp;
                }}
              />

              <TestEventDialogContent
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
        await user.click(screen.getByRole('button', { name: /save/i }));

        await screen.findByText(/Apply this change to:/i);
        await user.click(screen.getByText(/All events/i));
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

        expect(selectRecurringEventScopeSpy?.calledOnce).to.equal(true);
        expect(selectRecurringEventScopeSpy?.lastCall.firstArg).to.equal('all');
      });

      it("should call updateRecurringEvent with scope 'only-this' and include rrule if modified on Submit", async () => {
        let updateRecurringEventSpy, selectRecurringEventScopeSpy;
        const containerRef = React.createRef<HTMLDivElement>();

        const { user } = render(
          <React.Fragment>
            <div ref={containerRef} />
            <EventCalendarProvider
              events={[originalRecurringEvent]}
              resources={resources}
              storeClass={PremiumTestStore}
            >
              <StoreSpy
                Context={SchedulerStoreContext}
                method="updateRecurringEvent"
                onSpyReady={(sp) => {
                  updateRecurringEventSpy = sp;
                }}
              />
              <StoreSpy
                Context={SchedulerStoreContext}
                method="selectRecurringEventScope"
                onSpyReady={(sp) => {
                  selectRecurringEventScopeSpy = sp;
                }}
              />

              <TestEventDialogContent
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
        await user.click(screen.getByRole('button', { name: /save/i }));

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
        expect(selectRecurringEventScopeSpy?.calledOnce).to.equal(true);
        expect(selectRecurringEventScopeSpy?.lastCall.firstArg).to.equal('only-this');
      });

      it('should call updateRecurringEvent with scope "this-and-following" and send rrule as undefined when "no repeat" is selected on Submit', async () => {
        let updateRecurringEventSpy, selectRecurringEventScopeSpy;
        const containerRef = React.createRef<HTMLDivElement>();

        const { user } = render(
          <React.Fragment>
            <div ref={containerRef} />
            <EventCalendarProvider
              events={[originalRecurringEvent]}
              resources={resources}
              storeClass={PremiumTestStore}
            >
              <StoreSpy
                Context={SchedulerStoreContext}
                method="updateRecurringEvent"
                onSpyReady={(sp) => {
                  updateRecurringEventSpy = sp;
                }}
              />
              <StoreSpy
                Context={SchedulerStoreContext}
                method="selectRecurringEventScope"
                onSpyReady={(sp) => {
                  selectRecurringEventScopeSpy = sp;
                }}
              />

              <TestEventDialogContent
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
        await user.click(screen.getByRole('button', { name: /save/i }));

        await screen.findByText(/Apply this change to:/i);
        await user.click(screen.getByText(/This and following events/i));
        await user.click(screen.getByRole('button', { name: /Confirm/i }));

        expect(updateRecurringEventSpy?.calledOnce).to.equal(true);
        const openPayload = updateRecurringEventSpy.lastCall.firstArg;

        expect(openPayload.changes.id).to.equal(originalRecurringEvent.id);
        expect(openPayload.changes.rrule).to.equal(undefined);

        expect(selectRecurringEventScopeSpy?.calledOnce).to.equal(true);
        expect(selectRecurringEventScopeSpy?.lastCall.firstArg).to.equal('this-and-following');
      });

      describe('Deletion', () => {
        it('should open the scope dialog instead of deleting the whole series', async () => {
          let deleteRecurringEventSpy, deleteEventSpy;

          const { user } = render(
            <EventCalendarProvider
              events={[originalRecurringEvent]}
              resources={resources}
              storeClass={PremiumTestStore}
            >
              <StoreSpy
                Context={SchedulerStoreContext}
                method="deleteRecurringEvent"
                onSpyReady={(sp) => {
                  deleteRecurringEventSpy = sp;
                }}
              />
              <StoreSpy
                Context={SchedulerStoreContext}
                method="deleteEvent"
                onSpyReady={(sp) => {
                  deleteEventSpy = sp;
                }}
              />

              <TestEventDialogContent
                open
                {...defaultProps}
                occurrence={originalRecurringEventOccurrence}
              />

              <RecurringScopeDialog />
            </EventCalendarProvider>,
          );

          await user.click(screen.getByRole('button', { name: /delete event/i }));

          await screen.findByText(/Apply this change to:/i);
          expect(deleteRecurringEventSpy?.calledOnce).to.equal(true);
          expect(deleteRecurringEventSpy?.lastCall.firstArg.eventId).to.equal(
            originalRecurringEvent.id,
          );
          expect(deleteEventSpy?.called).to.equal(false);
        });

        it('should not delete anything if the user cancels the scope dialog', async () => {
          const onEventsChange = spy();
          let selectRecurringEventScopeSpy;

          const { user } = render(
            <EventCalendarProvider
              events={[originalRecurringEvent]}
              onEventsChange={onEventsChange}
              resources={resources}
              storeClass={PremiumTestStore}
            >
              <StoreSpy
                Context={SchedulerStoreContext}
                method="selectRecurringEventScope"
                onSpyReady={(sp) => {
                  selectRecurringEventScopeSpy = sp;
                }}
              />

              <TestEventDialogContent
                open
                {...defaultProps}
                occurrence={originalRecurringEventOccurrence}
              />

              <RecurringScopeDialog />
            </EventCalendarProvider>,
          );

          await user.click(screen.getByRole('button', { name: /delete event/i }));
          await screen.findByText(/Apply this change to:/i);
          await user.click(screen.getByText(/All events/i));
          await user.click(screen.getByRole('button', { name: /Cancel/i }));

          expect(selectRecurringEventScopeSpy?.lastCall.firstArg).to.equal(null);
          expect(onEventsChange.called).to.equal(false);
        });

        it("should delete the whole series with scope 'all' on Confirm", async () => {
          const onEventsChange = spy();

          const { user } = render(
            <EventCalendarProvider
              events={[originalRecurringEvent]}
              onEventsChange={onEventsChange}
              resources={resources}
              storeClass={PremiumTestStore}
            >
              <TestEventDialogContent
                open
                {...defaultProps}
                occurrence={originalRecurringEventOccurrence}
              />

              <RecurringScopeDialog />
            </EventCalendarProvider>,
          );

          await user.click(screen.getByRole('button', { name: /delete event/i }));
          await screen.findByText(/Apply this change to:/i);
          await user.click(screen.getByText(/All events/i));
          await user.click(screen.getByRole('button', { name: /Confirm/i }));

          expect(onEventsChange.calledOnce).to.equal(true);
          expect(onEventsChange.lastCall.firstArg).to.deep.equal([]);
        });

        it("should delete only the selected occurrence with scope 'only-this' on Confirm", async () => {
          const onEventsChange = spy();

          const { user } = render(
            <EventCalendarProvider
              events={[originalRecurringEvent]}
              onEventsChange={onEventsChange}
              resources={resources}
              storeClass={PremiumTestStore}
            >
              <TestEventDialogContent
                open
                {...defaultProps}
                occurrence={originalRecurringEventOccurrence}
              />

              <RecurringScopeDialog />
            </EventCalendarProvider>,
          );

          await user.click(screen.getByRole('button', { name: /delete event/i }));
          await screen.findByText(/Apply this change to:/i);
          await user.click(screen.getByText(/Only this event/i));
          await user.click(screen.getByRole('button', { name: /Confirm/i }));

          expect(onEventsChange.calledOnce).to.equal(true);
          const updatedEvents = onEventsChange.lastCall.firstArg;
          expect(updatedEvents).to.have.length(1);
          expect(updatedEvents[0].exDates).to.have.length(1);
        });

        it("should truncate the series with scope 'this-and-following' on Confirm", async () => {
          const onEventsChange = spy();
          const laterOccurrence = EventBuilder.new(adapter)
            .id(originalRecurringEvent.id)
            .title(originalRecurringEvent.title)
            .description(originalRecurringEvent.description)
            .span(originalRecurringEvent.start, originalRecurringEvent.end)
            .recurrent('DAILY')
            .toOccurrence('2025-06-13T10:00:00Z');

          const { user } = render(
            <EventCalendarProvider
              events={[originalRecurringEvent]}
              onEventsChange={onEventsChange}
              resources={resources}
              storeClass={PremiumTestStore}
            >
              <TestEventDialogContent open {...defaultProps} occurrence={laterOccurrence} />

              <RecurringScopeDialog />
            </EventCalendarProvider>,
          );

          await user.click(screen.getByRole('button', { name: /delete event/i }));
          await screen.findByText(/Apply this change to:/i);
          await user.click(screen.getByText(/This and following events/i));
          await user.click(screen.getByRole('button', { name: /Confirm/i }));

          expect(onEventsChange.calledOnce).to.equal(true);
          const updatedEvents = onEventsChange.lastCall.firstArg;
          expect(updatedEvents).to.have.length(1);
          expect(updatedEvents[0].rrule.until).not.to.equal(undefined);
        });
      });

      describe('Recurrence Custom behavior', () => {
        it('should render recurrence fields as disabled when not recurrent', async () => {
          const { user } = render(
            <EventCalendarProvider
              events={[DEFAULT_EVENT]}
              resources={resources}
              storeClass={PremiumTestStore}
            >
              <TestEventDialogContent open {...defaultProps} />
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

        it('should enable recurrence fields when a preset is selected', async () => {
          const { user } = render(
            <EventCalendarProvider
              events={[DEFAULT_EVENT]}
              resources={resources}
              storeClass={PremiumTestStore}
            >
              <TestEventDialogContent open {...defaultProps} />
            </EventCalendarProvider>,
          );

          await user.click(screen.getByRole('tab', { name: /recurrence/i }));
          await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
          await user.click(await screen.findByRole('option', { name: /repeats daily/i }));

          // Selecting a preset enables the fields (only null/no-repeat disables them)
          const repeatFieldset = screen.getByRole('group', { name: /repeat/i });
          const intervalInput = within(repeatFieldset).getByRole('spinbutton');
          expect(intervalInput).not.to.have.attribute('disabled');
          const freqCombobox = within(repeatFieldset).getByRole('combobox');
          expect(freqCombobox).not.to.have.attribute('aria-disabled');
        });

        it('should enable recurrence fields when selecting the custom repeat rule option', async () => {
          const { user } = render(
            <EventCalendarProvider
              events={[DEFAULT_EVENT]}
              resources={resources}
              storeClass={PremiumTestStore}
            >
              <TestEventDialogContent open {...defaultProps} />
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

        it('should give the "After" count input and "Until" date input accessible names', async () => {
          const { user } = render(
            <EventCalendarProvider
              events={[DEFAULT_EVENT]}
              resources={resources}
              storeClass={PremiumTestStore}
            >
              <TestEventDialogContent open {...defaultProps} />
            </EventCalendarProvider>,
          );

          await user.click(screen.getByRole('tab', { name: /recurrence/i }));
          await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
          await user.click(await screen.findByRole('option', { name: /custom repeat rule/i }));

          const endsFieldset = screen.getByRole('group', { name: /ends/i });
          const countInput = within(endsFieldset).getByRole('spinbutton', { name: /after/i });
          expect(countInput).to.not.equal(null);
          const describedById = countInput.getAttribute('aria-describedby');
          expect(describedById).to.not.equal(null);
          expect(endsFieldset.querySelector(`[id="${describedById}"]`)?.textContent).to.equal(
            'times',
          );

          const untilDate = endsFieldset.querySelector(
            'input[type="date"]',
          ) as HTMLInputElement | null;
          expect(untilDate).to.not.equal(null);
          const untilLabelledBy = untilDate!.getAttribute('aria-labelledby');
          expect(untilLabelledBy).to.not.equal(null);
          expect(endsFieldset.querySelector(`[id="${untilLabelledBy}"]`)?.textContent).to.equal(
            'Until',
          );
        });

        it('should submit custom recurrence with Ends: after', async () => {
          const onEventsChange = spy();

          const { user } = render(
            <EventCalendarProvider
              events={[DEFAULT_EVENT]}
              resources={resources}
              onEventsChange={onEventsChange}
              storeClass={PremiumTestStore}
            >
              <TestEventDialogContent open {...defaultProps} />
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

          await user.click(screen.getByRole('button', { name: /save/i }));

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
              storeClass={PremiumTestStore}
            >
              <TestEventDialogContent open {...defaultProps} />
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

          await user.click(screen.getByRole('button', { name: /save/i }));

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
              storeClass={PremiumTestStore}
            >
              <TestEventDialogContent open {...defaultProps} />
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

          await user.click(screen.getByRole('button', { name: /save/i }));

          expect(onEventsChange.calledOnce).to.equal(true);
          const updated = onEventsChange.firstCall.firstArg[0];

          expect(updated.rrule).to.deep.include({ freq: 'YEARLY', interval: 3 });
          expect(updated.rrule?.count ?? undefined).to.equal(undefined);
          expect(updated.rrule?.until).to.equal('2025-07-20T00:00:00.000Z');
        });

        it('should submit custom weekly with selected weekdays', async () => {
          const onEventsChange = spy();

          const { user } = render(
            <EventCalendarProvider
              events={[DEFAULT_EVENT]}
              resources={resources}
              onEventsChange={onEventsChange}
              storeClass={PremiumTestStore}
            >
              <TestEventDialogContent open {...defaultProps} />
            </EventCalendarProvider>,
          );

          await user.click(screen.getByRole('tab', { name: /recurrence/i }));
          await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
          await user.click(await screen.findByRole('option', { name: /custom/i }));

          const repeatGroup = screen.getByRole('group', { name: /repeat/i });
          const freqCombo = within(repeatGroup).getByRole('combobox');
          await user.click(freqCombo);
          await user.click(await screen.findByRole('option', { name: /weeks/i }));

          // Select Monday and Friday in the weekly day checkboxes
          await user.click(screen.getByRole('checkbox', { name: /monday/i }));
          await user.click(screen.getByRole('checkbox', { name: /friday/i }));

          await user.click(screen.getByRole('button', { name: /save/i }));

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
              storeClass={PremiumTestStore}
            >
              <TestEventDialogContent open {...defaultProps} />
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

          await user.click(screen.getByRole('button', { name: /save/i }));

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
              storeClass={PremiumTestStore}
            >
              <TestEventDialogContent open {...defaultProps} />
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

          await user.click(screen.getByRole('button', { name: /save/i }));

          expect(onEventsChange.calledOnce).to.equal(true);
          const updated = onEventsChange.firstCall.firstArg[0];

          expect(updated.rrule).to.deep.equal({
            freq: 'MONTHLY',
            interval: 1,
            byDay: ['-1MO'],
          });
        });

        it('should flip the recurrence Select to "Custom" when a detail field is edited', async () => {
          const { user } = render(
            <EventCalendarProvider
              events={[DEFAULT_EVENT]}
              resources={resources}
              storeClass={PremiumTestStore}
            >
              <TestEventDialogContent open {...defaultProps} />
            </EventCalendarProvider>,
          );

          await user.click(screen.getByRole('tab', { name: /recurrence/i }));
          await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
          await user.click(await screen.findByRole('option', { name: /repeats daily/i }));

          // Editing the interval should flip the Select from "Repeats daily" to "Custom repeat rule"
          const repeatGroup = screen.getByRole('group', { name: /repeat/i });
          const intervalInput = within(repeatGroup).getByRole('spinbutton');
          await user.click(intervalInput);
          await user.keyboard('{Control>}a{/Control}2');

          expect(screen.getByRole('combobox', { name: /recurrence/i }).textContent).to.match(
            /custom repeat rule/i,
          );
        });

        it('should pre-fill WEEKLY preset with the event weekday code', async () => {
          const onEventsChange = spy();

          // DEFAULT_EVENT falls on Monday 2025-05-26
          const { user } = render(
            <EventCalendarProvider
              events={[DEFAULT_EVENT]}
              resources={resources}
              onEventsChange={onEventsChange}
              storeClass={PremiumTestStore}
            >
              <TestEventDialogContent open {...defaultProps} />
            </EventCalendarProvider>,
          );

          await user.click(screen.getByRole('tab', { name: /recurrence/i }));
          await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
          await user.click(await screen.findByRole('option', { name: /repeats weekly/i }));
          await user.click(screen.getByRole('button', { name: /save/i }));

          expect(onEventsChange.calledOnce).to.equal(true);
          const updated = onEventsChange.firstCall.firstArg[0];

          // WEEKLY preset must pre-fill byDay with the event's weekday (Monday → 'MO')
          expect(updated.rrule).to.deep.equal({ freq: 'WEEKLY', interval: 1, byDay: ['MO'] });
        });

        it('should pre-fill MONTHLY preset with the event day-of-month', async () => {
          const onEventsChange = spy();

          // DEFAULT_EVENT is on the 26th → byMonthDay should be [26]
          const { user } = render(
            <EventCalendarProvider
              events={[DEFAULT_EVENT]}
              resources={resources}
              onEventsChange={onEventsChange}
              storeClass={PremiumTestStore}
            >
              <TestEventDialogContent open {...defaultProps} />
            </EventCalendarProvider>,
          );

          await user.click(screen.getByRole('tab', { name: /recurrence/i }));
          await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
          await user.click(await screen.findByRole('option', { name: /repeats monthly/i }));
          await user.click(screen.getByRole('button', { name: /save/i }));

          expect(onEventsChange.calledOnce).to.equal(true);
          const updated = onEventsChange.firstCall.firstArg[0];

          // MONTHLY preset must never produce an empty byMonthDay array
          expect(updated.rrule).to.deep.equal({
            freq: 'MONTHLY',
            interval: 1,
            byMonthDay: [26],
          });
        });

        it('should disable recurrence detail fields when the rrule property is read-only', async () => {
          // Supply a getter-only rrule in eventModelStructure so that isPropertyReadOnly('rrule')
          // returns true even though the event itself is not fully read-only.
          const rruleReadOnlyModelStructure = {
            rrule: { getter: (event: typeof DEFAULT_EVENT) => event.rrule },
          };

          const recurringEvent = EventBuilder.new()
            .id(DEFAULT_EVENT.id)
            .title(DEFAULT_EVENT.title)
            .singleDay('2025-05-26T07:30:00Z', 45)
            .resource(personalResource)
            .recurrent('DAILY')
            .build();

          const recurringOccurrence = EventBuilder.new(adapter)
            .id(recurringEvent.id)
            .title(recurringEvent.title)
            .span(recurringEvent.start, recurringEvent.end)
            .recurrent('DAILY')
            .toOccurrence();

          const { user } = render(
            <EventCalendarProvider
              events={[recurringEvent]}
              resources={resources}
              storeClass={PremiumTestStore}
              eventModelStructure={rruleReadOnlyModelStructure}
            >
              <TestEventDialogContent open {...defaultProps} occurrence={recurringOccurrence} />
            </EventCalendarProvider>,
          );

          await user.click(screen.getByRole('tab', { name: /recurrence/i }));

          // Even though a recurrence is active, the detail fields must be disabled because rrule is read-only
          const repeatFieldset = screen.getByRole('group', { name: /repeat/i });
          expect(within(repeatFieldset).getByRole('spinbutton')).to.have.attribute('disabled');
          expect(within(repeatFieldset).getByRole('combobox')).to.have.attribute(
            'aria-disabled',
            'true',
          );
        });

        it('should not allow unchecking the last selected weekday in WEEKLY mode', async () => {
          const onEventsChange = spy();

          const { user } = render(
            <EventCalendarProvider
              events={[DEFAULT_EVENT]}
              resources={resources}
              onEventsChange={onEventsChange}
              storeClass={PremiumTestStore}
            >
              <TestEventDialogContent open {...defaultProps} />
            </EventCalendarProvider>,
          );

          await user.click(screen.getByRole('tab', { name: /recurrence/i }));
          await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
          // WEEKLY preset pre-fills byDay with ['MO'] (DEFAULT_EVENT is on Monday 2025-05-26)
          await user.click(await screen.findByRole('option', { name: /repeats weekly/i }));

          const mondayCheckbox = screen.getByRole('checkbox', {
            name: /monday/i,
          }) as HTMLInputElement;
          expect(mondayCheckbox.checked).to.equal(true);

          // Attempting to uncheck the only selected day should be blocked
          await user.click(mondayCheckbox);
          expect(mondayCheckbox.checked).to.equal(true);

          await user.click(screen.getByRole('button', { name: /save/i }));

          expect(onEventsChange.calledOnce).to.equal(true);
          const updated = onEventsChange.firstCall.firstArg[0];
          expect(updated.rrule.byDay).to.deep.equal(['MO']);
        });

        it('should pre-fill byDay with the event weekday when switching frequency to WEEKLY', async () => {
          const onEventsChange = spy();

          const { user } = render(
            <EventCalendarProvider
              events={[DEFAULT_EVENT]}
              resources={resources}
              onEventsChange={onEventsChange}
              storeClass={PremiumTestStore}
            >
              <TestEventDialogContent open {...defaultProps} />
            </EventCalendarProvider>,
          );

          await user.click(screen.getByRole('tab', { name: /recurrence/i }));
          await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
          // Start with DAILY preset so byDay is cleared
          await user.click(await screen.findByRole('option', { name: /repeats daily/i }));

          // Switch to custom so the inner frequency select becomes editable
          await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
          await user.click(await screen.findByRole('option', { name: /custom repeat rule/i }));

          // Switch frequency to WEEKLY via the inner combobox
          const repeatGroup = screen.getByRole('group', { name: /repeat/i });
          const freqCombo = within(repeatGroup).getByRole('combobox');
          await user.click(freqCombo);
          await user.click(await screen.findByRole('option', { name: /weeks/i }));

          await user.click(screen.getByRole('button', { name: /save/i }));

          expect(onEventsChange.calledOnce).to.equal(true);
          const updated = onEventsChange.firstCall.firstArg[0];
          // byDay must be pre-filled with the event's weekday (Monday → 'MO'), not left empty
          expect(updated.rrule.byDay).to.deep.equal(['MO']);
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
          <EventCalendarProvider
            events={[nonRecurringEvent]}
            resources={resources}
            storeClass={PremiumTestStore}
          >
            <StoreSpy
              Context={SchedulerStoreContext}
              method="updateEvent"
              onSpyReady={(sp) => {
                updateEventSpy = sp;
              }}
            />

            <TestEventDialogContent
              open
              {...defaultProps}
              occurrence={nonRecurringEventOccurrence}
            />
          </EventCalendarProvider>,
        );
        await user.type(screen.getByLabelText(/event title/i), ' updated ');
        await user.clear(screen.getByLabelText(/description/i));
        await user.type(screen.getByLabelText(/description/i), '  new description  ');
        await user.click(screen.getByRole('combobox', { name: /resource/i }));
        await user.click(await screen.findByRole('option', { name: /work/i }));
        await user.click(screen.getByRole('button', { name: /save/i }));

        expect(updateEventSpy?.calledOnce).to.equal(true);
        const payload = updateEventSpy.lastCall.firstArg;

        expect(payload.id).to.equal(nonRecurringEvent.id);
        expect(payload.title).to.equal('Task updated');
        expect(payload.description).to.equal('new description');
        expect(payload.resource).to.equal(workResource.id);
        expect(payload.allDay).to.equal(false);
        expect(payload.start).toEqualDateTime(adapter.date('2025-06-12T14:00:00', 'default'));
        expect(payload.end).toEqualDateTime(adapter.date('2025-06-12T15:00:00', 'default'));
        expect(payload.rrule).to.equal(undefined);
      });

      it('should call updateEvent with updated values and send rrule if recurrence was selected on Submit', async () => {
        let updateEventSpy;

        const { user } = render(
          <EventCalendarProvider
            events={[nonRecurringEvent]}
            resources={resources}
            storeClass={PremiumTestStore}
          >
            <StoreSpy
              Context={SchedulerStoreContext}
              method="updateEvent"
              onSpyReady={(sp) => {
                updateEventSpy = sp;
              }}
            />

            <TestEventDialogContent
              open
              {...defaultProps}
              occurrence={nonRecurringEventOccurrence}
            />
          </EventCalendarProvider>,
        );
        await user.click(screen.getByRole('tab', { name: /recurrence/i }));
        await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
        await user.click(await screen.findByRole('option', { name: /repeats daily/i }));
        await user.click(screen.getByRole('button', { name: /save/i }));

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
        <EventCalendarProvider
          events={[DEFAULT_EVENT]}
          resources={resources}
          storeClass={PremiumTestStore}
        >
          <TestEventDialogContent open {...defaultProps} />
        </EventCalendarProvider>,
      );

      expect(document.querySelector('.MuiEventCalendar-eventDialog')).not.to.equal(null);
      expect(document.querySelector('.MuiEventCalendar-eventDialogCloseButton')).not.to.equal(null);
      expect(document.querySelector('.MuiEventCalendar-eventDialogHeader')).not.to.equal(null);
      expect(document.querySelector('.MuiEventCalendar-eventDialogContent')).not.to.equal(null);
      expect(document.querySelector('.MuiEventCalendar-eventDialogTabPanel')).not.to.equal(null);
      expect(document.querySelector('.MuiEventCalendar-eventDialogTabContent')).not.to.equal(null);
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
        <EventCalendarProvider
          events={[readOnlyEvent]}
          resources={resources}
          storeClass={PremiumTestStore}
        >
          <TestEventDialogContent open {...defaultProps} occurrence={readOnlyOccurrence} />
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

  describe('editingOccurrence state', () => {
    it('should leave editingOccurrence null when the content is rendered directly', () => {
      const handleEditingChange = spy();

      render(
        <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources}>
          <StateWatcher
            Context={SchedulerStoreContext}
            selector={(s) => s.editingOccurrence?.occurrence.id ?? null}
            onValueChange={handleEditingChange}
          />
          <TestEventDialogContent open {...defaultProps} />
        </EventCalendarProvider>,
      );

      // The EventDialogProvider's onOpen sets editingOccurrence.
      // Here we render EventDialogContent directly (without the trigger flow),
      // so we verify the initial state is null.
      expect(handleEditingChange.lastCall?.firstArg).to.equal(null);
    });

    it('should reflect the edited occurrence id while an event is being edited', async () => {
      const handleEditingChange = spy();

      render(
        <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources}>
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext}
            onMount={(store) =>
              store.startEditing({ id: DEFAULT_EVENT.id, key: DEFAULT_EVENT.id } as any)
            }
          />
          <StateWatcher
            Context={SchedulerStoreContext}
            selector={(s) => s.editingOccurrence?.occurrence.id ?? null}
            onValueChange={handleEditingChange}
          />
          <TestEventDialogContent open {...defaultProps} onClose={() => {}} />
        </EventCalendarProvider>,
      );

      // After SchedulerStoreRunner calls startEditing, it should be the event ID
      expect(handleEditingChange.lastCall?.firstArg).to.equal(DEFAULT_EVENT.id);
    });

    it('should expose startEditing on the store', () => {
      let startEditingSpy;

      render(
        <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources}>
          <StoreSpy
            Context={SchedulerStoreContext}
            method="startEditing"
            onSpyReady={(sp) => {
              startEditingSpy = sp;
            }}
          />
          <TestEventDialogContent open {...defaultProps} />
        </EventCalendarProvider>,
      );

      // Verify the method exists on the store (basic sanity check)
      expect(startEditingSpy).not.to.equal(undefined);
    });
  });
});
