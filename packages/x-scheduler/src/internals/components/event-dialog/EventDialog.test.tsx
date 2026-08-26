import * as React from 'react';
import type { AnyEventCalendarStore } from 'test/utils/scheduler';
import {
  adapter,
  createMatchMedia,
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
import { schedulerOccurrencePlaceholderSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import {
  EventDialogDateTimeSection,
  EventDialogDescriptionSection,
  EventDialogResourceAndColorSection,
  EventDialogSectionFieldset,
  EventDialogSectionHeaderTitle,
  useEventDialogFormField,
  useEventDialogOccurrence,
} from '@mui/x-scheduler/event-dialog';
import { describe, it, expect, afterEach, beforeEach } from 'vitest';
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
    occurrence: EventBuilder.new()
      .id(DEFAULT_EVENT.id)
      .title(DEFAULT_EVENT.title)
      .span(DEFAULT_EVENT.start, DEFAULT_EVENT.end)
      .resource(personalResource)
      .toOccurrence(),
    onClose: () => {},
  };

  const { render } = createSchedulerRenderer();

  beforeEach(() => clearWarningsCache());

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

    function renderCreation(onEventsChange: ReturnType<typeof spy>) {
      const start = adapter.date('2025-05-26T07:30:00Z', 'default');
      const end = adapter.date('2025-05-26T08:15:00Z', 'default');
      const creationOccurrence = EventBuilder.new()
        .id('placeholder-id')
        .title('')
        .span('2025-05-26T07:30:00Z', '2025-05-26T08:15:00Z')
        .toOccurrence();

      return render(
        <EventCalendarProvider events={[]} resources={resources} onEventsChange={onEventsChange}>
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
          <SchedulerSlotsProvider
            slots={{ eventDialogGeneralTab: CustomSection }}
            slotProps={undefined}
          >
            <EventDialogContent open {...defaultProps} occurrence={creationOccurrence} />
          </SchedulerSlotsProvider>
        </EventCalendarProvider>,
      );
    }

    it('should save an edited custom field when creating an event', async () => {
      const onEventsChange = spy();
      const { user } = renderCreation(onEventsChange);

      await user.type(screen.getByRole('textbox', { name: /event title/i }), 'Meeting');
      const priority = screen.getByRole('textbox', { name: 'Priority' });
      await user.clear(priority);
      await user.type(priority, 'high');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(onEventsChange.callCount).to.equal(1);
      const [created] = onEventsChange.lastCall.firstArg;
      expect(created.priority).to.equal('high');
    });

    it('should omit an untouched default when creating an event', async () => {
      const onEventsChange = spy();
      const { user } = renderCreation(onEventsChange);

      expect(screen.getByRole('textbox', { name: 'Priority' })).to.have.value('normal');
      await user.type(screen.getByRole('textbox', { name: /event title/i }), 'Meeting');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(onEventsChange.callCount).to.equal(1);
      const [created] = onEventsChange.lastCall.firstArg;
      expect(created).not.to.have.property('priority');
    });

    it('should not re-render the slot content when a creation keystroke pushes the placeholder', () => {
      const onRender = spy();
      function RenderProbe() {
        const priority = useEventDialogFormField('priority', { defaultValue: 'normal' });
        onRender();
        return (
          <input
            aria-label="Priority"
            value={priority.value}
            onChange={(event) => priority.setValue(event.target.value)}
          />
        );
      }
      function CreationSections() {
        return (
          <React.Fragment>
            <EventDialogDateTimeSection />
            <RenderProbe />
          </React.Fragment>
        );
      }
      const start = adapter.date('2025-05-26T07:30:00Z', 'default');
      const end = adapter.date('2025-05-26T08:15:00Z', 'default');
      const creationOccurrence = EventBuilder.new()
        .id('placeholder-id')
        .title('')
        .span('2025-05-26T07:30:00Z', '2025-05-26T08:15:00Z')
        .toOccurrence();

      let schedulerStore!: AnyEventCalendarStore;
      render(
        <EventCalendarProvider events={[]} resources={resources} onEventsChange={() => {}}>
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext}
            onMount={(store) => {
              schedulerStore = store;
              store.setOccurrencePlaceholder({
                type: 'creation',
                surfaceType: 'time-grid',
                start,
                end,
                lockSurfaceType: false,
                resourceId: null,
              });
            }}
          />
          <SchedulerSlotsProvider
            slots={{ eventDialogGeneralTab: CreationSections }}
            slotProps={undefined}
          >
            <EventDialogContent open {...defaultProps} occurrence={creationOccurrence} />
          </SchedulerSlotsProvider>
        </EventCalendarProvider>,
      );

      const rendersBefore = onRender.callCount;
      fireEvent.change(screen.getByLabelText(/start date/i), { target: { value: '2025-05-27' } });

      // The write pushes a placeholder into the scheduler store; the dialog must not
      // re-render wholesale for it, only the fields bound to the written keys.
      expect(screen.getByLabelText(/start date/i)).to.have.value('2025-05-27');
      expect(onRender.callCount).to.equal(rendersBefore);

      const placeholder = schedulerOccurrencePlaceholderSelectors.value(schedulerStore.state)!;
      expect(adapter.formatByString(placeholder.start, 'yyyy-MM-dd')).to.equal('2025-05-27');
    });

    it('should open the dialog for an event with a property named hasOwnProperty', () => {
      const shadowingEvent = { ...DEFAULT_EVENT, hasOwnProperty: 'shadowed' } as SchedulerEvent;
      renderWithSlot({ eventDialogGeneralTab: CustomSection }, { events: [shadowingEvent] });

      expect(screen.getByRole('textbox', { name: 'Priority' })).not.to.equal(null);
    });

    it('should apply the default value when the model carries the key with an explicit undefined', () => {
      // e.g. `{ ...event, priority: maybeValue }` with an undefined `maybeValue`
      const eventWithExplicitUndefined = {
        ...DEFAULT_EVENT,
        priority: undefined,
      } as SchedulerEvent;
      renderWithSlot(
        { eventDialogGeneralTab: CustomSection },
        { events: [eventWithExplicitUndefined] },
      );

      expect(screen.getByRole('textbox', { name: 'Priority' })).to.have.value('normal');
    });

    it('should not let an edited custom field rewrite a built-in event property', async () => {
      const onEventsChange = spy();
      function CollidingSection() {
        const readOnlyField = useEventDialogFormField('readOnly');
        const notes = useEventDialogFormField('notes', { defaultValue: '' });
        return (
          <React.Fragment>
            <input
              aria-label="Read only"
              value={(readOnlyField.value as string) ?? ''}
              onChange={(event) => readOnlyField.setValue(event.target.value)}
            />
            <input
              aria-label="Notes"
              value={notes.value}
              onChange={(event) => notes.setValue(event.target.value)}
            />
          </React.Fragment>
        );
      }

      await expect(async () => {
        const { user } = renderWithSlot(
          { eventDialogGeneralTab: CollidingSection },
          { onEventsChange },
        );
        await user.type(screen.getByRole('textbox', { name: 'Read only' }), 'x');
        await user.type(screen.getByRole('textbox', { name: 'Notes' }), 'kept');
        await user.click(screen.getByRole('button', { name: 'Save' }));
      }).toWarnDev(['MUI X Scheduler: useEventDialogFormField() received the key "readOnly"']);

      expect(onEventsChange.callCount).to.equal(1);
      const saved = onEventsChange.lastCall.firstArg.find(
        (event: SchedulerEvent) => event.id === DEFAULT_EVENT.id,
      );
      expect(saved).not.to.have.property('readOnly');
      expect(saved.notes).to.equal('kept');
    });

    it('should not claim tab semantics when the dialog renders no tabs', () => {
      renderWithSlot({ eventDialogGeneralTab: CustomSection });

      // The community dialog has no Recurrence tab, so a tabpanel would be
      // orphaned: no role, no dangling aria-labelledby.
      const panel = document.querySelector(`.${eventCalendarClasses.eventDialogTabPanel}`)!;
      expect(panel).not.to.have.attribute('role');
      expect(panel).not.to.have.attribute('aria-labelledby');
      // The slot owns the content, not the panel, so the content wrapper is still there.
      expect(panel.querySelector(`.${eventCalendarClasses.eventDialogTabContent}`)).not.to.equal(
        null,
      );
    });

    it('should expose the edited occurrence to a custom section through useEventDialogOccurrence', () => {
      function OccurrenceProbe() {
        const occurrence = useEventDialogOccurrence();
        return <span data-testid="occurrence-probe">{`${occurrence.id}:${occurrence.title}`}</span>;
      }
      renderWithSlot({ eventDialogGeneralTab: OccurrenceProbe });

      expect(screen.getByTestId('occurrence-probe').textContent).to.equal(
        `${occurrenceWithDescription.id}:${occurrenceWithDescription.title}`,
      );
    });

    it('should apply the theme classes to EventDialogSectionFieldset and EventDialogSectionHeaderTitle in a custom section', () => {
      function CustomFieldsetSection() {
        return (
          <EventDialogSectionFieldset className="custom-fieldset">
            <EventDialogSectionHeaderTitle className="custom-title">
              Priority
            </EventDialogSectionHeaderTitle>
          </EventDialogSectionFieldset>
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

    it('should forward the refs of EventDialogSectionFieldset and EventDialogSectionHeaderTitle to their DOM nodes', () => {
      const fieldsetRef = React.createRef<HTMLFieldSetElement>();
      const legendRef = React.createRef<HTMLLegendElement>();
      function RefSection() {
        return (
          <EventDialogSectionFieldset ref={fieldsetRef}>
            <EventDialogSectionHeaderTitle ref={legendRef}>Priority</EventDialogSectionHeaderTitle>
          </EventDialogSectionFieldset>
        );
      }
      renderWithSlot({ eventDialogGeneralTab: RefSection });

      expect(fieldsetRef.current).not.to.equal(null);
      expect(fieldsetRef.current!.tagName).to.equal('FIELDSET');
      expect(legendRef.current).not.to.equal(null);
      expect(legendRef.current!.tagName).to.equal('LEGEND');
    });

    it('should render the built-in sections in the order the slot returns them', () => {
      function ReorderedSections() {
        return (
          <React.Fragment>
            <EventDialogDescriptionSection />
            <EventDialogDateTimeSection />
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
            <EventDialogDateTimeSection />
            <CustomSection />
            <EventDialogDescriptionSection />
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
            <EventDialogDescriptionSection />
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

    it('should still submit a value written in a section the slot conditionally unmounted', async () => {
      // `getDirtyValues` iterates the whole values bag: unmounting a section removes its
      // validator, not its written value.
      function ToggleableSections() {
        const [showPriority, setShowPriority] = React.useState(true);
        return (
          <React.Fragment>
            <button type="button" onClick={() => setShowPriority(false)}>
              Hide priority
            </button>
            {showPriority ? <CustomSection /> : null}
          </React.Fragment>
        );
      }

      const onEventsChange = spy();
      const { user } = renderWithSlot(
        { eventDialogGeneralTab: ToggleableSections },
        { onEventsChange },
      );

      await user.clear(screen.getByRole('textbox', { name: 'Priority' }));
      await user.type(screen.getByRole('textbox', { name: 'Priority' }), 'high');
      await user.click(screen.getByRole('button', { name: 'Hide priority' }));
      expect(screen.queryByRole('textbox', { name: 'Priority' })).to.equal(null);

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
      const onEventsChange = spy();
      const { user } = renderWithSlot(
        { eventDialogGeneralTab: () => <EventDialogResourceAndColorSection /> },
        { shouldEventRequireResource: true, onEventsChange },
      );

      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(onEventsChange.callCount).to.equal(1);
      expect(onEventsChange.lastCall.firstArg[0]).to.have.property('resource', personalResource.id);
    });

    it('should not warn when a section rendered by the slot validates the resource itself', async () => {
      function CustomResourceSection() {
        useEventDialogFormField('resourceIds', {
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
        const resourceField = useEventDialogFormField('resourceIds');
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

    // No validator registered in these fields (the date and time section owns them), so
    // blocking, the message, and the dev warning can only come from the submit-level check.
    function createRangeField(
      key: 'endDate' | 'endTime',
      label: string,
      validate?: (value: string) => string | null,
    ) {
      return function CustomRangeField() {
        const field = useEventDialogFormField(key, { validate });
        return (
          <React.Fragment>
            <input
              aria-label={label}
              value={field.value}
              onChange={(event) => field.setValue(event.target.value)}
            />
            {field.error && <p role="alert">{field.error}</p>}
          </React.Fragment>
        );
      };
    }

    const invertedRangeScenarios = [
      {
        key: 'endDate' as const,
        label: 'End date',
        typed: '2025-05-20',
        alert: 'End date cannot be before start date.',
      },
      {
        key: 'endTime' as const,
        label: 'End time',
        typed: '07:00',
        alert: 'End time must be after start time.',
      },
    ];

    invertedRangeScenarios.forEach(({ key, label, typed, alert }) => {
      it(`should block the submit of an inverted ${key} when the slot omits the date and time section`, async () => {
        const onEventsChange = spy();

        await expect(async () => {
          const { user } = renderWithSlot(
            { eventDialogGeneralTab: createRangeField(key, label) },
            { onEventsChange },
          );

          const input = screen.getByRole('textbox', { name: label });
          await user.clear(input);
          await user.type(input, typed);
          await user.click(screen.getByRole('button', { name: 'Save' }));
        }).toWarnDev([
          `MUI X Scheduler: The date range is invalid but no field of the event dialog validates the "${key}" field.`,
        ]);

        expect(onEventsChange.callCount).to.equal(0);
        expect(screen.getByRole('alert')).to.have.text(alert);
      });
    });

    async function submitInvertedRange(user: ReturnType<typeof render>['user']) {
      const endDateInput = screen.getByLabelText(/end date/i);
      await user.clear(endDateInput);
      await user.type(endDateInput, '2025-05-20');
      await user.click(screen.getByRole('button', { name: 'Save' }));
      expect(screen.getByRole('alert')).to.have.text('End date cannot be before start date.');
    }

    it('should clear the range error when the range is fixed through the start date', async () => {
      const { user } = renderWithSlot({}, { onEventsChange: () => {} });
      await submitInvertedRange(user);

      // Fixing the range through the other field must also clear the error.
      const startDateInput = screen.getByLabelText(/start date/i);
      await user.clear(startDateInput);
      await user.type(startDateInput, '2025-05-19');
      expect(screen.queryByRole('alert')).to.equal(null);
    });

    it('should clear the range error when the all-day switch is toggled', async () => {
      const { user } = renderWithSlot({}, { onEventsChange: () => {} });
      await submitInvertedRange(user);

      await user.click(screen.getByRole('switch', { name: /all day/i }));
      expect(screen.queryByRole('alert')).to.equal(null);
    });

    it('should block the submit of an unparseable date from a custom field', async () => {
      const onEventsChange = spy();

      await expect(async () => {
        const { user } = renderWithSlot(
          { eventDialogGeneralTab: createRangeField('endDate', 'End date') },
          { onEventsChange },
        );
        const endDateInput = screen.getByRole('textbox', { name: 'End date' });
        await user.clear(endDateInput);
        await user.type(endDateInput, 'tomorrow');
        await user.click(screen.getByRole('button', { name: 'Save' }));
      }).toWarnDev([
        'MUI X Scheduler: The value cannot be parsed into a date but no field of the event dialog validates the "endDate" field.',
      ]);

      expect(onEventsChange.callCount).to.equal(0);
      expect(screen.getByRole('alert')).to.have.text('Enter a valid date.');
    });

    it('should block the submit of an emptied time from a custom field', async () => {
      const onEventsChange = spy();

      await expect(async () => {
        const { user } = renderWithSlot(
          { eventDialogGeneralTab: createRangeField('endTime', 'End time') },
          { onEventsChange },
        );
        await user.clear(screen.getByRole('textbox', { name: 'End time' }));
        await user.click(screen.getByRole('button', { name: 'Save' }));
      }).toWarnDev([
        'MUI X Scheduler: The value cannot be parsed into a date but no field of the event dialog validates the "endTime" field.',
      ]);

      expect(onEventsChange.callCount).to.equal(0);
      expect(screen.getByRole('alert')).to.have.text('Enter a valid time.');
    });

    it('should show the invalid-date error on the mounted start field without warning', async () => {
      const onEventsChange = spy();
      // A sibling section empties the built-in key; the mounted date and time
      // section must surface the error itself.
      function StartDateClearer() {
        const startDate = useEventDialogFormField('startDate');
        return (
          <React.Fragment>
            <EventDialogDateTimeSection />
            <button type="button" onClick={() => startDate.setValue('')}>
              Clear start date
            </button>
          </React.Fragment>
        );
      }
      const { user } = renderWithSlot(
        { eventDialogGeneralTab: StartDateClearer },
        { onEventsChange },
      );

      await user.click(screen.getByRole('button', { name: 'Clear start date' }));
      // The native `required` on the section's input already blocks a UI submit,
      // so exercise the programmatic path that reaches the form contract.
      fireEvent.submit(screen.getByRole('button', { name: 'Save' }).closest('form')!);
      await screen.findAllByRole('alert');

      expect(onEventsChange.callCount).to.equal(0);
      const alerts = screen.getAllByRole('alert').map((alert) => alert.textContent);
      expect(alerts).to.deep.equal(['Enter a valid date.']);
    });

    it('should ignore the time fields of an all-day event when validating', async () => {
      const onEventsChange = spy();
      function TimeClearer() {
        const startTime = useEventDialogFormField('startTime');
        return (
          <React.Fragment>
            <EventDialogDateTimeSection />
            <button type="button" onClick={() => startTime.setValue('')}>
              Clear start time
            </button>
          </React.Fragment>
        );
      }
      const { user } = renderWithSlot({ eventDialogGeneralTab: TimeClearer }, { onEventsChange });

      await user.click(screen.getByRole('button', { name: 'Clear start time' }));
      await user.click(screen.getByRole('switch', { name: /all day/i }));
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(onEventsChange.callCount).to.equal(1);
    });

    it('should keep a custom required-resource message over the generic one', async () => {
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

      function CustomResourceField() {
        const resourceField = useEventDialogFormField('resourceIds', {
          validate: (value) => (value.length > 0 ? null : 'Pick at least one room'),
        });
        return resourceField.error ? <p role="alert">{resourceField.error}</p> : null;
      }

      const { user } = renderWithSlot(
        { eventDialogGeneralTab: CustomResourceField },
        { events: [noResourceEvent], shouldEventRequireResource: true, onEventsChange },
        noResourceOccurrence,
      );
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(onEventsChange.callCount).to.equal(0);
      expect(screen.getByRole('alert')).to.have.text('Pick at least one room');
    });

    it('should recover the dialog when a validator throws', async () => {
      const onEventsChange = spy();
      function ThrowingSection() {
        useEventDialogFormField('client', {
          defaultValue: '',
          validate: () => {
            throw new Error('validator exploded');
          },
        });
        return null;
      }
      const { user } = renderWithSlot(
        { eventDialogGeneralTab: ThrowingSection },
        { onEventsChange },
      );

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await expect(() => user.click(saveButton)).toWarnDev([
        'MUI X Scheduler: A form field validator threw or rejected during the submit.',
      ]);

      expect(onEventsChange.callCount).to.equal(0);
      // The dialog stays usable: the pending state is released.
      expect(saveButton).not.to.have.attribute('disabled');
    });

    it('should store the generic range error when a registered validator passes', async () => {
      const onEventsChange = spy();
      const { user } = renderWithSlot(
        { eventDialogGeneralTab: createRangeField('endDate', 'End date', () => null) },
        { onEventsChange },
      );

      const endDateInput = screen.getByRole('textbox', { name: 'End date' });
      await user.clear(endDateInput);
      await user.type(endDateInput, '2025-05-20');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(onEventsChange.callCount).to.equal(0);
      expect(screen.getByRole('alert')).to.have.text('End date cannot be before start date.');
    });

    it('should keep the first registered failing validator message for a shared key', async () => {
      const onEventsChange = spy();
      function CustomEndDateValidator() {
        useEventDialogFormField('endDate', {
          validate: () => 'Must stay within the project period',
        });
        return null;
      }
      function SectionPlusCustomValidator() {
        return (
          <React.Fragment>
            <CustomEndDateValidator />
            <EventDialogDateTimeSection />
          </React.Fragment>
        );
      }
      const { user } = renderWithSlot(
        { eventDialogGeneralTab: SectionPlusCustomValidator },
        { onEventsChange },
      );

      const endDateInput = screen.getByLabelText(/end date/i);
      await user.clear(endDateInput);
      await user.type(endDateInput, '2025-05-20');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(onEventsChange.callCount).to.equal(0);
      // Effects register in tree order, so the earlier sibling's validator wins.
      expect(screen.getByRole('alert')).to.have.text('Must stay within the project period');
    });

    it('should mark the date and time inputs required', () => {
      renderWithSlot({});

      // The native semantics back the empty-field contract for UI submits.
      expect(screen.getByLabelText(/start date/i)).to.have.attribute('required');
      expect(screen.getByLabelText(/start time/i)).to.have.attribute('required');
      expect(screen.getByLabelText(/end date/i)).to.have.attribute('required');
      expect(screen.getByLabelText(/end time/i)).to.have.attribute('required');
    });

    it('should keep a more specific validator message over the generic range error', async () => {
      const onEventsChange = spy();
      const { user } = renderWithSlot(
        {
          eventDialogGeneralTab: createRangeField(
            'endDate',
            'End date',
            () => 'Must stay within the project period',
          ),
        },
        { onEventsChange },
      );

      const endDateInput = screen.getByRole('textbox', { name: 'End date' });
      await user.clear(endDateInput);
      await user.type(endDateInput, '2025-05-20');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(onEventsChange.callCount).to.equal(0);
      expect(screen.getByRole('alert')).to.have.text('Must stay within the project period');
    });

    it('should keep a section rendered twice in sync through the shared form store', async () => {
      function DuplicatedSections() {
        return (
          <React.Fragment>
            <EventDialogDescriptionSection />
            <EventDialogDescriptionSection />
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

    it('should keep the DOM ids unique when a section is rendered twice', () => {
      function DuplicatedSections() {
        return (
          <React.Fragment>
            <EventDialogDateTimeSection />
            <EventDialogDateTimeSection />
            <EventDialogResourceAndColorSection />
            <EventDialogResourceAndColorSection />
          </React.Fragment>
        );
      }
      renderWithSlot({ eventDialogGeneralTab: DuplicatedSections });

      const switches = screen.getAllByRole('switch', { name: /all day/i });
      expect(switches.length).to.equal(2);
      expect(switches[0].id).not.to.equal(switches[1].id);

      // Each resource select must be labelled by its own label element, not the other
      // instance's — duplicate label ids would make both resolve to the first one.
      const selects = screen.getAllByRole('combobox', { name: 'Resource' });
      expect(selects.length).to.equal(2);
      const labelIds = selects.map((select) => select.getAttribute('aria-labelledby'));
      expect(labelIds[0]).not.to.equal(labelIds[1]);
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

      it('should disable the Save button while the submission is pending', async () => {
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
          { onEventsChange: () => {} },
        );

        const saveButton = screen.getByRole('button', { name: 'Save' });
        await user.click(saveButton);
        expect(saveButton).to.have.attribute('disabled');
        // A delete during the pending submit would race the resolving update.
        expect(screen.getByRole('button', { name: 'Delete event' })).to.have.attribute('disabled');

        await act(async () => deferred.resolve(null));
        expect(saveButton).not.to.have.attribute('disabled');
      });

      it('should re-enable the buttons when the async validation fails', async () => {
        const deferred = createDeferred();
        function AsyncValidatedSection() {
          const client = useEventDialogFormField<string>('client', {
            defaultValue: 'Acme',
            validate: () => deferred.promise,
          });
          return client.error ? <p role="alert">{client.error}</p> : null;
        }
        const { user } = renderWithSlot(
          { eventDialogGeneralTab: AsyncValidatedSection },
          { onEventsChange: () => {} },
        );

        const saveButton = screen.getByRole('button', { name: 'Save' });
        await user.click(saveButton);
        expect(saveButton).to.have.attribute('disabled');

        await act(async () => deferred.resolve('Nope' as never));

        expect(screen.getByRole('alert')).to.have.text('Nope');
        expect(saveButton).not.to.have.attribute('disabled');
        expect(screen.getByRole('button', { name: 'Delete event' })).not.to.have.attribute(
          'disabled',
        );
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
        // The pending submit disables the button, so a second press can only come
        // from another submit path; the ref still guards that re-entry.
        fireEvent.submit(saveButton.closest('form')!);
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

    it('should map the start fields and the end fields to their own event property', () => {
      render(
        <EventCalendarProvider
          events={[DEFAULT_EVENT]}
          resources={resources}
          eventModelStructure={{ start: { getter: (event) => event.start } }}
        >
          <EventDialogContent open {...defaultProps} />
        </EventCalendarProvider>,
      );

      expect(screen.getByLabelText(/start date/i)).to.have.attribute('readonly');
      expect(screen.getByLabelText(/start time/i)).to.have.attribute('readonly');
      expect(screen.getByLabelText(/end date/i)).not.to.have.attribute('readonly');
      expect(screen.getByLabelText(/end time/i)).not.to.have.attribute('readonly');
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

    it('should mark the resource select read-only but keep the color picker enabled when only the resource property has no setter', () => {
      render(
        <EventCalendarProvider
          events={[DEFAULT_EVENT]}
          resources={resources}
          eventModelStructure={{ resource: { getter: (event) => event.resource } }}
        >
          <EventDialogContent open {...defaultProps} />
        </EventCalendarProvider>,
      );

      expect(screen.getByRole('combobox', { name: 'Resource' })).to.have.attribute(
        'aria-readonly',
        'true',
      );
      expect(screen.getByRole('group', { name: 'Event color' })).not.to.have.attribute(
        'data-disabled',
      );
    });

    it('should expose the resolved read-only state on the public field hook', () => {
      function ReadOnlyProbe() {
        const color = useEventDialogFormField('color');
        const custom = useEventDialogFormField('room');
        return <span data-testid="read-only-probe">{`${color.readOnly}:${custom.readOnly}`}</span>;
      }
      render(
        <EventCalendarProvider
          events={[DEFAULT_EVENT]}
          resources={resources}
          eventModelStructure={{ color: { getter: (event) => event.color } }}
        >
          <SchedulerSlotsProvider
            slots={{ eventDialogGeneralTab: ReadOnlyProbe }}
            slotProps={undefined}
          >
            <EventDialogContent open {...defaultProps} />
          </SchedulerSlotsProvider>
        </EventCalendarProvider>,
      );

      expect(screen.getByTestId('read-only-probe').textContent).to.equal('true:false');
    });

    it('should disable the color picker but keep the resource select writable when only the color property has no setter', () => {
      render(
        <EventCalendarProvider
          events={[DEFAULT_EVENT]}
          resources={resources}
          eventModelStructure={{ color: { getter: (event) => event.color } }}
        >
          <EventDialogContent open {...defaultProps} />
        </EventCalendarProvider>,
      );

      expect(screen.getByRole('group', { name: 'Event color' })).to.have.attribute('data-disabled');
      expect(screen.getByRole('combobox', { name: 'Resource' })).not.to.have.attribute(
        'aria-readonly',
      );
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
