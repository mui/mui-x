import * as React from 'react';
import { isJSDOM } from 'test/utils/skipIf';
import type { AnyEventCalendarStore } from 'test/utils/scheduler';
import {
  adapter,
  createSchedulerRenderer,
  EventBuilder,
  utcJuly4AllDayBuilder,
  ResourceBuilder,
  SchedulerStoreRunner,
  StateWatcher,
  StoreSpy,
} from 'test/utils/scheduler';
import { act, fireEvent, screen, waitFor, within } from '@mui/internal-test-utils';
import type {
  SchedulerResource,
  SchedulerEventOccurrence,
  SchedulerOccurrencePlaceholderCreation,
} from '@mui/x-scheduler-internals/models';
import { SchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { ExtendableEventCalendarStore } from '@mui/x-scheduler-internals/use-event-calendar';
import { schedulerRecurringEventsPlugin } from '@mui/x-scheduler-internals-premium/internals';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import { eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import {
  EventCalendarProvider,
  EventDialogContent,
  EventEditingOptionalRenderersContext,
  SchedulerSlotsProvider,
} from '@mui/x-scheduler/internals';
import {
  EventDialogGeneralTabContent,
  useEventDialogFormField,
} from '@mui/x-scheduler/event-dialog';
import { describe, it, expect, vi } from 'vitest';
import type { Mock, MockInstance } from 'vitest';
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

  it('should return to the General tab when the submit fails from the Recurrence tab', async () => {
    const onEventsChange = vi.fn();
    const noResourceEvent = EventBuilder.new()
      .title('Running')
      .singleDay('2025-05-26T07:30:00Z', 45)
      .build();
    const noResourceOccurrence = EventBuilder.new()
      .id(noResourceEvent.id)
      .title(noResourceEvent.title)
      .span(noResourceEvent.start, noResourceEvent.end)
      .toOccurrence();

    const { user } = render(
      <EventCalendarProvider
        events={[noResourceEvent]}
        onEventsChange={onEventsChange}
        resources={resources}
        shouldEventRequireResource
        storeClass={PremiumTestStore}
      >
        <TestEventDialogContent open {...defaultProps} occurrence={noResourceOccurrence} />
      </EventCalendarProvider>,
    );

    const generalPanel = screen.getByRole('tabpanel', { name: /general/i });
    await user.click(screen.getByRole('tab', { name: /recurrence/i }));
    expect(generalPanel).to.have.attribute('hidden');

    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(onEventsChange.mock.calls.length).to.equal(0);
    // The failing field lives in the General tab, so the dialog switches back to it.
    expect(generalPanel).not.to.have.attribute('hidden');
    expect(screen.getByText(/a resource is required/i)).not.to.equal(null);
  });

  it('should return to the General tab when only a custom validator fails', async () => {
    const onEventsChange = vi.fn();
    function FailingSection() {
      const client = useEventDialogFormField('client', {
        defaultValue: '',
        validate: () => 'Nope',
      });
      return client.error ? <p role="alert">{client.error}</p> : null;
    }

    const { user } = render(
      <EventCalendarProvider
        events={[DEFAULT_EVENT]}
        onEventsChange={onEventsChange}
        resources={resources}
        storeClass={PremiumTestStore}
      >
        <SchedulerSlotsProvider
          slots={{ eventDialogGeneralTab: FailingSection }}
          slotProps={undefined}
        >
          <TestEventDialogContent open {...defaultProps} />
        </SchedulerSlotsProvider>
      </EventCalendarProvider>,
    );

    const generalPanel = screen.getByRole('tabpanel', { name: /general/i });
    await user.click(screen.getByRole('tab', { name: /recurrence/i }));
    expect(generalPanel).to.have.attribute('hidden');

    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(onEventsChange.mock.calls.length).to.equal(0);
    expect(generalPanel).not.to.have.attribute('hidden');
    expect(screen.getByRole('alert')).to.have.text('Nope');
  });

  it('should return to the General tab when a validator throws', async () => {
    const onEventsChange = vi.fn();
    function ThrowingSection() {
      useEventDialogFormField('client', {
        defaultValue: '',
        validate: () => {
          throw new Error('validator exploded');
        },
      });
      return null;
    }

    const { user } = render(
      <EventCalendarProvider
        events={[DEFAULT_EVENT]}
        onEventsChange={onEventsChange}
        resources={resources}
        storeClass={PremiumTestStore}
      >
        <SchedulerSlotsProvider
          slots={{ eventDialogGeneralTab: ThrowingSection }}
          slotProps={undefined}
        >
          <TestEventDialogContent open {...defaultProps} />
        </SchedulerSlotsProvider>
      </EventCalendarProvider>,
    );

    const generalPanel = screen.getByRole('tabpanel', { name: /general/i });
    await user.click(screen.getByRole('tab', { name: /recurrence/i }));

    await expect(() => user.click(screen.getByRole('button', { name: /save/i }))).toWarnDev([
      'MUI X Scheduler: A form field validator threw or rejected during the submit.',
    ]);

    expect(onEventsChange.mock.calls.length).to.equal(0);
    expect(generalPanel).not.to.have.attribute('hidden');
  });

  it('should return to the General tab when the native validation blocks the submit', async () => {
    const onEventsChange = vi.fn();
    function EndDateClearer() {
      const endDate = useEventDialogFormField('endDate');
      return (
        <React.Fragment>
          <EventDialogGeneralTabContent />
          <button type="button" onClick={() => endDate.setValue('')}>
            Clear end date
          </button>
        </React.Fragment>
      );
    }

    const { user } = render(
      <EventCalendarProvider
        events={[DEFAULT_EVENT]}
        onEventsChange={onEventsChange}
        resources={resources}
        storeClass={PremiumTestStore}
      >
        <SchedulerSlotsProvider
          slots={{ eventDialogGeneralTab: EndDateClearer }}
          slotProps={undefined}
        >
          <TestEventDialogContent open {...defaultProps} />
        </SchedulerSlotsProvider>
      </EventCalendarProvider>,
    );

    const generalPanel = screen.getByRole('tabpanel', { name: /general/i });
    await user.click(screen.getByRole('button', { name: 'Clear end date' }));
    await user.click(screen.getByRole('tab', { name: /recurrence/i }));
    expect(generalPanel).to.have.attribute('hidden');

    await user.click(screen.getByRole('button', { name: /save/i }));

    // The browser refuses the submit over the hidden invalid control; the form
    // must at least bring the failing field back into view.
    expect(onEventsChange.mock.calls.length).to.equal(0);
    expect(generalPanel).not.to.have.attribute('hidden');
  });

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

  describe('retargeting the dialog to another occurrence', () => {
    const weeklyEventBuilder = EventBuilder.new(adapter)
      .title('Weekly sync')
      .singleDay('2025-05-26T09:00:00Z', 30)
      .recurrent('WEEKLY');

    const firstOccurrence = weeklyEventBuilder.toOccurrence();
    const secondOccurrence = weeklyEventBuilder.toOccurrence('2025-06-02T09:00:00Z');

    function Wrapper(props: { occurrence: SchedulerEventOccurrence }) {
      return (
        <EventCalendarProvider
          events={[weeklyEventBuilder.build()]}
          resources={resources}
          storeClass={PremiumTestStore}
        >
          <TestEventDialogContent open {...defaultProps} occurrence={props.occurrence} />
        </EventCalendarProvider>
      );
    }

    // In a real browser, the remount moves the focus to the new title input through a
    // natively dispatched focus event that lands outside `act()` and trips fail-on-console.
    it.skipIf(!isJSDOM)(
      'should re-seed the form when the dialog is retargeted to another occurrence of the same event',
      async () => {
        const { user, setProps } = render(<Wrapper occurrence={firstOccurrence} />);

        await user.type(screen.getByLabelText(/event title/i), ' edited');

        setProps({ occurrence: secondOccurrence });

        // Both occurrences share the event id, so the remount is keyed by the
        // occurrence key: the form is re-seeded and the previous draft discarded.
        expect(screen.getByLabelText(/event title/i)).to.have.value('Weekly sync');
        expect(screen.getByLabelText(/start date/i)).to.have.value('2025-06-02');
      },
    );

    it.skipIf(isJSDOM)(
      'should move focus to the title input of the remounted form when the dialog is retargeted',
      async () => {
        const { setProps } = render(<Wrapper occurrence={firstOccurrence} />);

        const firstInput = screen.getByLabelText(/event title/i);
        await waitFor(() => expect(document.activeElement).to.equal(firstInput));

        await act(async () => {
          setProps({ occurrence: secondOccurrence });
        });

        // The remount must not strand focus on the detached input: the new
        // title input takes it over so keyboard users keep their place.
        await waitFor(() => {
          const input = screen.getByLabelText(/event title/i);
          expect(input).to.have.value('Weekly sync');
          expect(document.activeElement).to.equal(input);
        });
      },
    );
  });

  it('should call "onEventsChange" with updated values on submit', async () => {
    const onEventsChange = vi.fn();
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

    expect(onEventsChange.mock.calls.length).to.equal(1);
    const updated = onEventsChange.mock.calls[0][0][0];

    const expectedUpdatedEvent = {
      id: DEFAULT_EVENT.id,
      title: 'Running test',
      description: DEFAULT_EVENT.description,
      start: adapter.startOfDay(adapter.date(DEFAULT_EVENT.start, 'default')).toISOString(),
      end: adapter.endOfDay(adapter.date(DEFAULT_EVENT.end, 'default')).toISOString(),
      allDay: true,
      rrule: { freq: 'DAILY', interval: 1 },
      // DEFAULT_EVENT's resource is a plain string (single-resource mode), so picking Work
      // replaces the selection and is written back as a plain id, not an array.
      resource: workResource.id,
      color: 'pink',
    };

    expect(updated).to.deep.equal(expectedUpdatedEvent);
  }, 10_000);

  it('should clear the color when clicking the active color toggle', async () => {
    const onEventsChange = vi.fn();
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

    expect(onEventsChange.mock.calls.length).to.equal(1);
    expect(onEventsChange.mock.calls[0][0][0].color).to.not.equal('pink');
  });

  describe('range validation', () => {
    function renderDialog() {
      const onEventsChange = vi.fn();
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

      return { user, onEventsChange };
    }

    it('should show error on the End date field if end date is before start date', async () => {
      const { user } = renderDialog();
      await user.clear(screen.getByLabelText(/start date/i));
      await user.type(screen.getByLabelText(/start date/i), '2025-05-27');
      await user.clear(screen.getByLabelText(/end date/i));
      await user.type(screen.getByLabelText(/end date/i), '2025-05-26');
      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(screen.getDescriptionOf(screen.getByLabelText(/end date/i)).textContent).to.match(
        /end date.*before.*start date/i,
      );
    });

    it('should not show error on the End date field if end date is equal to start date', async () => {
      const { user, onEventsChange } = renderDialog();
      await user.clear(screen.getByLabelText(/start date/i));
      await user.type(screen.getByLabelText(/start date/i), '2025-05-27');
      await user.clear(screen.getByLabelText(/end date/i));
      await user.type(screen.getByLabelText(/end date/i), '2025-05-27');
      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(screen.queryDescriptionOf(screen.getByLabelText(/end date/i))).to.equal(null);
      expect(onEventsChange.mock.calls.length).to.equal(1);
    });

    it('should show error on the End time field and block submit if end time is before start time on the same day', async () => {
      const { user, onEventsChange } = renderDialog();
      await user.clear(screen.getByLabelText(/start time/i));
      await user.type(screen.getByLabelText(/start time/i), '10:00');
      await user.clear(screen.getByLabelText(/end time/i));
      await user.type(screen.getByLabelText(/end time/i), '09:00');
      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(onEventsChange.mock.calls.length).to.equal(0);
      expect(screen.getDescriptionOf(screen.getByLabelText(/end time/i)).textContent).to.match(
        /end time.*after.*start time/i,
      );
    });

    it('should show error on the End time field and block submit if end time is equal to start time on the same day', async () => {
      const { user, onEventsChange } = renderDialog();
      await user.clear(screen.getByLabelText(/start time/i));
      await user.type(screen.getByLabelText(/start time/i), '10:00');
      await user.clear(screen.getByLabelText(/end time/i));
      await user.type(screen.getByLabelText(/end time/i), '10:00');
      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(onEventsChange.mock.calls.length).to.equal(0);
      expect(screen.getDescriptionOf(screen.getByLabelText(/end time/i)).textContent).to.match(
        /end time.*after.*start time/i,
      );
    });
  });

  it('should call "onEventsChange" with the updated values when delete button is clicked', async () => {
    const onEventsChange = vi.fn();
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
    expect(onEventsChange.mock.calls.length).to.equal(1);
    expect(onEventsChange.mock.calls[0][0]).to.deep.equal([]);
  });

  it('should delete a non-recurring event directly without opening the scope dialog', async () => {
    let deleteEventSpy, deleteRecurringEventSpy;
    const { user } = render(
      <EventCalendarProvider
        events={[DEFAULT_EVENT]}
        resources={resources}
        storeClass={PremiumTestStore}
        onEventsChange={() => {}}
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

    expect(deleteEventSpy?.mock.calls.length).to.equal(1);
    expect(deleteRecurringEventSpy?.mock.calls.length).to.equal(0);
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
    const onEventsChange = vi.fn();

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

  it('should not render the "no resource" dashed dot for an event referencing an unknown resource id', async () => {
    // A resource that isn't in the `resources` list passed to the provider — simulates an
    // event still pointing at a resource that has since been deleted.
    const deletedResource = ResourceBuilder.new().id('deleted-team').build();

    const eventWithUnknownResource: SchedulerEvent = {
      ...DEFAULT_EVENT,
      resource: deletedResource.id,
    };

    const eventWithUnknownResourceOccurrence = EventBuilder.new(adapter)
      .id(eventWithUnknownResource.id)
      .title(eventWithUnknownResource.title)
      .description(eventWithUnknownResource.description)
      .span(eventWithUnknownResource.start, eventWithUnknownResource.end)
      .resource(deletedResource)
      .toOccurrence();

    // MUI's Select itself warns in dev that `deleted-team` doesn't match any rendered option
    // (single-select mode has no item for an id outside `resources`) — pre-existing behavior,
    // orthogonal to the dashed-dot bug under test here. Stubbed rather than asserted via
    // `toWarnDev` because the exact number of times it fires isn't stable.
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      render(
        <EventCalendarProvider
          events={[eventWithUnknownResource]}
          resources={resources}
          storeClass={PremiumTestStore}
        >
          <TestEventDialogContent
            open
            {...defaultProps}
            occurrence={eventWithUnknownResourceOccurrence}
          />
        </EventCalendarProvider>,
      );
    } finally {
      consoleWarnSpy.mockRestore();
    }

    const dialogs = screen.getAllByRole('dialog');
    const currentDialog = dialogs[dialogs.length - 1];

    // The trigger shows "Invalid resource" (a selection exists, it just doesn't resolve)...
    expect(within(currentDialog).getByRole('combobox', { name: /resource/i }).textContent).to.match(
      /invalid resource/i,
    );
    // ...so the swatch must not fall back to the dashed "no resource" styling, which would
    // contradict that label by implying nothing is selected at all.
    expect(
      currentDialog.querySelector(`.${eventCalendarClasses.eventDialogResourceMenuColorDot}`),
    ).to.have.attribute('data-no-resource', 'false');
  });

  it('should fallback to "No resource" with default color when the event has no resource', async () => {
    const onEventsChange = vi.fn();

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

    expect(onEventsChange.mock.calls.length).to.equal(1);
    const updated = onEventsChange.mock.calls[0][0][0];
    // A never-assigned event defaults to an empty resource selection, not `undefined`.
    expect(updated.resource).to.deep.equal([]);
  });

  describe('shouldEventRequireResource', () => {
    const eventWithoutResource: SchedulerEvent = { ...DEFAULT_EVENT, resource: undefined };
    const eventWithoutResourceOccurrence = EventBuilder.new(adapter)
      .id(eventWithoutResource.id)
      .title(eventWithoutResource.title)
      .description(eventWithoutResource.description)
      .span(eventWithoutResource.start, eventWithoutResource.end)
      .toOccurrence();

    it('should hide the "No resource" option from the dropdown when `shouldEventRequireResource` is true', async () => {
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

      // DEFAULT_EVENT's resource is a plain string, so the picker is single-select here: the
      // "No resource" item still renders in the DOM (so the Select doesn't warn about an
      // out-of-range value), but is hidden via `display: none` — excluded from the
      // accessibility tree — while the requirement is on.
      expect(screen.queryByRole('option', { name: /no resource/i })).to.equal(null);
      expect(screen.getByRole('option', { name: /work/i })).not.to.equal(null);
      expect(screen.getByRole('option', { name: /personal/i })).not.to.equal(null);
    });

    it('should show "No resource" in the combobox after picking the "No resource" option (single-select mode)', async () => {
      let updateEventSpy: MockInstance | undefined;

      const { user } = render(
        <EventCalendarProvider
          events={[DEFAULT_EVENT]}
          resources={resources}
          shouldEventRequireResource={false}
          storeClass={PremiumTestStore}
          onEventsChange={() => {}}
        >
          <StoreSpy
            Context={SchedulerStoreContext}
            method="updateEvent"
            onSpyReady={(sp) => {
              updateEventSpy = sp;
            }}
          />
          <TestEventDialogContent open {...defaultProps} />
        </EventCalendarProvider>,
      );

      // DEFAULT_EVENT's resource is a plain string, so the picker is single-select here: there
      // is no toggle-off, clearing it means picking the dedicated "No resource" option.
      await user.click(screen.getByRole('combobox', { name: /resource/i }));
      await user.click(await screen.findByRole('option', { name: /no resource/i }));

      expect(screen.getByRole('combobox', { name: /resource/i }).textContent).to.match(
        /no resource/i,
      );

      await user.click(screen.getByRole('button', { name: /save/i }));

      // Single mode writes the plain id, or `undefined` once cleared — never `[]` or `null`,
      // which would silently widen the shape for an app that never opted into arrays.
      expect(updateEventSpy?.mock.calls.length).to.equal(1);
      expect(updateEventSpy?.mock.calls[0][0].resource).to.equal(undefined);
    });

    it('should block submit and not call `onEventsChange` when `shouldEventRequireResource={true}` and the event has no resource', async () => {
      const onEventsChange = vi.fn();

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

      expect(onEventsChange.mock.calls.length).to.equal(0);
      expect(screen.getByText(/a resource is required/i)).not.to.equal(null);
    });

    it('should unblock submit and clear the error after a resource is selected', async () => {
      const onEventsChange = vi.fn();

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
      expect(onEventsChange.mock.calls.length).to.equal(0);
      expect(screen.getByText(/a resource is required/i)).not.to.equal(null);

      await user.click(screen.getByRole('combobox', { name: /resource/i }));
      await user.click(await screen.findByRole('option', { name: /work/i }));
      await user.keyboard('{Escape}');

      // The error should clear as soon as a valid resource is picked, not only after the next save.
      expect(screen.queryByText(/a resource is required/i)).to.equal(null);

      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(onEventsChange.mock.calls.length).to.equal(1);
      expect(onEventsChange.mock.calls[0][0][0].resource).to.deep.equal([workResource.id]);
    });

    it('should show the range error and the resource error at the same time', async () => {
      const onEventsChange = vi.fn();

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

      await user.clear(screen.getByLabelText(/start date/i));
      await user.type(screen.getByLabelText(/start date/i), '2025-05-27');
      await user.clear(screen.getByLabelText(/end date/i));
      await user.type(screen.getByLabelText(/end date/i), '2025-05-26');
      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(onEventsChange.mock.calls.length).to.equal(0);
      expect(screen.getDescriptionOf(screen.getByLabelText(/end date/i)).textContent).to.match(
        /end date.*before.*start date/i,
      );
      expect(screen.getByText(/a resource is required/i)).not.to.equal(null);

      // Editing a date field only invalidates the range error, not the other sections' errors.
      await user.clear(screen.getByLabelText(/end date/i));
      await user.type(screen.getByLabelText(/end date/i), '2025-05-28');

      expect(screen.queryByText(/end date.*before.*start date/i)).to.equal(null);
      expect(screen.getByText(/a resource is required/i)).not.to.equal(null);
    });

    it('should keep validating the general tab fields when submitting from the recurrence tab', async () => {
      const onEventsChange = vi.fn();

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

      await user.click(screen.getByRole('tab', { name: /recurrence/i }));
      await user.click(screen.getByRole('button', { name: /save/i }));

      // The general tab is hidden, not unmounted, so its validators still run and block the submit.
      expect(onEventsChange.mock.calls.length).to.equal(0);
      expect(screen.getByText(/a resource is required/i)).not.to.equal(null);
    });

    it('should block submit on a Calendar creation placeholder when `shouldEventRequireResource={true}` and no resource is selected', async () => {
      const onEventsChange = vi.fn();
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

      expect(onEventsChange.mock.calls.length).to.equal(0);
      expect(screen.getByText(/a resource is required/i)).not.to.equal(null);
    });
  });

  describe('resource selection mode (single vs multiple)', () => {
    const eventWithArrayResource: SchedulerEvent = EventBuilder.new()
      .title('Array event')
      .resources([workResource, personalResource])
      .build();

    const eventWithEmptyArrayResource: SchedulerEvent = EventBuilder.new()
      .title('Empty array event')
      .resources([])
      .build();

    function creationSetup() {
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
      return { placeholder, creationOccurrence };
    }

    it('should create with a multi-select picker when `canHaveMultipleResources` is true, even if other events in the data are single-resource', async () => {
      const { placeholder, creationOccurrence } = creationSetup();
      let createEventSpy;

      const { user } = render(
        <EventCalendarProvider
          events={[DEFAULT_EVENT]}
          resources={resources}
          onEventsChange={() => {}}
          eventCreation={{ canHaveMultipleResources: true }}
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

      await user.type(screen.getByLabelText(/event title/i), 'New title');
      await user.click(screen.getByRole('combobox', { name: /resource/i }));
      await user.click(await screen.findByRole('option', { name: /work/i }));
      await user.click(await screen.findByRole('option', { name: /personal/i }));
      await user.keyboard('{Escape}');
      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(createEventSpy?.mock.calls.length).to.equal(1);
      expect(createEventSpy.mock.lastCall?.[0].resource).to.deep.equal([
        workResource.id,
        personalResource.id,
      ]);
    });

    it('should create with a single-select picker when `canHaveMultipleResources` is false, even if other events in the data are multi-resource', async () => {
      const { placeholder, creationOccurrence } = creationSetup();
      let createEventSpy;

      const { user } = render(
        <EventCalendarProvider
          events={[eventWithArrayResource]}
          resources={resources}
          onEventsChange={() => {}}
          eventCreation={{ canHaveMultipleResources: false }}
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

      await user.type(screen.getByLabelText(/event title/i), 'New title');
      await user.click(screen.getByRole('combobox', { name: /resource/i }));
      await user.click(await screen.findByRole('option', { name: /work/i }));
      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(createEventSpy?.mock.calls.length).to.equal(1);
      expect(createEventSpy.mock.lastCall?.[0].resource).to.equal(workResource.id);
    });

    it('should infer a multi-select picker for creation when the first event with a resource in the data has an array', async () => {
      const { placeholder, creationOccurrence } = creationSetup();
      let createEventSpy;

      const { user } = render(
        <EventCalendarProvider
          // The array-resource event comes first: inference scans in order and stops there.
          events={[eventWithArrayResource, DEFAULT_EVENT]}
          resources={resources}
          onEventsChange={() => {}}
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

      await user.type(screen.getByLabelText(/event title/i), 'New title');
      await user.click(screen.getByRole('combobox', { name: /resource/i }));
      await user.click(await screen.findByRole('option', { name: /work/i }));
      await user.click(await screen.findByRole('option', { name: /personal/i }));
      await user.keyboard('{Escape}');
      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(createEventSpy?.mock.calls.length).to.equal(1);
      expect(createEventSpy.mock.lastCall?.[0].resource).to.deep.equal([
        workResource.id,
        personalResource.id,
      ]);
    });

    it('should infer a single-select picker for creation when the first event with a resource in the data has a string', async () => {
      const { placeholder, creationOccurrence } = creationSetup();
      let createEventSpy;

      const { user } = render(
        <EventCalendarProvider
          // DEFAULT_EVENT (string resource) comes first: inference stops there.
          events={[DEFAULT_EVENT, eventWithArrayResource]}
          resources={resources}
          onEventsChange={() => {}}
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

      await user.type(screen.getByLabelText(/event title/i), 'New title');
      await user.click(screen.getByRole('combobox', { name: /resource/i }));
      await user.click(await screen.findByRole('option', { name: /work/i }));
      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(createEventSpy?.mock.calls.length).to.equal(1);
      expect(createEventSpy.mock.lastCall?.[0].resource).to.equal(workResource.id);
    });

    it('should edit an event with an array resource as multi-select even when `canHaveMultipleResources` is false', async () => {
      let updateEventSpy;
      const occurrence = EventBuilder.new(adapter)
        .id(eventWithArrayResource.id)
        .title(eventWithArrayResource.title)
        .span(eventWithArrayResource.start, eventWithArrayResource.end)
        .resources([workResource, personalResource])
        .toOccurrence();

      const { user } = render(
        <EventCalendarProvider
          events={[eventWithArrayResource]}
          resources={resources}
          eventCreation={{ canHaveMultipleResources: false }}
          storeClass={PremiumTestStore}
          onEventsChange={() => {}}
        >
          <StoreSpy
            Context={SchedulerStoreContext}
            method="updateEvent"
            onSpyReady={(sp) => {
              updateEventSpy = sp;
            }}
          />
          <TestEventDialogContent open {...defaultProps} occurrence={occurrence} />
        </EventCalendarProvider>,
      );

      // Both resources start selected; multi-select lets us deselect just one of them.
      await user.click(screen.getByRole('combobox', { name: /resource/i }));
      await user.click(await screen.findByRole('option', { name: /work/i }));
      await user.keyboard('{Escape}');
      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(updateEventSpy?.mock.calls.length).to.equal(1);
      expect(updateEventSpy.mock.lastCall?.[0].resource).to.deep.equal([personalResource.id]);
    });

    it('should keep every resource of a multi-resource event when saving without touching the resource picker', async () => {
      // Regression test for #23016: a multi-resource event opened in the dialog and saved
      // through an unrelated field (e.g. the title) used to collapse `resource` down to its
      // primary entry. It must round-trip unchanged.
      let updateEventSpy;

      const multiResourceEvent: SchedulerEvent = {
        ...DEFAULT_EVENT,
        resource: [personalResource.id, workResource.id],
      };
      const multiResourceOccurrence = EventBuilder.new(adapter)
        .id(multiResourceEvent.id)
        .title(multiResourceEvent.title)
        .description(multiResourceEvent.description)
        .span(multiResourceEvent.start, multiResourceEvent.end)
        .resources([personalResource, workResource])
        .toOccurrence();

      const { user } = render(
        <EventCalendarProvider
          events={[multiResourceEvent]}
          resources={resources}
          storeClass={PremiumTestStore}
          onEventsChange={() => {}}
        >
          <StoreSpy
            Context={SchedulerStoreContext}
            method="updateEvent"
            onSpyReady={(sp) => {
              updateEventSpy = sp;
            }}
          />
          <TestEventDialogContent open {...defaultProps} occurrence={multiResourceOccurrence} />
        </EventCalendarProvider>,
      );

      const dialogs = screen.getAllByRole('dialog');
      const currentDialog = dialogs[dialogs.length - 1];
      const comboboxText = within(currentDialog).getByRole('combobox', {
        name: /resource/i,
      }).textContent;
      expect(comboboxText).to.match(/personal/i);
      expect(comboboxText).to.match(/work/i);

      await user.type(screen.getByLabelText(/event title/i), ' updated');
      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(updateEventSpy?.mock.calls.length).to.equal(1);
      expect(updateEventSpy.mock.lastCall?.[0].resource).to.deep.equal([
        personalResource.id,
        workResource.id,
      ]);
    });

    it('should edit an event with a string resource as single-select even when `canHaveMultipleResources` is true', async () => {
      let updateEventSpy;

      const { user } = render(
        <EventCalendarProvider
          events={[DEFAULT_EVENT]}
          resources={resources}
          eventCreation={{ canHaveMultipleResources: true }}
          storeClass={PremiumTestStore}
          onEventsChange={() => {}}
        >
          <StoreSpy
            Context={SchedulerStoreContext}
            method="updateEvent"
            onSpyReady={(sp) => {
              updateEventSpy = sp;
            }}
          />
          <TestEventDialogContent open {...defaultProps} />
        </EventCalendarProvider>,
      );

      await user.click(screen.getByRole('combobox', { name: /resource/i }));
      await user.click(await screen.findByRole('option', { name: /work/i }));
      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(updateEventSpy?.mock.calls.length).to.equal(1);
      expect(updateEventSpy.mock.lastCall?.[0].resource).to.equal(workResource.id);
    });

    it('should edit an event with resource: [] as multi-select with nothing selected', async () => {
      let updateEventSpy;

      const occurrence = EventBuilder.new(adapter)
        .id(eventWithEmptyArrayResource.id)
        .title(eventWithEmptyArrayResource.title)
        .span(eventWithEmptyArrayResource.start, eventWithEmptyArrayResource.end)
        .resources([])
        .toOccurrence();

      const { user } = render(
        <EventCalendarProvider
          events={[eventWithEmptyArrayResource]}
          resources={resources}
          eventCreation={{ canHaveMultipleResources: false }}
          storeClass={PremiumTestStore}
          onEventsChange={() => {}}
        >
          <StoreSpy
            Context={SchedulerStoreContext}
            method="updateEvent"
            onSpyReady={(sp) => {
              updateEventSpy = sp;
            }}
          />
          <TestEventDialogContent open {...defaultProps} occurrence={occurrence} />
        </EventCalendarProvider>,
      );

      expect(screen.getByRole('combobox', { name: /resource/i }).textContent).to.match(
        /no resource/i,
      );

      await user.click(screen.getByRole('combobox', { name: /resource/i }));
      await user.click(await screen.findByRole('option', { name: /work/i }));
      await user.click(await screen.findByRole('option', { name: /personal/i }));
      await user.keyboard('{Escape}');
      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(updateEventSpy?.mock.calls.length).to.equal(1);
      expect(updateEventSpy.mock.lastCall?.[0].resource).to.deep.equal([
        workResource.id,
        personalResource.id,
      ]);
    });

    it('should still resolve the fallback for editing a resourceless event when event creation is disabled', async () => {
      let updateEventSpy;

      const eventWithoutResource: SchedulerEvent = {
        ...DEFAULT_EVENT,
        id: 'no-resource-event',
        resource: undefined,
      };
      const occurrence = EventBuilder.new(adapter)
        .id(eventWithoutResource.id)
        .title(eventWithoutResource.title)
        .span(eventWithoutResource.start, eventWithoutResource.end)
        .toOccurrence();

      const { user } = render(
        <EventCalendarProvider
          // `eventCreation={false}` makes `creationConfig` resolve to `false`, but editing
          // still needs a fallback mode; the array-resource sibling makes inference pick
          // "multiple" for it.
          events={[eventWithoutResource, eventWithArrayResource]}
          resources={resources}
          eventCreation={false}
          storeClass={PremiumTestStore}
          onEventsChange={() => {}}
        >
          <StoreSpy
            Context={SchedulerStoreContext}
            method="updateEvent"
            onSpyReady={(sp) => {
              updateEventSpy = sp;
            }}
          />
          <TestEventDialogContent open {...defaultProps} occurrence={occurrence} />
        </EventCalendarProvider>,
      );

      await user.click(screen.getByRole('combobox', { name: /resource/i }));
      await user.click(await screen.findByRole('option', { name: /work/i }));
      await user.click(await screen.findByRole('option', { name: /personal/i }));
      await user.keyboard('{Escape}');
      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(updateEventSpy?.mock.calls.length).to.equal(1);
      expect(updateEventSpy.mock.lastCall?.[0].resource).to.deep.equal([
        workResource.id,
        personalResource.id,
      ]);
    });
  });

  describe('Event creation', () => {
    it('should not push the placeholder when a field that does not affect it is edited', async () => {
      const start = adapter.date('2025-05-26T07:30:00Z', 'default');
      const end = adapter.date('2025-05-26T08:30:00Z', 'default');
      let pushSpy;

      const creationOccurrence = EventBuilder.new(adapter)
        .id('tmp')
        .span(start.toISOString(), end.toISOString())
        .title('')
        .description('')
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
          <StoreSpy
            Context={SchedulerStoreContext}
            method="setOccurrencePlaceholder"
            onSpyReady={(sp) => {
              pushSpy = sp;
            }}
          />

          <TestEventDialogContent open {...defaultProps} occurrence={creationOccurrence} />
        </EventCalendarProvider>,
      );

      const callCountAfterMount = pushSpy!.mock.calls.length;

      await user.type(screen.getByLabelText(/event title/i), 'My event');
      await user.type(screen.getByLabelText(/description/i), 'Some details');

      expect(pushSpy!.mock.calls.length).to.equal(callCountAfterMount);
    });

    it('should change surface of the placeholder to day-grid when all-day is changed to true', async () => {
      const start = adapter.date('2025-05-26T07:30:00Z', 'default');
      const end = adapter.date('2025-05-26T08:30:00Z', 'default');
      const handleSurfaceChange = vi.fn();

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

      expect(handleSurfaceChange.mock.lastCall?.[0]).to.equal('time-grid');

      await user.click(screen.getByRole('switch', { name: /all day/i }));

      expect(handleSurfaceChange.mock.lastCall?.[0]).to.equal('day-grid');
    });

    it('should change surface of the placeholder to time-grid when all-day is changed to false', async () => {
      const start = adapter.date('2025-05-26T07:30:00Z', 'default');
      const end = adapter.date('2025-05-26T08:30:00Z', 'default');
      const handleSurfaceChange = vi.fn();

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

      expect(handleSurfaceChange.mock.lastCall?.[0]).to.equal('day-grid');

      await user.click(screen.getByRole('switch', { name: /all day/i }));

      expect(handleSurfaceChange.mock.lastCall?.[0]).to.equal('time-grid');
    });

    it('should not change surfaceType when all day changed to true and lockSurfaceType=true', async () => {
      const start = adapter.date('2025-05-26T07:30:00Z', 'default');
      const end = adapter.date('2025-05-26T08:30:00Z', 'default');
      const handleSurfaceChange = vi.fn();

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
      expect(handleSurfaceChange.mock.lastCall?.[0]).to.equal('time-grid');

      await user.click(screen.getByRole('switch', { name: /all day/i }));

      expect(handleSurfaceChange.mock.lastCall?.[0]).to.equal('time-grid');
    });

    it('should write the selected resource into the creation placeholder', async () => {
      const start = adapter.date('2025-05-26T07:30:00Z', 'default');
      const end = adapter.date('2025-05-26T08:30:00Z', 'default');
      const handleResourceIdChange = vi.fn();

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
            selector={(s) => s.occurrencePlaceholder?.resourceId}
            onValueChange={handleResourceIdChange}
          />
        </EventCalendarProvider>,
      );

      expect(handleResourceIdChange.mock.lastCall?.[0]).to.equal(null);

      await user.click(screen.getByRole('combobox', { name: /resource/i }));
      await user.click(await screen.findByRole('option', { name: /work/i }));

      expect(handleResourceIdChange.mock.lastCall?.[0]).to.equal(workResource.id);
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

      const onEventsChange = vi.fn();
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
      await user.keyboard('{Escape}');
      await user.click(screen.getByRole('tab', { name: /recurrence/i }));
      await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
      await user.click(await screen.findByRole('option', { name: /daily/i }));
      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(createEventSpy?.mock.calls.length).to.equal(1);
      const payload = createEventSpy.mock.lastCall?.[0];

      expect(payload.title).to.equal('New title');
      expect(payload.description).to.equal('Some details');
      expect(payload.allDay).to.equal(false);
      expect(payload.resource).to.deep.equal([workResource.id]);
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

      const onEventsChange = vi.fn();
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

      expect(createEventSpy?.mock.calls.length).to.equal(1);
      const payload = createEventSpy.mock.lastCall?.[0];

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

      // A UTC all-day weekly series viewed from New York: resending the display-day
      // range on a rename used to shift the series and realign its BYDAY. The builder
      // is not mutated after setup, so the fixture is shared by the cross-timezone tests.
      const weeklyBuilder = utcJuly4AllDayBuilder(adapter)
        .title('Weekly sync')
        .recurrent('WEEKLY')
        .withDisplayTimezone('America/New_York');
      const weeklyEvent = weeklyBuilder.build();

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

        expect(updateRecurringEventSpy?.mock.calls.length).to.equal(1);
        expect(selectRecurringEventScopeSpy?.mock.calls.length).to.be.greaterThan(0);
        expect(selectRecurringEventScopeSpy?.mock.lastCall?.[0]).to.equal(null);
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
              onEventsChange={() => {}}
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

        expect(updateRecurringEventSpy?.mock.calls.length).to.equal(1);
        const openPayload = updateRecurringEventSpy.mock.lastCall?.[0];

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

        expect(selectRecurringEventScopeSpy?.mock.calls.length).to.equal(1);
        expect(selectRecurringEventScopeSpy?.mock.lastCall?.[0]).to.equal('all');
      });

      it('should apply a rename to the whole series without resending or moving its dates', async () => {
        let updateRecurringEventSpy;
        const onEventsChange = vi.fn();
        const { user } = render(
          <EventCalendarProvider
            events={[weeklyEvent]}
            resources={resources}
            storeClass={PremiumTestStore}
            displayTimezone="America/New_York"
            onEventsChange={onEventsChange}
          >
            <StoreSpy
              Context={SchedulerStoreContext}
              method="updateRecurringEvent"
              onSpyReady={(sp) => {
                updateRecurringEventSpy = sp;
              }}
            />

            <TestEventDialogContent
              open
              {...defaultProps}
              occurrence={weeklyBuilder.toOccurrence()}
            />

            <RecurringScopeDialog />
          </EventCalendarProvider>,
        );

        await user.type(screen.getByLabelText(/event title/i), ' renamed');
        await user.click(screen.getByRole('button', { name: /save/i }));

        // An untouched range must not enter the pattern-based recurring update:
        // a start re-read in the display timezone could shift the series' days.
        expect(updateRecurringEventSpy?.mock.calls.length).to.equal(1);
        const payload = updateRecurringEventSpy.mock.lastCall[0];
        expect(payload.changes).to.not.have.property('start');
        expect(payload.changes).to.not.have.property('end');

        await screen.findByText(/Apply this change to:/i);
        await user.click(screen.getByText(/All events/i));
        await user.click(screen.getByRole('button', { name: /Confirm/i }));

        const updated = onEventsChange.mock.lastCall?.[0].find(
          (event: SchedulerEvent) => event.id === weeklyEvent.id,
        )!;
        expect(updated.title).to.equal('Weekly sync renamed');
        expect(updated.start).to.equal(weeklyEvent.start);
        expect(updated.end).to.equal(weeklyEvent.end);
        expect(updated.rrule).to.deep.equal(weeklyEvent.rrule);
      });

      it("should detach the renamed occurrence on its own day with scope 'only this' from another timezone", async () => {
        const onEventsChange = vi.fn();
        const { user } = render(
          <EventCalendarProvider
            events={[weeklyEvent]}
            resources={resources}
            storeClass={PremiumTestStore}
            displayTimezone="America/New_York"
            onEventsChange={onEventsChange}
          >
            <TestEventDialogContent
              open
              {...defaultProps}
              occurrence={weeklyBuilder.toOccurrence()}
            />

            <RecurringScopeDialog />
          </EventCalendarProvider>,
        );

        await user.type(screen.getByLabelText(/event title/i), ' renamed');
        await user.click(screen.getByRole('button', { name: /save/i }));
        await screen.findByText(/Apply this change to:/i);
        await user.click(screen.getByText(/Only this event/i));
        await user.click(screen.getByRole('button', { name: /Confirm/i }));

        // The occurrence is identified by its data-timezone start: the exception and
        // the detached event must land on the event's own July 4th, not on the day
        // its display bounds normalize to in New York.
        const newEvents: SchedulerEvent[] = onEventsChange.mock.lastCall?.[0];
        const series = newEvents.find((event) => event.id === weeklyEvent.id)!;
        expect(series.exDates).to.have.length(1);
        expect(
          adapter.formatByString(adapter.date(String(series.exDates![0]), 'UTC'), 'yyyy-MM-dd'),
        ).to.equal('2025-07-04');

        const detached = newEvents.find((event) => event.id !== weeklyEvent.id)!;
        expect(detached.title).to.equal('Weekly sync renamed');
        expect(detached.rrule).to.equal(undefined);
        expect(
          adapter.formatByString(adapter.date(String(detached.start), 'UTC'), 'yyyy-MM-dd'),
        ).to.equal('2025-07-04');
      });

      it("should move the whole series to the edited day as displayed with scope 'all'", async () => {
        const onEventsChange = vi.fn();

        const { user } = render(
          <EventCalendarProvider
            events={[weeklyEvent]}
            resources={resources}
            storeClass={PremiumTestStore}
            displayTimezone="America/New_York"
            onEventsChange={onEventsChange}
          >
            <TestEventDialogContent
              open
              {...defaultProps}
              occurrence={weeklyBuilder.toOccurrence()}
            />

            <RecurringScopeDialog />
          </EventCalendarProvider>,
        );

        // The dialog shows the series on New York July 3rd → 4th; move it one day later.
        const startDateInput = screen.getByLabelText(/start date/i);
        await user.clear(startDateInput);
        await user.type(startDateInput, '2025-07-04');
        const endDateInput = screen.getByLabelText(/end date/i);
        await user.clear(endDateInput);
        await user.type(endDateInput, '2025-07-05');
        await user.click(screen.getByRole('button', { name: /save/i }));

        await screen.findByText(/Apply this change to:/i);
        await user.click(screen.getByText(/All events/i));
        await user.click(screen.getByRole('button', { name: /Confirm/i }));

        // The picked days mean the days the user was looking at: the series start
        // lands on New York July 4th.
        const updated = onEventsChange.mock.lastCall?.[0].find(
          (event: SchedulerEvent) => event.id === weeklyEvent.id,
        )!;
        const updatedStartInNewYork = adapter.setTimezone(
          adapter.date(String(updated.start), 'UTC'),
          'America/New_York',
        );
        expect(adapter.formatByString(updatedStartInNewYork, 'yyyy-MM-dd')).to.equal('2025-07-04');
        const updatedEndInNewYork = adapter.setTimezone(
          adapter.date(String(updated.end), 'UTC'),
          'America/New_York',
        );
        expect(adapter.formatByString(updatedEndInNewYork, 'yyyy-MM-dd')).to.equal('2025-07-05');
        // The start's data-timezone day is unchanged, so the BYDAY stays put.
        expect(updated.rrule).to.deep.equal(weeklyEvent.rrule);
      });

      it('should anchor the BYDAY to the data-timezone day when moved as displayed from a timezone ahead of UTC', async () => {
        const onEventsChange = vi.fn();
        // Tokyo is ahead of UTC: the displayed day maps to the previous UTC day, so a
        // BYDAY computed from the display day would hop weekdays (New York, being
        // behind, shares the calendar day and cannot catch that).
        const tokyoBuilder = utcJuly4AllDayBuilder(adapter)
          .title('Weekly sync')
          .recurrent('WEEKLY')
          .withDisplayTimezone('Asia/Tokyo');
        const tokyoEvent = tokyoBuilder.build();

        const { user } = render(
          <EventCalendarProvider
            events={[tokyoEvent]}
            resources={resources}
            storeClass={PremiumTestStore}
            displayTimezone="Asia/Tokyo"
            onEventsChange={onEventsChange}
          >
            <TestEventDialogContent
              open
              {...defaultProps}
              occurrence={tokyoBuilder.toOccurrence()}
            />

            <RecurringScopeDialog />
          </EventCalendarProvider>,
        );

        // The dialog shows the series on Tokyo July 4th → 5th; move it one day later.
        const startDateInput = screen.getByLabelText(/start date/i);
        await user.clear(startDateInput);
        await user.type(startDateInput, '2025-07-05');
        const endDateInput = screen.getByLabelText(/end date/i);
        await user.clear(endDateInput);
        await user.type(endDateInput, '2025-07-06');
        await user.click(screen.getByRole('button', { name: /save/i }));

        await screen.findByText(/Apply this change to:/i);
        await user.click(screen.getByText(/All events/i));
        await user.click(screen.getByRole('button', { name: /Confirm/i }));

        const updated = onEventsChange.mock.lastCall?.[0].find(
          (event: SchedulerEvent) => event.id === tokyoEvent.id,
        )!;
        // The picked Tokyo July 5th is still UTC July 4th — a Friday: the day did not
        // move in the data timezone, so the BYDAY stays FR (not the display day's SA).
        expect(updated.rrule).to.deep.equal(tokyoEvent.rrule);
        const updatedStartInTokyo = adapter.setTimezone(
          adapter.date(String(updated.start), 'UTC'),
          'Asia/Tokyo',
        );
        expect(adapter.formatByString(updatedStartInTokyo, 'yyyy-MM-dd')).to.equal('2025-07-05');
      });

      it("should keep the untouched start byte-identical when only the end date is edited with scope 'all'", async () => {
        const onEventsChange = vi.fn();

        const { user } = render(
          <EventCalendarProvider
            events={[weeklyEvent]}
            resources={resources}
            storeClass={PremiumTestStore}
            displayTimezone="America/New_York"
            onEventsChange={onEventsChange}
          >
            <TestEventDialogContent
              open
              {...defaultProps}
              occurrence={weeklyBuilder.toOccurrence()}
            />

            <RecurringScopeDialog />
          </EventCalendarProvider>,
        );

        // The dialog shows the series on New York July 3rd → 4th; extend only the end.
        const endDateInput = screen.getByLabelText(/end date/i);
        await user.clear(endDateInput);
        await user.type(endDateInput, '2025-07-05');
        await user.click(screen.getByRole('button', { name: /save/i }));

        await screen.findByText(/Apply this change to:/i);
        await user.click(screen.getByText(/All events/i));
        await user.click(screen.getByRole('button', { name: /Confirm/i }));

        const updated = onEventsChange.mock.lastCall?.[0].find(
          (event: SchedulerEvent) => event.id === weeklyEvent.id,
        )!;
        // The untouched start must not enter the pattern math: no DTSTART move,
        // no BYDAY realign onto the displayed Thursday.
        expect(updated.start).to.equal(weeklyEvent.start);
        expect(updated.rrule).to.deep.equal(weeklyEvent.rrule);
        // The edited end applies as the day the user was looking at.
        const updatedEndInNewYork = adapter.setTimezone(
          adapter.date(String(updated.end), 'UTC'),
          'America/New_York',
        );
        expect(adapter.formatByString(updatedEndInNewYork, 'yyyy-MM-dd')).to.equal('2025-07-05');
      });

      it('should delete the occurrence of its own day when deleted from another timezone', async () => {
        let deleteRecurringEventSpy;

        const { user } = render(
          <EventCalendarProvider
            events={[weeklyEvent]}
            resources={resources}
            storeClass={PremiumTestStore}
            onEventsChange={() => {}}
            displayTimezone="America/New_York"
          >
            <StoreSpy
              Context={SchedulerStoreContext}
              method="deleteRecurringEvent"
              onSpyReady={(sp) => {
                deleteRecurringEventSpy = sp;
              }}
            />

            <TestEventDialogContent
              open
              {...defaultProps}
              occurrence={weeklyBuilder.toOccurrence()}
            />

            <RecurringScopeDialog />
          </EventCalendarProvider>,
        );

        await user.click(screen.getByRole('button', { name: /delete/i }));

        // The occurrence is identified by its data-timezone start, not by the day its
        // display bounds normalize to in New York.
        expect(deleteRecurringEventSpy?.mock.calls.length).to.equal(1);
        const payload = deleteRecurringEventSpy.mock.lastCall[0];
        expect(adapter.getTime(payload.occurrenceStart)).to.equal(
          adapter.getTime(adapter.date('2025-07-04T00:00:00', 'UTC')),
        );
      });

      it("should split the series on its own day with scope 'this and following' from another timezone", async () => {
        const onEventsChange = vi.fn();
        const { user } = render(
          <EventCalendarProvider
            events={[weeklyEvent]}
            resources={resources}
            storeClass={PremiumTestStore}
            displayTimezone="America/New_York"
            onEventsChange={onEventsChange}
          >
            <TestEventDialogContent
              open
              {...defaultProps}
              occurrence={weeklyBuilder.toOccurrence('2025-07-11T00:00:00Z')}
            />

            <RecurringScopeDialog />
          </EventCalendarProvider>,
        );

        await user.type(screen.getByLabelText(/event title/i), ' renamed');
        await user.click(screen.getByRole('button', { name: /save/i }));
        await screen.findByText(/Apply this change to:/i);
        await user.click(screen.getByText(/This and following events/i));
        await user.click(screen.getByRole('button', { name: /Confirm/i }));

        // The split boundary derives from the occurrence's own July 11th, not the
        // July 10th its display bounds normalize to in New York: the original series
        // truncates the day before, and the split series starts on the 11th.
        const newEvents: SchedulerEvent[] = onEventsChange.mock.lastCall?.[0];
        const series = newEvents.find((event) => event.id === weeklyEvent.id)!;
        expect(
          adapter.formatByString(
            adapter.date(String((series.rrule as any).until), 'UTC'),
            'yyyy-MM-dd',
          ),
        ).to.equal('2025-07-10');

        const split = newEvents.find((event) => event.id !== weeklyEvent.id)!;
        expect(split.title).to.equal('Weekly sync renamed');
        expect(split.rrule).to.not.equal(undefined);
        expect(
          adapter.formatByString(adapter.date(String(split.start), 'UTC'), 'yyyy-MM-dd'),
        ).to.equal('2025-07-11');
      });

      it('should identify an occurrence across a DST transition by its data-timezone start', async () => {
        // A DST-observing data timezone: the series starts in EDT (UTC-4) and the
        // targeted occurrence falls after the 2025-11-02 fall-back (EST, UTC-5), so a
        // conversion that cancels out at a fixed offset cannot pass this test.
        const dstBuilder = EventBuilder.new(adapter)
          .title('Weekly sync')
          .withDataTimezone('America/New_York')
          .span('2025-10-31T00:00:00', '2025-10-31T23:59:59.999', { allDay: true })
          .recurrent('WEEKLY')
          .withDisplayTimezone('UTC');
        const dstEvent = dstBuilder.build();

        let deleteRecurringEventSpy;

        const { user } = render(
          <EventCalendarProvider
            events={[dstEvent]}
            resources={resources}
            storeClass={PremiumTestStore}
            onEventsChange={() => {}}
            displayTimezone="UTC"
          >
            <StoreSpy
              Context={SchedulerStoreContext}
              method="deleteRecurringEvent"
              onSpyReady={(sp) => {
                deleteRecurringEventSpy = sp;
              }}
            />

            <TestEventDialogContent
              open
              {...defaultProps}
              occurrence={dstBuilder.toOccurrence('2025-11-07T05:00:00Z')}
            />

            <RecurringScopeDialog />
          </EventCalendarProvider>,
        );

        await user.click(screen.getByRole('button', { name: /delete/i }));

        // November 7th midnight in New York is 05:00Z (EST), not the display day's
        // 00:00Z nor the pre-transition offset's 04:00Z.
        expect(deleteRecurringEventSpy?.mock.calls.length).to.equal(1);
        const payload = deleteRecurringEventSpy!.mock.lastCall![0];
        expect(adapter.getTime(payload.occurrenceStart)).to.equal(
          adapter.getTime(adapter.date('2025-11-07T00:00:00', 'America/New_York')),
        );
      });

      it('should keep a series in a DST-observing timezone byte-identical on a rename across the transition', async () => {
        const dstBuilder = EventBuilder.new(adapter)
          .title('Weekly sync')
          .withDataTimezone('America/New_York')
          .span('2025-10-31T00:00:00', '2025-10-31T23:59:59.999', { allDay: true })
          .recurrent('WEEKLY')
          .withDisplayTimezone('UTC');
        const dstEvent = dstBuilder.build();
        const onEventsChange = vi.fn();

        const { user } = render(
          <EventCalendarProvider
            events={[dstEvent]}
            resources={resources}
            storeClass={PremiumTestStore}
            displayTimezone="UTC"
            onEventsChange={onEventsChange}
          >
            <TestEventDialogContent
              open
              {...defaultProps}
              occurrence={dstBuilder.toOccurrence('2025-11-07T05:00:00Z')}
            />

            <RecurringScopeDialog />
          </EventCalendarProvider>,
        );

        const titleInput = screen.getByLabelText(/title/i);
        await user.clear(titleInput);
        await user.type(titleInput, 'Renamed weekly');
        await user.click(screen.getByRole('button', { name: /save/i }));

        await screen.findByText(/Apply this change to:/i);
        await user.click(screen.getByText(/All events/i));
        await user.click(screen.getByRole('button', { name: /Confirm/i }));

        const updated = onEventsChange.mock.lastCall?.[0].find(
          (event: SchedulerEvent) => event.id === dstEvent.id,
        )!;
        expect(updated.title).to.equal('Renamed weekly');
        expect(updated.start).to.equal(dstEvent.start);
        expect(updated.end).to.equal(dstEvent.end);
        expect(updated.rrule).to.deep.equal(dstEvent.rrule);
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
              onEventsChange={() => {}}
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

        expect(updateRecurringEventSpy?.mock.calls.length).to.equal(1);
        const openPayload = updateRecurringEventSpy.mock.lastCall?.[0];

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
        expect(selectRecurringEventScopeSpy?.mock.calls.length).to.equal(1);
        expect(selectRecurringEventScopeSpy?.mock.lastCall?.[0]).to.equal('only-this');
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
              onEventsChange={() => {}}
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

        expect(updateRecurringEventSpy?.mock.calls.length).to.equal(1);
        const openPayload = updateRecurringEventSpy.mock.lastCall?.[0];

        expect(openPayload.changes.id).to.equal(originalRecurringEvent.id);
        expect(openPayload.changes.rrule).to.equal(undefined);

        expect(selectRecurringEventScopeSpy?.mock.calls.length).to.equal(1);
        expect(selectRecurringEventScopeSpy?.mock.lastCall?.[0]).to.equal('this-and-following');
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
          expect(deleteRecurringEventSpy?.mock.calls.length).to.equal(1);
          expect(deleteRecurringEventSpy?.mock.lastCall?.[0].eventId).to.equal(
            originalRecurringEvent.id,
          );
          expect(deleteEventSpy?.mock.calls.length).to.equal(0);
        });

        it('should not delete anything if the user cancels the scope dialog', async () => {
          const onEventsChange = vi.fn();
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

          expect(selectRecurringEventScopeSpy?.mock.lastCall?.[0]).to.equal(null);
          expect(onEventsChange.mock.calls.length).to.equal(0);
        });

        it("should delete the whole series with scope 'all' on Confirm", async () => {
          const onEventsChange = vi.fn();

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

          expect(onEventsChange.mock.calls.length).to.equal(1);
          expect(onEventsChange.mock.lastCall?.[0]).to.deep.equal([]);
        });

        it("should delete only the selected occurrence with scope 'only-this' on Confirm", async () => {
          const onEventsChange = vi.fn();

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

          expect(onEventsChange.mock.calls.length).to.equal(1);
          const updatedEvents = onEventsChange.mock.lastCall?.[0];
          expect(updatedEvents).to.have.length(1);
          expect(updatedEvents[0].exDates).to.have.length(1);
        });

        it("should truncate the series with scope 'this-and-following' on Confirm", async () => {
          const onEventsChange = vi.fn();
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

          expect(onEventsChange.mock.calls.length).to.equal(1);
          const updatedEvents = onEventsChange.mock.lastCall?.[0];
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
          const onEventsChange = vi.fn();

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

          expect(onEventsChange.mock.calls.length).to.equal(1);
          const updated = onEventsChange.mock.calls[0][0][0];

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
          const onEventsChange = vi.fn();

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

          expect(onEventsChange.mock.calls.length).to.equal(1);
          const updated = onEventsChange.mock.calls[0][0][0];

          // DEFAULT_EVENT is 2025-05-26, so byMonthDay defaults to [26]
          expect(updated.rrule).to.deep.equal({
            freq: 'MONTHLY',
            byDay: [],
            byMonthDay: [26],
            interval: 2,
          });
        });

        it('should submit custom recurrence with Ends: until and selected date', async () => {
          const onEventsChange = vi.fn();

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

          expect(onEventsChange.mock.calls.length).to.equal(1);
          const updated = onEventsChange.mock.calls[0][0][0];

          expect(updated.rrule).to.deep.include({ freq: 'YEARLY', interval: 3 });
          expect(updated.rrule?.count ?? undefined).to.equal(undefined);
          expect(updated.rrule?.until).to.equal('2025-07-20T00:00:00.000Z');
        });

        it('should block saving a custom recurrence with Ends: until and no date', async () => {
          const onEventsChange = vi.fn();

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

          const endsFieldset = screen.getByRole('group', { name: /ends/i });
          await user.click(within(endsFieldset).getByRole('radio', { name: /until/i }));
          const dateInput = endsFieldset.querySelector('input[type="date"]') as HTMLInputElement;
          await user.clear(dateInput);

          await user.click(screen.getByRole('button', { name: /save/i }));

          expect(onEventsChange.mock.calls.length).to.equal(0);
          // The failing field lives in the Recurrence tab, so it must stay visible.
          expect(screen.getByRole('tabpanel', { name: /recurrence/i })).not.to.have.attribute(
            'hidden',
          );
        });

        it('should block a programmatic submit when the Ends until date is invalid', async () => {
          const onEventsChange = vi.fn();

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

          const endsFieldset = screen.getByRole('group', { name: /ends/i });
          await user.click(within(endsFieldset).getByRole('radio', { name: /until/i }));
          const dateInput = endsFieldset.querySelector('input[type="date"]') as HTMLInputElement;
          await user.clear(dateInput);

          // Bypass the native `required` so the form-store validator is what blocks.
          fireEvent.submit(screen.getByRole('button', { name: /save/i }).closest('form')!);
          await waitFor(() => expect(dateInput).to.have.attribute('aria-invalid', 'true'));

          expect(onEventsChange.mock.calls.length).to.equal(0);
          expect(screen.getByRole('tabpanel', { name: /recurrence/i })).not.to.have.attribute(
            'hidden',
          );
        });

        it('should keep the Recurrence tab visible when a recurrence control is natively invalid', async () => {
          const onEventsChange = vi.fn();

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

          // `min: 1` makes the value 0 natively invalid, but the change handler keeps it.
          const repeatGroup = screen.getByRole('group', { name: /repeat/i });
          const intervalInput = within(repeatGroup).getByRole('spinbutton');
          await user.click(intervalInput);
          await user.keyboard('{Control>}a{/Control}0');

          await user.click(screen.getByRole('button', { name: /save/i }));

          expect(onEventsChange.mock.calls.length).to.equal(0);
          expect(screen.getByRole('tabpanel', { name: /recurrence/i })).not.to.have.attribute(
            'hidden',
          );
        });

        it('should submit custom weekly with selected weekdays', async () => {
          const onEventsChange = vi.fn();

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

          expect(onEventsChange.mock.calls.length).to.equal(1);
          const updated = onEventsChange.mock.calls[0][0][0];

          expect(updated.rrule).to.deep.equal({
            freq: 'WEEKLY',
            interval: 1,
            byDay: ['MO', 'FR'],
            byMonthDay: [],
          });
        });

        it('should submit custom monthly with "day of month" option', async () => {
          const onEventsChange = vi.fn();

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

          expect(onEventsChange.mock.calls.length).to.equal(1);
          const updated = onEventsChange.mock.calls[0][0][0];

          expect(updated.rrule).to.deep.equal({
            freq: 'MONTHLY',
            interval: 1,
            byDay: [],
            byMonthDay: [26],
          });
        });

        it('should submit custom monthly with "ordinal weekday" option', async () => {
          const onEventsChange = vi.fn();

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

          expect(onEventsChange.mock.calls.length).to.equal(1);
          const updated = onEventsChange.mock.calls[0][0][0];

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
          const onEventsChange = vi.fn();

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

          expect(onEventsChange.mock.calls.length).to.equal(1);
          const updated = onEventsChange.mock.calls[0][0][0];

          // WEEKLY preset must pre-fill byDay with the event's weekday (Monday → 'MO')
          expect(updated.rrule).to.deep.equal({ freq: 'WEEKLY', interval: 1, byDay: ['MO'] });
        });

        it('should pre-fill MONTHLY preset with the event day-of-month', async () => {
          const onEventsChange = vi.fn();

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

          expect(onEventsChange.mock.calls.length).to.equal(1);
          const updated = onEventsChange.mock.calls[0][0][0];

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
          const onEventsChange = vi.fn();

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

          expect(onEventsChange.mock.calls.length).to.equal(1);
          const updated = onEventsChange.mock.calls[0][0][0];
          expect(updated.rrule.byDay).to.deep.equal(['MO']);
        });

        it('should pre-fill byDay with the event weekday when switching frequency to WEEKLY', async () => {
          const onEventsChange = vi.fn();

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

          expect(onEventsChange.mock.calls.length).to.equal(1);
          const updated = onEventsChange.mock.calls[0][0][0];
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
            onEventsChange={() => {}}
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
        await user.keyboard('{Escape}');
        await user.click(screen.getByRole('button', { name: /save/i }));

        expect(updateEventSpy?.mock.calls.length).to.equal(1);
        const payload = updateEventSpy.mock.lastCall?.[0];

        expect(payload.id).to.equal(nonRecurringEvent.id);
        expect(payload.title).to.equal('Task updated');
        expect(payload.description).to.equal('new description');
        expect(payload.resource).to.deep.equal([workResource.id]);
        expect(payload.allDay).to.equal(false);
        // The date fields were not edited, so the payload leaves the range out
        // and the stored dates cannot shift.
        expect(payload.start).to.equal(undefined);
        expect(payload.end).to.equal(undefined);
        expect(payload.rrule).to.equal(undefined);
      });

      it('should call updateEvent with updated values and send rrule if recurrence was selected on Submit', async () => {
        let updateEventSpy;

        const { user } = render(
          <EventCalendarProvider
            events={[nonRecurringEvent]}
            resources={resources}
            storeClass={PremiumTestStore}
            onEventsChange={() => {}}
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

        expect(updateEventSpy?.mock.calls.length).to.equal(1);
        const payload = updateEventSpy.mock.lastCall?.[0];

        expect(payload.id).to.equal(nonRecurringEvent.id);
        expect(payload.rrule).to.deep.equal({
          freq: 'DAILY',
          interval: 1,
        });
      });
    });

    describe('Custom event data', () => {
      const recurringEventWithCustomData = {
        ...EventBuilder.new()
          .id('recurring-custom-1')
          .title('Daily standup')
          .description('sync')
          .singleDay('2025-06-11T10:00:00Z', 30)
          .resource(personalResource)
          .recurrent('DAILY')
          .build(),
        customField: 'preserve-me',
      } as SchedulerEvent;
      const recurringEventWithCustomDataOccurrence = EventBuilder.new(adapter)
        .id(recurringEventWithCustomData.id)
        .title(recurringEventWithCustomData.title)
        .description(recurringEventWithCustomData.description)
        .span(recurringEventWithCustomData.start, recurringEventWithCustomData.end)
        .recurrent('DAILY')
        .toOccurrence();

      const nonRecurringEventWithCustomData = {
        ...EventBuilder.new()
          .id('non-recurring-custom-1')
          .title('Task')
          .singleDay('2025-06-12T14:00:00Z')
          .build(),
        customField: 'preserve-me',
        untouchedField: 'keep-me',
      } as SchedulerEvent;
      const nonRecurringEventWithCustomDataOccurrence = EventBuilder.new(adapter)
        .id(nonRecurringEventWithCustomData.id)
        .title(nonRecurringEventWithCustomData.title)
        .singleDay('2025-06-12T14:00:00Z')
        .toOccurrence();

      it('should preserve custom data when editing a non-recurring event', async () => {
        const onEventsChange = vi.fn();
        const { user } = render(
          <EventCalendarProvider
            events={[nonRecurringEventWithCustomData]}
            onEventsChange={onEventsChange}
            resources={resources}
            storeClass={PremiumTestStore}
          >
            <TestEventDialogContent
              open
              {...defaultProps}
              occurrence={nonRecurringEventWithCustomDataOccurrence}
            />
          </EventCalendarProvider>,
        );
        await user.type(screen.getByLabelText(/event title/i), ' updated');
        await user.click(screen.getByRole('button', { name: /save/i }));

        expect(onEventsChange.mock.calls.length).to.equal(1);
        const updated = onEventsChange.mock.lastCall?.[0].find(
          (event) => event.id === nonRecurringEventWithCustomData.id,
        );
        expect(updated.title).to.equal('Task updated');
        expect(updated.customField).to.equal('preserve-me');
      });

      it("should preserve custom data when editing a recurring event with scope 'all'", async () => {
        const onEventsChange = vi.fn();
        const { user } = render(
          <EventCalendarProvider
            events={[recurringEventWithCustomData]}
            onEventsChange={onEventsChange}
            resources={resources}
            storeClass={PremiumTestStore}
          >
            <TestEventDialogContent
              open
              {...defaultProps}
              occurrence={recurringEventWithCustomDataOccurrence}
            />
            <RecurringScopeDialog />
          </EventCalendarProvider>,
        );
        await user.clear(screen.getByLabelText(/start time/i));
        await user.type(screen.getByLabelText(/start time/i), '10:05');
        await user.click(screen.getByRole('button', { name: /save/i }));

        await screen.findByText(/Apply this change to:/i);
        await user.click(screen.getByText(/All events/i));
        await user.click(screen.getByRole('button', { name: /Confirm/i }));

        const updated = onEventsChange.mock.lastCall?.[0].find(
          (event) => event.id === recurringEventWithCustomData.id,
        );
        expect(updated.customField).to.equal('preserve-me');
      });

      it("should preserve custom data on the new event with scope 'only-this'", async () => {
        const onEventsChange = vi.fn();
        const { user } = render(
          <EventCalendarProvider
            events={[recurringEventWithCustomData]}
            onEventsChange={onEventsChange}
            resources={resources}
            storeClass={PremiumTestStore}
          >
            <TestEventDialogContent
              open
              {...defaultProps}
              occurrence={recurringEventWithCustomDataOccurrence}
            />
            <RecurringScopeDialog />
          </EventCalendarProvider>,
        );
        await user.clear(screen.getByLabelText(/start time/i));
        await user.type(screen.getByLabelText(/start time/i), '10:05');
        await user.click(screen.getByRole('button', { name: /save/i }));

        await screen.findByText(/Apply this change to:/i);
        await user.click(screen.getByText(/Only this event/i));
        await user.click(screen.getByRole('button', { name: /Confirm/i }));

        const created = onEventsChange.mock.lastCall?.[0].find(
          (event) => event.extractedFromId === recurringEventWithCustomData.id,
        );
        expect(created).to.not.equal(undefined);
        expect(created.customField).to.equal('preserve-me');
      });

      it("should preserve custom data on the new event with scope 'this-and-following'", async () => {
        const onEventsChange = vi.fn();
        const { user } = render(
          <EventCalendarProvider
            events={[recurringEventWithCustomData]}
            onEventsChange={onEventsChange}
            resources={resources}
            storeClass={PremiumTestStore}
          >
            <TestEventDialogContent
              open
              {...defaultProps}
              occurrence={recurringEventWithCustomDataOccurrence}
            />
            <RecurringScopeDialog />
          </EventCalendarProvider>,
        );
        await user.clear(screen.getByLabelText(/start time/i));
        await user.type(screen.getByLabelText(/start time/i), '10:05');
        await user.click(screen.getByRole('button', { name: /save/i }));

        await screen.findByText(/Apply this change to:/i);
        await user.click(screen.getByText(/This and following events/i));
        await user.click(screen.getByRole('button', { name: /Confirm/i }));

        const created = onEventsChange.mock.lastCall?.[0].find(
          (event) => event.extractedFromId === recurringEventWithCustomData.id,
        );
        expect(created).to.not.equal(undefined);
        expect(created.customField).to.equal('preserve-me');
      });

      describe('custom fields through the eventDialogGeneralTab slot', () => {
        function CustomFieldSection() {
          const { value, setValue } = useEventDialogFormField<'customField', string>('customField');
          return (
            <input
              aria-label="custom field"
              value={value ?? ''}
              onChange={(event) => setValue(event.target.value)}
            />
          );
        }
        function CustomGeneralTab() {
          return (
            <React.Fragment>
              <EventDialogGeneralTabContent />
              <CustomFieldSection />
            </React.Fragment>
          );
        }

        const recurringEventWithUntouchedData = {
          ...EventBuilder.new()
            .id('recurring-custom-2')
            .title('Daily standup')
            .description('sync')
            .singleDay('2025-06-11T10:00:00Z', 30)
            .resource(personalResource)
            .recurrent('DAILY')
            .build(),
          customField: 'preserve-me',
          untouchedField: 'keep-me',
        } as SchedulerEvent;
        const recurringEventWithUntouchedDataOccurrence = EventBuilder.new(adapter)
          .id(recurringEventWithUntouchedData.id)
          .title(recurringEventWithUntouchedData.title)
          .description(recurringEventWithUntouchedData.description)
          .span(recurringEventWithUntouchedData.start, recurringEventWithUntouchedData.end)
          .recurrent('DAILY')
          .toOccurrence();

        function renderWithCustomFieldSlot(
          event: SchedulerEvent,
          occurrence: ReturnType<typeof EventBuilder.prototype.toOccurrence>,
          onEventsChange: Mock,
          onSpyReady: (sp: any) => void,
          // Recurring saves go through `updateRecurringEvent`, non-recurring through `updateEvent`.
          method: 'updateEvent' | 'updateRecurringEvent' = 'updateEvent',
        ) {
          return render(
            <EventCalendarProvider
              events={[event]}
              onEventsChange={onEventsChange}
              resources={resources}
              storeClass={PremiumTestStore}
            >
              <StoreSpy Context={SchedulerStoreContext} method={method} onSpyReady={onSpyReady} />
              <SchedulerSlotsProvider
                slots={{ eventDialogGeneralTab: CustomGeneralTab }}
                slotProps={undefined}
              >
                <TestEventDialogContent open {...defaultProps} occurrence={occurrence} />
              </SchedulerSlotsProvider>
              <RecurringScopeDialog />
            </EventCalendarProvider>,
          );
        }

        async function editCustomFieldAndSave(user: any) {
          await user.clear(screen.getByLabelText('custom field'));
          await user.type(screen.getByLabelText('custom field'), 'edited');
          await user.click(screen.getByRole('button', { name: /save/i }));
        }

        it('should save a custom field edited through useEventDialogFormField', async () => {
          const onEventsChange = vi.fn();
          let updateEventSpy;
          const { user } = renderWithCustomFieldSlot(
            nonRecurringEventWithCustomData,
            nonRecurringEventWithCustomDataOccurrence,
            onEventsChange,
            (sp) => {
              updateEventSpy = sp;
            },
          );

          // The custom field is seeded from the event model.
          expect(screen.getByLabelText('custom field')).to.have.value('preserve-me');

          await editCustomFieldAndSave(user);

          expect(onEventsChange.mock.calls.length).to.equal(1);
          const updated = onEventsChange.mock.lastCall?.[0].find(
            (event) => event.id === nonRecurringEventWithCustomData.id,
          );
          expect(updated.customField).to.equal('edited');

          // Only the edited custom field enters the changes payload — an untouched
          // seeded field keeps resolving against the live model instead.
          const changes = updateEventSpy!.mock.lastCall?.[0];
          expect(changes.customField).to.equal('edited');
          expect(changes).not.to.have.property('untouchedField');
          expect(updated.untouchedField).to.equal('keep-me');
        });

        const scopeScenarios = [
          {
            scope: 'all',
            optionText: /All events/i,
            // Scope 'all' updates the original event in place...
            findSavedEvent: (events: any[]) =>
              events.find((event) => event.id === recurringEventWithUntouchedData.id),
          },
          {
            scope: 'only-this',
            optionText: /Only this event/i,
            // ...while the other scopes extract a new event from the series.
            findSavedEvent: (events: any[]) =>
              events.find((event) => event.extractedFromId === recurringEventWithUntouchedData.id),
          },
          {
            scope: 'this-and-following',
            optionText: /This and following events/i,
            findSavedEvent: (events: any[]) =>
              events.find((event) => event.extractedFromId === recurringEventWithUntouchedData.id),
          },
        ];

        scopeScenarios.forEach(({ scope, optionText, findSavedEvent }) => {
          it(`should save a custom field edited through the slot with scope '${scope}'`, async () => {
            const onEventsChange = vi.fn();
            let updateEventSpy;
            const { user } = renderWithCustomFieldSlot(
              recurringEventWithUntouchedData,
              recurringEventWithUntouchedDataOccurrence,
              onEventsChange,
              (sp) => {
                updateEventSpy = sp;
              },
              'updateRecurringEvent',
            );

            await editCustomFieldAndSave(user);

            await screen.findByText(/Apply this change to:/i);
            await user.click(screen.getByText(optionText));
            await user.click(screen.getByRole('button', { name: /Confirm/i }));

            const saved = findSavedEvent(onEventsChange.mock.lastCall?.[0]);
            expect(saved).to.not.equal(undefined);
            expect(saved.customField).to.equal('edited');
            expect(saved.untouchedField).to.equal('keep-me');
            expect(updateEventSpy?.mock.calls.length).to.equal(1);
            const { changes } = updateEventSpy?.mock.lastCall?.[0] ?? {};
            expect(changes.customField).to.equal('edited');
            expect(changes).not.to.have.property('untouchedField');
          });
        });
      });

      it('should use the latest custom data when it changes while the scope dialog is open', async () => {
        const onEventsChange = vi.fn();
        const eventBefore = {
          ...recurringEventWithCustomData,
          customField: 'before',
        } as SchedulerEvent;
        const eventAfter = {
          ...recurringEventWithCustomData,
          customField: 'after',
        } as SchedulerEvent;

        const renderDialog = (events: SchedulerEvent[]) => (
          <EventCalendarProvider
            events={events}
            onEventsChange={onEventsChange}
            resources={resources}
            storeClass={PremiumTestStore}
          >
            <TestEventDialogContent
              open
              {...defaultProps}
              occurrence={recurringEventWithCustomDataOccurrence}
            />
            <RecurringScopeDialog />
          </EventCalendarProvider>
        );

        const { user, rerender } = render(renderDialog([eventBefore]));

        await user.clear(screen.getByLabelText(/start time/i));
        await user.type(screen.getByLabelText(/start time/i), '10:05');
        await user.click(screen.getByRole('button', { name: /save/i }));
        await screen.findByText(/Apply this change to:/i);

        // The events prop updates while the scope dialog is open.
        rerender(renderDialog([eventAfter]));

        await user.click(screen.getByText(/All events/i));
        await user.click(screen.getByRole('button', { name: /Confirm/i }));

        const updated = onEventsChange.mock.lastCall?.[0].find(
          (event) => event.id === recurringEventWithCustomData.id,
        );
        expect(updated.customField).to.equal('after');
      });

      it('should carry the latest custom data onto the new event when it changes while the scope dialog is open', async () => {
        const onEventsChange = vi.fn();
        const eventBefore = {
          ...recurringEventWithCustomData,
          customField: 'before',
        } as SchedulerEvent;
        const eventAfter = {
          ...recurringEventWithCustomData,
          customField: 'after',
        } as SchedulerEvent;

        const renderDialog = (events: SchedulerEvent[]) => (
          <EventCalendarProvider
            events={events}
            onEventsChange={onEventsChange}
            resources={resources}
            storeClass={PremiumTestStore}
          >
            <TestEventDialogContent
              open
              {...defaultProps}
              occurrence={recurringEventWithCustomDataOccurrence}
            />
            <RecurringScopeDialog />
          </EventCalendarProvider>
        );

        const { user, rerender } = render(renderDialog([eventBefore]));

        await user.clear(screen.getByLabelText(/start time/i));
        await user.type(screen.getByLabelText(/start time/i), '10:05');
        await user.click(screen.getByRole('button', { name: /save/i }));
        await screen.findByText(/Apply this change to:/i);

        // The events prop updates while the scope dialog is open.
        rerender(renderDialog([eventAfter]));

        await user.click(screen.getByText(/Only this event/i));
        await user.click(screen.getByRole('button', { name: /Confirm/i }));

        const created = onEventsChange.mock.lastCall?.[0].find(
          (event) => event.extractedFromId === recurringEventWithCustomData.id,
        );
        expect(created.customField).to.equal('after');
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
      const handleEditingChange = vi.fn();

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

      // `onOpen` sets editingOccurrence; rendering content directly (no trigger flow) leaves it null.
      expect(handleEditingChange.mock.lastCall?.[0]).to.equal(null);
    });

    it('should reflect the edited occurrence id while an event is being edited', async () => {
      const handleEditingChange = vi.fn();

      render(
        <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources}>
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext}
            onMount={(store) => store.startEditing(defaultProps.occurrence)}
          />
          <StateWatcher
            Context={SchedulerStoreContext}
            selector={(s) => s.editingOccurrence?.occurrence.id ?? null}
            onValueChange={handleEditingChange}
          />
          <TestEventDialogContent open {...defaultProps} onClose={() => {}} />
        </EventCalendarProvider>,
      );

      // After `startEditing`, it should be the event ID.
      expect(handleEditingChange.mock.lastCall?.[0]).to.equal(DEFAULT_EVENT.id);
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
