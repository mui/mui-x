import * as React from 'react';
import type { AnyEventCalendarStore } from 'test/utils/scheduler';
import {
  adapter,
  createSchedulerRenderer,
  EventBuilder,
  ResourceBuilder,
  SchedulerStoreRunner,
} from 'test/utils/scheduler';
import { act, fireEvent, screen } from '@mui/internal-test-utils';
import { spy } from 'sinon';
import { clearWarningsCache } from '@mui/x-internals/warning';
import type { SchedulerResource } from '@mui/x-scheduler-internals/models';
import { SchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import type {
  EventDialogGeneralTabProps,
  EventDialogGeneralTabPropsOverrides,
  SchedulerSlotProps,
  SchedulerSlots,
} from '../../../models/slots';
import { MonthView } from '../../../month-view';
import { EventDialogContent, EventDialogProvider } from './EventDialog';
import { EventCalendarProvider } from '../EventCalendarProvider';
import { SchedulerSlotsProvider } from '../SchedulerSlotsContext';
import {
  DateTimeSection,
  DescriptionSection,
  ResourceAndColorSection,
  SectionFieldset,
  SectionHeaderTitle,
  useEventDialogFormField,
} from '@mui/x-scheduler/event-dialog';
import { eventCalendarClasses } from '../../../event-calendar/eventCalendarClasses';

const personalResource = ResourceBuilder.new().title('Personal').eventColor('teal').build();

const DEFAULT_EVENT: SchedulerEvent = EventBuilder.new()
  .title('Running')
  .description('Morning run')
  .singleDay('2025-05-26T07:30:00Z', 45)
  .resource(personalResource)
  .build();

const resources: SchedulerResource[] = [personalResource];

// Minimal `matchMedia` stub to drive the coarse-vs-fine pointer branch of `useDraggableDialog`.
const createMatchMedia = (matches: boolean) => () =>
  ({
    matches,
    addEventListener: () => {},
    removeEventListener: () => {},
  }) as any;

describe('<EventDialogContent /> — community (no recurring-events plugin)', () => {
  const anchor = document.createElement('button');
  document.body.appendChild(anchor);

  const defaultProps = {
    anchor,
    container: document.body,
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
    // Unmounting the focused, edited title makes React 19 suspend, and it logs an un-awaited `act`
    // warning unless the key press itself happens inside an awaited `act` — which `user.keyboard`
    // and a bare `fireEvent` both leave outside, so the browser run fails on the console output.
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      fireEvent.keyDown(titleInput, { key: 'Escape' });
    });
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

  describe('eventDialogGeneralTab slot', () => {
    // `defaultProps.occurrence` has no description, and the seeding assertions below need one.
    const occurrenceWithDescription = EventBuilder.new()
      .id(DEFAULT_EVENT.id)
      .title(DEFAULT_EVENT.title)
      .description('Morning run')
      .span(DEFAULT_EVENT.start, DEFAULT_EVENT.end)
      .resource(personalResource)
      .toOccurrence();

    function CustomSection() {
      const priority = useEventDialogFormField<string>('priority', { defaultValue: 'normal' });
      return (
        <input
          aria-label="Priority"
          value={priority.value}
          onChange={(event) => priority.setValue(event.target.value)}
        />
      );
    }

    function renderWithSlot(
      slots: SchedulerSlots,
      providerProps?: Partial<React.ComponentProps<typeof EventCalendarProvider>>,
      occurrence = occurrenceWithDescription,
      slotProps?: SchedulerSlotProps,
    ) {
      return render(
        <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources} {...providerProps}>
          <SchedulerSlotsProvider slots={slots} slotProps={slotProps}>
            <EventDialogContent open {...defaultProps} occurrence={occurrence} />
          </SchedulerSlotsProvider>
        </EventCalendarProvider>,
      );
    }

    it('should render the default sections when the slot is not provided', () => {
      renderWithSlot({});

      expect(screen.getByText('Date & time')).not.to.equal(null);
      expect(screen.getByText('Resource & color')).not.to.equal(null);
      expect(screen.getByRole('textbox', { name: 'Description' })).not.to.equal(null);
    });

    it('should render the slot content instead of the default sections', () => {
      renderWithSlot({ eventDialogGeneralTab: CustomSection });

      expect(screen.getByRole('textbox', { name: 'Priority' })).not.to.equal(null);
      expect(screen.queryByText('Date & time')).to.equal(null);
      expect(screen.queryByRole('textbox', { name: 'Description' })).to.equal(null);
    });

    it('should keep the tab panel attributes when the slot is provided', () => {
      renderWithSlot({ eventDialogGeneralTab: CustomSection });

      const panel = document.querySelector(`.${eventCalendarClasses.eventDialogTabPanel}`)!;
      expect(panel).to.have.attribute('role', 'tabpanel');
      expect(panel.getAttribute('id')).to.match(/-general-tabpanel$/);
      expect(panel.getAttribute('aria-labelledby')).to.match(/-general-tab$/);
      // The slot owns the content, not the panel, so the content wrapper is still there.
      expect(panel.querySelector(`.${eventCalendarClasses.eventDialogTabContent}`)).not.to.equal(
        null,
      );
    });

    it('should apply the theme classes to SectionFieldset and SectionHeaderTitle in a custom section', () => {
      function CustomFieldsetSection() {
        return (
          <SectionFieldset className="custom-fieldset">
            <SectionHeaderTitle className="custom-title">Priority</SectionHeaderTitle>
          </SectionFieldset>
        );
      }
      renderWithSlot({ eventDialogGeneralTab: CustomFieldsetSection });

      const fieldset = document.querySelector(
        `.${eventCalendarClasses.eventDialogSectionFieldset}`,
      );
      expect(fieldset).not.to.equal(null);
      expect(fieldset!.classList.contains('custom-fieldset')).to.equal(true);
      const legend = document.querySelector(
        `.${eventCalendarClasses.eventDialogSectionHeaderTitle}`,
      );
      expect(legend).not.to.equal(null);
      expect(legend!.classList.contains('custom-title')).to.equal(true);
    });

    it('should render the built-in sections in the order the slot returns them', () => {
      function ReorderedSections() {
        return (
          <React.Fragment>
            <DescriptionSection />
            <DateTimeSection />
          </React.Fragment>
        );
      }
      renderWithSlot({ eventDialogGeneralTab: ReorderedSections });

      const description = screen.getByRole('textbox', { name: 'Description' });
      const dateTimeLegend = screen.getByText('Date & time');
      expect(description.compareDocumentPosition(dateTimeLegend)).to.equal(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
      // Reordering must not affect seeding.
      expect(description).to.have.value('Morning run');
      expect(screen.getByLabelText(/start date/i)).to.have.value('2025-05-26');
    });

    it('should render a custom section inserted between two built-in sections', () => {
      function MixedSections() {
        return (
          <React.Fragment>
            <DateTimeSection />
            <CustomSection />
            <DescriptionSection />
          </React.Fragment>
        );
      }
      renderWithSlot({ eventDialogGeneralTab: MixedSections });

      const priority = screen.getByRole('textbox', { name: 'Priority' });
      expect(screen.getByText('Date & time').compareDocumentPosition(priority)).to.equal(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
      expect(
        priority.compareDocumentPosition(screen.getByRole('textbox', { name: 'Description' })),
      ).to.equal(Node.DOCUMENT_POSITION_FOLLOWING);
    });

    it('should keep the fields reachable when the sections are wrapped in arbitrary JSX', () => {
      function WrappedSections() {
        return (
          <section aria-label="More options">
            <DescriptionSection />
          </section>
        );
      }
      renderWithSlot({ eventDialogGeneralTab: WrappedSections });

      expect(screen.getByRole('region', { name: 'More options' })).not.to.equal(null);
      expect(screen.getByRole('textbox', { name: 'Description' })).to.have.value('Morning run');
    });

    it('should keep the form usable when the slot renders no section at all', async () => {
      const onEventsChange = spy();
      const { user } = renderWithSlot({ eventDialogGeneralTab: () => null }, { onEventsChange });

      expect(screen.getByLabelText(/event title/i)).not.to.equal(null);
      await user.click(screen.getByRole('button', { name: 'Save' }));
      expect(onEventsChange.callCount).to.equal(1);
    });

    it('should pass the occurrence to the slot', () => {
      const occurrences: string[] = [];
      function OccurrenceProbe(props: EventDialogGeneralTabProps) {
        occurrences.push(props.occurrence.title);
        return null;
      }
      renderWithSlot({ eventDialogGeneralTab: OccurrenceProbe });

      expect(occurrences[0]).to.equal(DEFAULT_EVENT.title);
    });

    it('should keep the scheduler-owned occurrence over one supplied through slotProps', () => {
      const occurrences: string[] = [];
      function OccurrenceProbe(props: EventDialogGeneralTabProps) {
        occurrences.push(props.occurrence.title);
        return null;
      }
      // Bypasses the compile-time protection the way a consumer's wider spread object can.
      const overridingProps = {
        occurrence: EventBuilder.new().title('Other event').toOccurrence(),
      } as EventDialogGeneralTabPropsOverrides;
      renderWithSlot({ eventDialogGeneralTab: OccurrenceProbe }, undefined, undefined, {
        eventDialogGeneralTab: overridingProps,
      });

      expect(occurrences[0]).to.equal(DEFAULT_EVENT.title);
    });

    it('should save a custom field edited from a section rendered by the slot', async () => {
      const onEventsChange = spy();
      const { user } = renderWithSlot({ eventDialogGeneralTab: CustomSection }, { onEventsChange });

      await user.clear(screen.getByRole('textbox', { name: 'Priority' }));
      await user.type(screen.getByRole('textbox', { name: 'Priority' }), 'high');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(onEventsChange.callCount).to.equal(1);
      expect(onEventsChange.lastCall.firstArg[0]).to.have.property('priority', 'high');
    });

    it('should block the submit when a validator of a section rendered by the slot fails', async () => {
      const onEventsChange = spy();
      function RequiredCustomSection() {
        const client = useEventDialogFormField<string>('client', {
          defaultValue: '',
          validate: (value) => (value ? null : 'Client is required'),
        });
        return (
          <React.Fragment>
            <input
              aria-label="Client"
              value={client.value}
              onChange={(event) => client.setValue(event.target.value)}
            />
            {client.error && <p role="alert">{client.error}</p>}
          </React.Fragment>
        );
      }

      const { user } = renderWithSlot(
        { eventDialogGeneralTab: RequiredCustomSection },
        { onEventsChange },
      );

      await user.click(screen.getByRole('button', { name: 'Save' }));
      expect(onEventsChange.callCount).to.equal(0);
      expect(screen.getByRole('alert')).to.have.text('Client is required');

      await user.type(screen.getByRole('textbox', { name: 'Client' }), 'Acme');
      await user.click(screen.getByRole('button', { name: 'Save' }));
      expect(onEventsChange.callCount).to.equal(1);
    });

    it('should warn when the resource section is omitted while shouldEventRequireResource is enabled', async () => {
      clearWarningsCache();
      await expect(async () => {
        const { user } = renderWithSlot(
          { eventDialogGeneralTab: CustomSection },
          { shouldEventRequireResource: true, onEventsChange: () => {} },
        );
        await user.click(screen.getByRole('button', { name: 'Save' }));
      }).toWarnDev([
        'MUI X Scheduler: `shouldEventRequireResource` is enabled but no field of the event dialog validates the resource.',
      ]);
    });

    it('should not warn and save the assigned resource when the slot keeps the resource section', async () => {
      clearWarningsCache();
      const onEventsChange = spy();
      const { user } = renderWithSlot(
        { eventDialogGeneralTab: () => <ResourceAndColorSection /> },
        { shouldEventRequireResource: true, onEventsChange },
      );

      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(onEventsChange.callCount).to.equal(1);
      expect(onEventsChange.lastCall.firstArg[0]).to.have.property('resource', personalResource.id);
    });

    it('should not warn when a section rendered by the slot validates the resource itself', async () => {
      clearWarningsCache();
      function CustomResourceSection() {
        useEventDialogFormField<string[]>('resourceIds', {
          validate: (value) => (value.length > 0 ? null : 'Required'),
        });
        return null;
      }

      const { user } = renderWithSlot(
        { eventDialogGeneralTab: CustomResourceSection },
        { shouldEventRequireResource: true, onEventsChange: () => {} },
      );

      await user.click(screen.getByRole('button', { name: 'Save' }));
    });

    it('should block the submit of an event without resource when the slot omits the resource section', async () => {
      clearWarningsCache();
      const onEventsChange = spy();
      const noResourceEvent: SchedulerEvent = EventBuilder.new()
        .title('Running')
        .singleDay('2025-05-26T07:30:00Z', 45)
        .build();
      const noResourceOccurrence = EventBuilder.new()
        .id(noResourceEvent.id)
        .title(noResourceEvent.title)
        .span(noResourceEvent.start, noResourceEvent.end)
        .toOccurrence();

      await expect(async () => {
        const { user } = renderWithSlot(
          { eventDialogGeneralTab: CustomSection },
          { events: [noResourceEvent], shouldEventRequireResource: true, onEventsChange },
          noResourceOccurrence,
        );
        await user.click(screen.getByRole('button', { name: 'Save' }));
      }).toWarnDev([
        'MUI X Scheduler: `shouldEventRequireResource` is enabled but no field of the event dialog validates the resource.',
      ]);

      expect(onEventsChange.callCount).to.equal(0);
    });

    it('should surface the required-resource error on a custom field bound to resourceIds', async () => {
      clearWarningsCache();
      const onEventsChange = spy();
      const noResourceEvent: SchedulerEvent = EventBuilder.new()
        .title('Running')
        .singleDay('2025-05-26T07:30:00Z', 45)
        .build();
      const noResourceOccurrence = EventBuilder.new()
        .id(noResourceEvent.id)
        .title(noResourceEvent.title)
        .span(noResourceEvent.start, noResourceEvent.end)
        .toOccurrence();

      // No validator registered, so the message can only come from the submit-level check.
      function CustomResourceField() {
        const resourceField = useEventDialogFormField<string[]>('resourceIds');
        return resourceField.error ? <p role="alert">{resourceField.error}</p> : null;
      }

      await expect(async () => {
        const { user } = renderWithSlot(
          { eventDialogGeneralTab: CustomResourceField },
          { events: [noResourceEvent], shouldEventRequireResource: true, onEventsChange },
          noResourceOccurrence,
        );
        await user.click(screen.getByRole('button', { name: 'Save' }));
      }).toWarnDev([
        'MUI X Scheduler: `shouldEventRequireResource` is enabled but no field of the event dialog validates the resource.',
      ]);

      expect(onEventsChange.callCount).to.equal(0);
      expect(screen.getByRole('alert')).to.have.text('A resource is required.');
    });

    it('should keep a section rendered twice in sync through the shared form store', async () => {
      function DuplicatedSections() {
        return (
          <React.Fragment>
            <DescriptionSection />
            <DescriptionSection />
          </React.Fragment>
        );
      }
      const { user } = renderWithSlot({ eventDialogGeneralTab: DuplicatedSections });

      const [first, second] = screen.getAllByRole('textbox', { name: 'Description' });
      expect(second).to.have.value('Morning run');

      await user.clear(first);
      await user.type(first, 'Evening run');
      expect(second).to.have.value('Evening run');
    });

    it('should produce duplicate DOM ids when a section with a static id is rendered twice', () => {
      function DuplicatedSections() {
        return (
          <React.Fragment>
            <DateTimeSection />
            <DateTimeSection />
          </React.Fragment>
        );
      }
      renderWithSlot({ eventDialogGeneralTab: DuplicatedSections });

      // The all-day switch id is built from the scheduler id, not from the section instance,
      // so duplicating the section duplicates the id. Pinned as a documented limitation.
      const switches = document.querySelectorAll('[id$="-enable-all-day-switch"]');
      expect(switches.length).to.equal(2);
      expect(switches[0].id).to.equal(switches[1].id);
    });

    it('should keep the draft when the slot component identity changes', async () => {
      function SlotA() {
        return <CustomSection />;
      }
      function SlotB() {
        return <CustomSection />;
      }
      function Harness(harnessProps: { slot: React.ComponentType<EventDialogGeneralTabProps> }) {
        return (
          <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources}>
            <SchedulerSlotsProvider
              slots={{ eventDialogGeneralTab: harnessProps.slot }}
              slotProps={undefined}
            >
              <EventDialogContent open {...defaultProps} occurrence={occurrenceWithDescription} />
            </SchedulerSlotsProvider>
          </EventCalendarProvider>
        );
      }
      const { user, setProps } = render(<Harness slot={SlotA} />);

      const priority = screen.getByRole('textbox', { name: 'Priority' });
      await user.clear(priority);
      await user.type(priority, 'high');

      // The new identity remounts the slot content, but the draft lives in the form store above it.
      setProps({ slot: SlotB });
      expect(screen.getByRole('textbox', { name: 'Priority' })).to.have.value('high');
    });

    describe('async validation', () => {
      function createDeferred() {
        let resolve!: (value: null) => void;
        const promise = new Promise<null>((internalResolve) => {
          resolve = internalResolve;
        });
        return { promise, resolve };
      }

      it('should validate the values as they are when the async validation settles, not as they were on submit', async () => {
        const onEventsChange = spy();
        const deferred = createDeferred();
        function AsyncValidatedSection() {
          const client = useEventDialogFormField<string>('client', {
            defaultValue: 'Acme',
            validate: (value) => (value === '' ? 'Client is required' : deferred.promise),
          });
          return (
            <React.Fragment>
              <input
                aria-label="Client"
                value={client.value}
                onChange={(event) => client.setValue(event.target.value)}
              />
              {client.error && <p role="alert">{client.error}</p>}
            </React.Fragment>
          );
        }
        const { user } = renderWithSlot(
          { eventDialogGeneralTab: AsyncValidatedSection },
          { onEventsChange },
        );

        // The validation of "Acme" is now pending on the deferred promise.
        await user.click(screen.getByRole('button', { name: 'Save' }));
        await user.clear(screen.getByRole('textbox', { name: 'Client' }));
        await act(async () => deferred.resolve(null));

        expect(onEventsChange.callCount).to.equal(0);
        expect(screen.getByRole('alert')).to.have.text('Client is required');
      });

      it('should ignore a submission that settles after its editing session ended', async () => {
        const onEventsChange = spy();
        const deferred = createDeferred();
        function AsyncValidatedSection() {
          useEventDialogFormField<string>('client', {
            defaultValue: 'Acme',
            validate: () => deferred.promise,
          });
          return null;
        }
        const { user, unmount } = renderWithSlot(
          { eventDialogGeneralTab: AsyncValidatedSection },
          { onEventsChange },
        );

        await user.click(screen.getByRole('button', { name: 'Save' }));
        // Both editing surfaces unmount the form when the session stops.
        unmount();
        await act(async () => deferred.resolve(null));

        expect(onEventsChange.callCount).to.equal(0);
      });

      it('should submit only once when Save is pressed twice while the validation is pending', async () => {
        const onEventsChange = spy();
        const deferred = createDeferred();
        function AsyncValidatedSection() {
          useEventDialogFormField<string>('client', {
            defaultValue: 'Acme',
            validate: () => deferred.promise,
          });
          return null;
        }
        const { user } = renderWithSlot(
          { eventDialogGeneralTab: AsyncValidatedSection },
          { onEventsChange },
        );

        const saveButton = screen.getByRole('button', { name: 'Save' });
        await user.click(saveButton);
        await user.click(saveButton);
        await act(async () => deferred.resolve(null));

        expect(onEventsChange.callCount).to.equal(1);
      });
    });
  });

  // The sections read the occurrence from context instead of receiving it as a prop, so they
  // resolve their own per-property read-only state. A property is read-only when the event model
  // structure declares a getter without a setter.
  describe('per-property read-only state', () => {
    it('should mark the description field read-only when the description property has no setter', () => {
      render(
        <EventCalendarProvider
          events={[DEFAULT_EVENT]}
          resources={resources}
          eventModelStructure={{ description: { getter: (event) => event.description } }}
        >
          <EventDialogContent open {...defaultProps} />
        </EventCalendarProvider>,
      );

      expect(screen.getByRole('textbox', { name: 'Description' })).to.have.attribute('readonly');
    });

    it('should mark the date and time fields read-only when the start and end properties have no setter', () => {
      render(
        <EventCalendarProvider
          events={[DEFAULT_EVENT]}
          resources={resources}
          eventModelStructure={{
            start: { getter: (event) => event.start },
            end: { getter: (event) => event.end },
          }}
        >
          <EventDialogContent open {...defaultProps} />
        </EventCalendarProvider>,
      );

      expect(screen.getByLabelText(/start date/i)).to.have.attribute('readonly');
      expect(screen.getByLabelText(/start time/i)).to.have.attribute('readonly');
      expect(screen.getByLabelText(/end date/i)).to.have.attribute('readonly');
      expect(screen.getByLabelText(/end time/i)).to.have.attribute('readonly');
    });

    it('should disable the all-day switch when the allDay property has no setter', () => {
      render(
        <EventCalendarProvider
          events={[DEFAULT_EVENT]}
          resources={resources}
          eventModelStructure={{ allDay: { getter: (event) => event.allDay } }}
        >
          <EventDialogContent open {...defaultProps} />
        </EventCalendarProvider>,
      );

      expect(screen.getByRole('switch', { name: /all day/i })).to.have.attribute('disabled');
    });

    it('should disable the color picker when the resource property has no setter', () => {
      render(
        <EventCalendarProvider
          events={[DEFAULT_EVENT]}
          resources={resources}
          eventModelStructure={{ resource: { getter: (event) => event.resource } }}
        >
          <EventDialogContent open {...defaultProps} />
        </EventCalendarProvider>,
      );

      expect(screen.getByRole('group', { name: 'Event color' })).to.have.attribute('data-disabled');
    });
  });

  describe('drag affordance', () => {
    const originalMatchMedia = window.matchMedia;
    afterEach(() => {
      window.matchMedia = originalMatchMedia;
    });

    it('should mark the dialog draggable on a fine pointer', () => {
      window.matchMedia = createMatchMedia(false);
      render(
        <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources}>
          <EventDialogContent open {...defaultProps} />
        </EventCalendarProvider>,
      );

      expect(document.querySelector('[draggable="true"]')).not.to.equal(null);
    });

    it('should not mark the dialog draggable on a coarse pointer, so its form fields stay typeable on touch', () => {
      window.matchMedia = createMatchMedia(true);
      render(
        <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources}>
          <EventDialogContent open {...defaultProps} />
        </EventCalendarProvider>,
      );

      expect(document.querySelector('[draggable="true"]')).to.equal(null);
    });
  });
});
