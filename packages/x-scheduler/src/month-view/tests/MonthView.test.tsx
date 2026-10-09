import { config } from 'react-transition-group';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import type { AnyEventCalendarStore } from 'test/utils/scheduler';
import {
  adapter,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  EventBuilder,
  getAllEventsByTitle,
  ResourceBuilder,
  SchedulerStoreRunner,
  withinEventCalendarToolbar,
} from 'test/utils/scheduler';
import { act, screen, within, waitFor } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import { SchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { MonthView } from '@mui/x-scheduler/month-view';
import { vi, describe, it, expect } from 'vitest';
import { EventCalendarProvider } from '../../internals/components/EventCalendarProvider';
import { EventCalendar, eventCalendarClasses } from '../../event-calendar';
import { EventDialogProvider } from '../../internals/components/event-dialog';

describe('<MonthView />', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-05-01') });

  const events = [
    EventBuilder.new().startAt('2025-05-01T09:00:00Z').title('Meeting').build(),
    EventBuilder.new().startAt('2025-05-15T14:00:00Z').title('Doctor Appointment').build(),
  ];

  const standaloneDefaults = {
    events,
    resources: [],
  };

  const manyEvents = [
    EventBuilder.new().singleDay('2025-05-01T08:00:00Z').title('Event 1').build(),
    EventBuilder.new().singleDay('2025-05-01T09:00:00Z').title('Event 2').build(),
    EventBuilder.new().singleDay('2025-05-01T10:00:00Z').title('Event 3').build(),
    EventBuilder.new().singleDay('2025-05-01T11:00:00Z').title('Event 4').build(),
    EventBuilder.new().singleDay('2025-05-01T12:00:00Z').title('Event 5').build(),
    EventBuilder.new().singleDay('2025-05-01T13:00:00Z').title('Event 6').build(),
  ];

  const nextDayEvents = [
    EventBuilder.new().singleDay('2025-05-02T08:00:00Z').title('Next day 1').build(),
    EventBuilder.new().singleDay('2025-05-02T09:00:00Z').title('Next day 2').build(),
    EventBuilder.new().singleDay('2025-05-02T10:00:00Z').title('Next day 3').build(),
    EventBuilder.new().singleDay('2025-05-02T11:00:00Z').title('Next day 4').build(),
  ];

  it('should render the weekday headers, a cell for each day, and show the abbreviated month for day 1', () => {
    render(
      <EventCalendarProvider {...standaloneDefaults}>
        <EventDialogProvider>
          <MonthView />
        </EventDialogProvider>
      </EventCalendarProvider>,
    );
    const headerTexts = screen.getAllByRole('columnheader').map((header) => header.textContent);
    const gridCells = screen.getAllByRole('gridcell');

    expect(headerTexts).to.include.members(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    expect(gridCells.length).to.be.at.least(31);
    expect(screen.getByText(/may 1/i)).not.to.equal(null);
  });

  it('should render events in the correct cell', () => {
    render(
      <EventCalendarProvider {...standaloneDefaults}>
        <EventDialogProvider>
          <MonthView />
        </EventDialogProvider>
      </EventCalendarProvider>,
    );

    const gridCells = screen.getAllByRole('gridcell');
    const may1Cell = gridCells.find((cell) => within(cell).queryByText(/may 1/i));
    const may15Cell = gridCells.find((cell) => within(cell).queryByText(/15/));

    expect(within(may1Cell!).getByText('Meeting')).not.to.equal(null);
    expect(within(may15Cell!).getByText('Doctor Appointment')).not.to.equal(null);
  });

  it('should move to the day view when a day is clicked', async () => {
    const handleViewChange = vi.fn();
    const handleVisibleDateChange = vi.fn();
    const { user } = render(
      <EventCalendarProvider
        {...standaloneDefaults}
        onViewChange={handleViewChange}
        onVisibleDateChange={handleVisibleDateChange}
      >
        <EventDialogProvider>
          <MonthView />
        </EventDialogProvider>
      </EventCalendarProvider>,
    );
    const button = screen.getByRole('button', { name: '15' });
    await user.click(button);

    expect(handleViewChange.mock.calls.length).to.equal(1);
    expect(handleViewChange.mock.calls[0][0]).to.equal('day');
    expect(handleVisibleDateChange.mock.calls.length).to.equal(1);
    expect(handleVisibleDateChange.mock.calls[0][0]).toEqualDateTime(
      adapter.date('2025-05-15T00:00:00Z', 'default'),
    );
  });

  it('should render day numbers as plain text when the day view is not enabled', () => {
    render(
      <EventCalendarProvider {...standaloneDefaults} views={['week', 'month']}>
        <EventDialogProvider>
          <MonthView />
        </EventDialogProvider>
      </EventCalendarProvider>,
    );
    expect(screen.queryByRole('button', { name: '15' })).to.equal(null);
    expect(screen.getByText('15')).not.to.equal(null);
  });

  it('should show "+N more..." when there are more events than fit in a cell', () => {
    render(
      <EventCalendarProvider events={manyEvents} resources={[]}>
        <EventDialogProvider>
          <MonthView />
        </EventDialogProvider>
      </EventCalendarProvider>,
    );
    expect(screen.getByText(/more/i)).not.to.equal(null);
  });

  describe('Event keyboard accessibility in "more events" popover', () => {
    async function renderAndOpenPopover({
      theme,
      ...providerProps
    }: Partial<React.ComponentProps<typeof EventCalendarProvider>> & { theme?: Theme } = {}) {
      const calendar = (
        <EventCalendarProvider events={manyEvents} resources={[]} {...providerProps}>
          <EventDialogProvider>
            <MonthView />
          </EventDialogProvider>
        </EventCalendarProvider>
      );
      // The theme goes in a wrapper so `setProps` still reaches the calendar provider.
      const { user, setProps } = render(calendar, {
        wrapper: theme
          ? ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>
          : undefined,
      });
      // The first "+N more" button is May 1st's.
      const [moreButton] = await screen.findAllByRole('button', { name: /more/i });
      await user.click(moreButton);
      const popover = await screen.findByRole('presentation');
      return { user, setProps, popover };
    }

    // Feeds `onEventsChange` back into `events`, so a delete actually removes the event.
    async function renderAndOpenStatefulPopover(initialEvents = manyEvents) {
      let applyChange: (events: object[]) => void = () => {};
      const { setProps, ...other } = await renderAndOpenPopover({
        events: initialEvents,
        onEventsChange: (events) => applyChange(events),
      });
      applyChange = (events) => setProps({ events });

      // Opens the context menu with Space, like a keyboard user would.
      async function openMenu(title: string) {
        await act(async () => {
          getPopoverEvent(other.popover, title).focus();
        });
        await other.user.keyboard(' ');
        await screen.findByRole('menu');
      }

      async function deleteEvent(title: string) {
        await openMenu(title);
        await other.user.click(screen.getByRole('menuitem', { name: /delete/i }));
      }

      return { setProps, openMenu, deleteEvent, ...other };
    }

    function getPopoverEvent(popover: HTMLElement, title: string) {
      return within(popover).getByRole('button', { name: new RegExp(`^${title},`) });
    }

    function getMoreButtonLabels() {
      return screen
        .queryAllByRole('button', { name: /more/i, hidden: true })
        .map((button) => button.textContent);
    }

    function getMay1Cell() {
      return screen.getAllByRole('gridcell').find((cell) => within(cell).queryByText(/may 1/i));
    }

    function getPopoverEventTitles(popover: HTMLElement) {
      return within(popover)
        .getAllByRole('button')
        .map((button) => button.getAttribute('aria-label')!.split(',')[0]);
    }

    it('should have tabindex and role="button" on events in the popover', async () => {
      const { popover } = await renderAndOpenPopover();

      const eventButtons = within(popover).getAllByRole('button');
      expect(eventButtons.length).to.be.greaterThan(0);

      eventButtons.forEach((button) => {
        expect(button).to.have.attribute('tabindex', '0');
        expect(button).to.have.attribute('role', 'button');
      });
    });

    it('should allow Enter key to activate events in the popover', async () => {
      const { user, popover } = await renderAndOpenPopover();

      const firstEventButton = within(popover).getAllByRole('button')[0];
      firstEventButton.focus();
      expect(firstEventButton).to.equal(document.activeElement);

      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.to.equal(null);
      });
    });

    it('should open the event context menu on Space, and Edit from there activates the event', async () => {
      const { user, popover } = await renderAndOpenPopover();

      const firstEventButton = within(popover).getAllByRole('button')[0];
      firstEventButton.focus();
      expect(firstEventButton).to.equal(document.activeElement);

      await user.keyboard(' ');

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.to.equal(null);
      });
      expect(screen.queryByRole('dialog')).to.equal(null);

      await user.click(screen.getByRole('menuitem', { name: /edit/i }));

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.to.equal(null);
      });
    });

    it('should name each event in the popover with its title, time range and date', async () => {
      const { popover } = await renderAndOpenPopover();

      const eventButtons = within(popover).getAllByRole('button');

      expect(eventButtons.map((button) => button.getAttribute('aria-label'))).to.deep.equal([
        'Event 1, 8:00 AM to 9:00 AM, Thursday, May 1st, 2025',
        'Event 2, 9:00 AM to 10:00 AM, Thursday, May 1st, 2025',
        'Event 3, 10:00 AM to 11:00 AM, Thursday, May 1st, 2025',
        'Event 4, 11:00 AM to 12:00 PM, Thursday, May 1st, 2025',
        'Event 5, 12:00 PM to 1:00 PM, Thursday, May 1st, 2025',
        'Event 6, 1:00 PM to 2:00 PM, Thursday, May 1st, 2025',
      ]);
      eventButtons.forEach((button) => {
        expect(button).not.to.have.attribute('aria-labelledby');
      });
    });

    it('should close the popover when `onEventEditingStart` cancels an activation from it', async () => {
      const onEventEditingStart = vi.fn((_occurrence: any, eventDetails: any) =>
        eventDetails.cancel(),
      );
      const { user, popover } = await renderAndOpenPopover({ onEventEditingStart });

      const firstEventButton = within(popover).getAllByRole('button')[0];
      await user.click(firstEventButton);

      expect(onEventEditingStart.mock.calls.length).to.equal(1);
      expect(screen.queryByRole('dialog')).to.equal(null);
      await waitFor(() => {
        expect(document.body.contains(popover)).to.equal(false);
      });

      expect(firstEventButton.isConnected).to.equal(false);
      const moreButton = screen.getByRole('button', { name: /more/i });
      expect(onEventEditingStart.mock.lastCall?.[1].trigger).to.equal(firstEventButton);
      expect(onEventEditingStart.mock.lastCall?.[1].anchor).to.equal(moreButton);
      expect(moreButton.isConnected).to.equal(true);
    });

    it('should keep the "+N more" button as `anchor` when the cancellation comes from the armed toolbar', async () => {
      // A coarse pointer arms first instead of opening the dialog, so the callback only fires
      // on the toolbar's Edit — after the popover item became the built-in toolbar's anchor.
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = (() =>
        ({
          matches: true,
          addEventListener: () => {},
          removeEventListener: () => {},
        }) as any) as any;
      try {
        const onEventEditingStart = vi.fn((_occurrence: any, eventDetails: any) =>
          eventDetails.cancel(),
        );
        const { user, popover } = await renderAndOpenPopover({ onEventEditingStart });

        const firstEventButton = within(popover).getAllByRole('button')[0];
        await user.click(firstEventButton);
        expect(onEventEditingStart.mock.calls.length).to.equal(0);

        const editButton = screen.getByRole('button', { name: 'Edit event' });
        await user.click(editButton);

        expect(onEventEditingStart.mock.calls.length).to.equal(1);
        await waitFor(() => {
          expect(document.body.contains(popover)).to.equal(false);
        });

        expect(firstEventButton.isConnected).to.equal(false);
        const moreButton = screen.getByRole('button', { name: /more/i });
        expect(onEventEditingStart.mock.lastCall?.[1].trigger).to.equal(editButton);
        expect(onEventEditingStart.mock.lastCall?.[1].anchor).to.equal(moreButton);
        expect(moreButton.isConnected).to.equal(true);
      } finally {
        window.matchMedia = originalMatchMedia;
      }
    });

    it('should stay open while editing and close once the editing surface closes', async () => {
      const { user, popover } = await renderAndOpenPopover();

      // Activating an event opens the editing dialog; the popover stays open behind it.
      const firstEventButton = within(popover).getAllByRole('button')[0];
      await user.click(firstEventButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.to.equal(null);
      });
      expect(document.body.contains(popover)).to.equal(true);

      // Closing the editing surface clears the store editing state, which closes the popover with it.
      const dialog = screen.getByRole('dialog');
      await user.click(within(dialog).getByRole('button', { name: /close/i }));

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).to.equal(null);
      });
      await waitFor(() => {
        expect(document.body.contains(popover)).to.equal(false);
      });
    });

    it('should return focus to the trigger when the editing dialog is submitted', async () => {
      const onEventsChange = vi.fn();
      const { user, popover } = await renderAndOpenPopover({ onEventsChange });

      const firstEventButton = within(popover).getAllByRole('button')[0];
      await user.click(firstEventButton);
      await screen.findByRole('dialog');

      // Typed into the title field rather than sent to whatever holds focus, which the dialog's
      // focus trap settles at different moments across React versions.
      const titleInput = await screen.findByLabelText(/event title/i);
      await user.type(titleInput, '{Enter}');

      // The dialog closing is only meaningful if the form actually submitted.
      await waitFor(() => {
        expect(onEventsChange.mock.calls.length).to.equal(1);
      });
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).to.equal(null);
      });

      // The popover closes with the editing surface, taking the focused event with it.
      await waitFor(() => {
        expect(document.body.contains(popover)).to.equal(false);
      });

      // Focus has to land back on the calendar, or the next Tab goes to the browser chrome.
      await waitFor(() => {
        expect(document.activeElement).to.equal(screen.getByRole('button', { name: /more/i }));
      });
    });

    it('should return focus to the day cell when the trigger is gone by the time the dialog is submitted', async () => {
      // Emptying the day on submit unmounts the "+N more" button. Assigned after the render
      // because it needs `setProps`.
      let emptyTheDay = () => {};
      const { user, setProps, popover } = await renderAndOpenPopover({
        onEventsChange: () => emptyTheDay(),
      });
      emptyTheDay = () => setProps({ events: manyEvents.slice(0, 1) });

      const firstEventButton = within(popover).getAllByRole('button')[0];
      await user.click(firstEventButton);
      await screen.findByRole('dialog');

      const titleInput = await screen.findByLabelText(/event title/i);
      await user.type(titleInput, '{Enter}');

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /more/i })).to.equal(null);
      });
      await waitFor(() => {
        expect(document.body.contains(popover)).to.equal(false);
      });

      const may1Cell = screen
        .getAllByRole('gridcell')
        .find((cell) => within(cell).queryByText(/may 1/i));
      await waitFor(() => {
        expect(document.activeElement).to.equal(may1Cell);
      });
    });

    it('should leave focus alone when it moved out of the popover while it was closing', async () => {
      // Re-enable transitions and force a duration: the popover's `auto` duration measures 0 in
      // jsdom, and the exit has to last long enough to move focus while it plays.
      config.disabled = false;
      const { user, popover } = await renderAndOpenPopover({
        theme: createTheme({
          components: { MuiPopover: { defaultProps: { transitionDuration: 300 } } },
        }),
      });

      await user.keyboard('{Escape}');

      // The popover is on its way out but still mounted, and its focus trap is already released.
      expect(document.body.contains(popover), 'the popover exited too fast to move focus').to.equal(
        true,
      );
      const movedTo = screen.getByRole('button', { name: '15' });
      await act(async () => {
        movedTo.focus();
      });

      await waitFor(() => {
        expect(document.body.contains(popover)).to.equal(false);
      });
      expect(document.activeElement).to.equal(movedTo);
    });

    it('should stop listing an event once it is deleted from the popover', async () => {
      const { popover, deleteEvent } = await renderAndOpenStatefulPopover();

      await deleteEvent('Event 3');

      await waitFor(() => {
        expect(getPopoverEventTitles(popover)).to.deep.equal([
          'Event 1',
          'Event 2',
          'Event 4',
          'Event 5',
          'Event 6',
        ]);
      });
      expect(document.body.contains(popover)).to.equal(true);
    });

    it('should move focus to the next event after deleting one from the popover', async () => {
      const { popover, deleteEvent } = await renderAndOpenStatefulPopover();

      await deleteEvent('Event 3');

      await waitFor(() => {
        expect(document.activeElement).to.equal(
          within(popover).getByRole('button', { name: /^Event 4,/ }),
        );
      });
    });

    it('should move focus to the previous event after deleting the last one from the popover', async () => {
      const { popover, deleteEvent } = await renderAndOpenStatefulPopover();

      await deleteEvent('Event 6');

      await waitFor(() => {
        expect(document.activeElement).to.equal(
          within(popover).getByRole('button', { name: /^Event 5,/ }),
        );
      });
    });

    it('should close the popover and focus the day cell once every event fits in it', async () => {
      const { popover, deleteEvent } = await renderAndOpenStatefulPopover();

      // How many events fit in a cell depends on its measured height, which differs between
      // jsdom and the browser. `hidden` because the open popover hides the page from queries.
      while (screen.queryByRole('button', { name: /more/i, hidden: true })) {
        // eslint-disable-next-line no-await-in-loop
        await deleteEvent(getPopoverEventTitles(popover).at(-1)!);
      }

      await waitFor(() => {
        expect(document.body.contains(popover)).to.equal(false);
      });

      await waitFor(() => {
        expect(document.activeElement).to.equal(getMay1Cell());
      });
    });

    it('should move focus to the next event when the focused event is removed', async () => {
      const { popover, setProps } = await renderAndOpenStatefulPopover();
      await act(async () => {
        getPopoverEvent(popover, 'Event 3').focus();
      });

      setProps({ events: manyEvents.filter((event) => event.title !== 'Event 3') });

      await waitFor(() => {
        expect(document.activeElement).to.equal(getPopoverEvent(popover, 'Event 4'));
      });
    });

    it('should not move focus when an event is removed while the popover itself is focused', async () => {
      const { popover, setProps } = await renderAndOpenStatefulPopover();
      const paper = popover.querySelector(
        `.${eventCalendarClasses.moreEventsPopoverBody}`,
      )!.parentElement!;
      await act(async () => {
        paper.focus();
      });

      setProps({ events: manyEvents.filter((event) => event.title !== 'Event 3') });

      await waitFor(() => {
        expect(getPopoverEventTitles(popover)).not.to.include('Event 3');
      });
      expect(document.activeElement).to.equal(paper);
    });

    // jsdom doesn't lay out the page, so every position is the same.
    it.skipIf(isJSDOM)(
      'should keep the popover in place while it closes once every event fits in the cell',
      async () => {
        const { popover, deleteEvent } = await renderAndOpenStatefulPopover();
        const paper = popover.querySelector(
          `.${eventCalendarClasses.moreEventsPopoverBody}`,
        )!.parentElement!;
        const getPosition = () => `${paper.style.top} ${paper.style.left}`;
        // The popover moves while the list shrinks, so only the closing delete is checked.
        let positionBeforeDelete = getPosition();
        let positions: string[] = [];
        const observer = new MutationObserver(() => {
          positions.push(getPosition());
        });
        observer.observe(paper, { attributes: true, attributeFilter: ['style'] });

        try {
          while (screen.queryByRole('button', { name: /more/i, hidden: true })) {
            positionBeforeDelete = getPosition();
            positions = [];
            // eslint-disable-next-line no-await-in-loop
            await deleteEvent(getPopoverEventTitles(popover).at(-1)!);
          }
          await waitFor(() => {
            expect(document.body.contains(popover)).to.equal(false);
          });
        } finally {
          observer.disconnect();
        }

        expect(positions).to.deep.equal(positions.map(() => positionBeforeDelete));
      },
    );

    it('should move focus past every removed event when several are removed at once', async () => {
      const { popover, setProps } = await renderAndOpenStatefulPopover();
      await act(async () => {
        getPopoverEvent(popover, 'Event 4').focus();
      });

      setProps({
        events: manyEvents.filter(
          (event) => event.title !== 'Event 1' && event.title !== 'Event 4',
        ),
      });

      await waitFor(() => {
        expect(document.activeElement).to.equal(getPopoverEvent(popover, 'Event 5'));
      });
    });

    it('should move focus past every removed event when several are removed under an open context menu', async () => {
      const { popover, setProps, openMenu } = await renderAndOpenStatefulPopover();
      await openMenu('Event 4');

      setProps({
        events: manyEvents.filter(
          (event) => event.title !== 'Event 1' && event.title !== 'Event 4',
        ),
      });

      await waitFor(() => {
        expect(screen.queryByRole('menu')).to.equal(null);
      });
      await waitFor(() => {
        expect(document.activeElement).to.equal(getPopoverEvent(popover, 'Event 5'));
      });
    });

    it('should open the popover in the document the calendar is rendered in', async () => {
      const iframe = document.createElement('iframe');
      iframe.style.width = '1000px';
      iframe.style.height = '800px';
      document.body.appendChild(iframe);
      const iframeBody = iframe.contentDocument!.body;
      const { unmount } = render(
        <EventCalendarProvider events={manyEvents} resources={[]}>
          <EventDialogProvider>
            <MonthView />
          </EventDialogProvider>
        </EventCalendarProvider>,
        { container: iframeBody.appendChild(iframe.contentDocument!.createElement('div')) },
      );

      try {
        const [moreButton] = await within(iframeBody).findAllByRole('button', { name: /more/i });
        await act(async () => {
          moreButton.click();
        });

        expect(await within(iframeBody).findByRole('presentation')).not.to.equal(null);
      } finally {
        unmount();
        iframe.remove();
      }
    });

    it('should not move focus when an event is removed while another one is focused', async () => {
      const { popover, setProps } = await renderAndOpenStatefulPopover();
      const firstEvent = getPopoverEvent(popover, 'Event 1');
      await act(async () => {
        firstEvent.focus();
      });

      setProps({ events: manyEvents.filter((event) => event.title !== 'Event 3') });

      await waitFor(() => {
        expect(getPopoverEventTitles(popover)).not.to.include('Event 3');
      });
      expect(document.activeElement).to.equal(firstEvent);
    });

    it('should ignore changes to the events of another day that still overflows', async () => {
      const { popover, setProps } = await renderAndOpenStatefulPopover([
        ...manyEvents,
        ...nextDayEvents,
      ]);
      const labelsBefore = getMoreButtonLabels();

      setProps({ events: [...manyEvents, ...nextDayEvents.slice(1)] });

      await waitFor(() => {
        expect(getMoreButtonLabels()).not.to.deep.equal(labelsBefore);
      });
      expect(getMoreButtonLabels()).to.have.length(2);
      expect(getPopoverEventTitles(popover)).to.deep.equal([
        'Event 1',
        'Event 2',
        'Event 3',
        'Event 4',
        'Event 5',
        'Event 6',
      ]);
    });

    it('should ignore the "+N more" button of another day unmounting', async () => {
      const { popover, setProps } = await renderAndOpenStatefulPopover([
        ...manyEvents,
        ...nextDayEvents,
      ]);
      const labelsBefore = getMoreButtonLabels();

      // One event left, so the next day's "+N more" button unmounts.
      setProps({ events: [...manyEvents, ...nextDayEvents.slice(3)] });

      await waitFor(() => {
        expect(getMoreButtonLabels()).not.to.deep.equal(labelsBefore);
      });
      expect(document.body.contains(popover)).to.equal(true);
      expect(getPopoverEventTitles(popover)).to.deep.equal([
        'Event 1',
        'Event 2',
        'Event 3',
        'Event 4',
        'Event 5',
        'Event 6',
      ]);
    });

    it('should not focus an event when the popover is reopened for another day', async () => {
      const { user } = await renderAndOpenPopover({
        events: [...manyEvents, ...nextDayEvents],
      });
      // Reopened right away, while the previous popover is still on its way out.
      await user.keyboard('{Escape}');
      const nextDayMoreButton = screen.getAllByRole('button', { name: /more/i })[1];
      // Some browsers (Safari) don't focus a button on click, so focus stays on the document.
      await act(async () => {
        (document.activeElement as HTMLElement | null)?.blur();
      });
      const focusedElements: Element[] = [];
      const recordFocus = (event: FocusEvent) => {
        focusedElements.push(event.target as Element);
      };
      document.addEventListener('focusin', recordFocus);

      try {
        await act(async () => {
          nextDayMoreButton.click();
        });

        const nextDayPopover = await screen.findByRole('presentation');
        await waitFor(() => {
          expect(nextDayPopover.contains(document.activeElement)).to.equal(true);
        });
        // Not even briefly on an event or the "+N more" button.
        expect(
          focusedElements.filter((element) => !nextDayPopover.contains(element)),
        ).to.deep.equal([]);
        expect(within(nextDayPopover).getAllByRole('button')).not.to.include(
          document.activeElement,
        );
      } finally {
        document.removeEventListener('focusin', recordFocus);
      }
    });

    it('should list an event added to the day while the popover is open', async () => {
      const { popover, setProps } = await renderAndOpenStatefulPopover();

      setProps({
        events: [
          ...manyEvents,
          EventBuilder.new().singleDay('2025-05-01T14:00:00Z').title('Event 7').build(),
        ],
      });

      await waitFor(() => {
        expect(getPopoverEventTitles(popover)).to.include('Event 7');
      });
    });

    it('should move focus to the next event when the event of an open context menu is removed', async () => {
      const { popover, setProps, openMenu } = await renderAndOpenStatefulPopover();
      await openMenu('Event 3');

      setProps({ events: manyEvents.filter((event) => event.title !== 'Event 3') });

      await waitFor(() => {
        expect(screen.queryByRole('menu')).to.equal(null);
      });
      await waitFor(() => {
        expect(document.activeElement).to.equal(getPopoverEvent(popover, 'Event 4'));
      });
    });

    it('should focus the day cell when the popover closes under an open context menu', async () => {
      const { popover, setProps, openMenu } = await renderAndOpenStatefulPopover();
      await openMenu('Event 2');

      setProps({ events: manyEvents.slice(0, 1) });

      await waitFor(() => {
        expect(screen.queryByRole('menu')).to.equal(null);
      });
      await waitFor(() => {
        expect(document.body.contains(popover)).to.equal(false);
      });
      await waitFor(() => {
        expect(document.activeElement).to.equal(getMay1Cell());
      });
    });

    it('should return focus to the trigger when the popover is dismissed without editing', async () => {
      const { user, popover } = await renderAndOpenPopover();

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(document.body.contains(popover)).to.equal(false);
      });
      await waitFor(() => {
        expect(document.activeElement).to.equal(screen.getByRole('button', { name: /more/i }));
      });
    });
  });

  describe('creation placeholder updates', () => {
    it('should not re-fire `onEventEditingStart` when the built-in form updates the creation placeholder', async () => {
      let store: AnyEventCalendarStore | null = null;
      const onEventEditingStart = vi.fn();
      const { user } = render(
        <EventCalendarProvider events={[]} resources={[]} onEventEditingStart={onEventEditingStart}>
          <EventDialogProvider>
            <MonthView />
          </EventDialogProvider>
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext as any}
            onMount={(s) => {
              store = s;
            }}
          />
        </EventCalendarProvider>,
      );

      await user.click(screen.getAllByRole('gridcell')[10]);
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.to.equal(null);
      });
      expect(onEventEditingStart.mock.calls.length).to.equal(1);

      // Mirrors the built-in form pushing a date change into the draft while the dialog is open.
      const placeholder = store!.state.occurrencePlaceholder!;
      await act(async () => {
        store!.setOccurrencePlaceholder({
          ...placeholder,
          end: adapter.addHours(placeholder.end, -1),
        });
      });

      expect(onEventEditingStart.mock.calls.length).to.equal(1);
      expect(screen.queryByRole('dialog')).not.to.equal(null);
    });

    it('should clamp the span of a creation placeholder to each week row', () => {
      // Friday May 9 to Tuesday May 13: two days left in the first week row, three in the next.
      const start = adapter.startOfDay(adapter.date('2025-05-09T00:00:00Z', 'default'));
      const end = adapter.endOfDay(adapter.date('2025-05-13T00:00:00Z', 'default'));

      render(
        <EventCalendarProvider events={[]} resources={[]}>
          <EventDialogProvider>
            <MonthView />
          </EventDialogProvider>
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
        </EventCalendarProvider>,
      );

      const spans = Array.from(
        document.querySelectorAll<HTMLElement>('[style*="--grid-column-span"]'),
      ).map((element) => element.style.getPropertyValue('--grid-column-span'));
      expect(spans).to.deep.equal(['2', '3']);
    });
  });

  describe('All day events', () => {
    const allDayEvents = [
      EventBuilder.new()
        .span('2025-05-05T00:00:00Z', '2025-05-07T23:59:59Z', { allDay: true })
        .title('Multi-day Conference')
        .build(),
      EventBuilder.new()
        .span('2025-04-28T00:00:00Z', '2025-05-06T23:59:59Z', { allDay: true }) // Previos week - Current week
        .title('Long Event')
        .build(),
      EventBuilder.new()
        .span('2025-05-12T00:00:00Z', '2025-05-14T23:59:59Z', { allDay: true })
        .title('Grid Row Test')
        .build(),
      EventBuilder.new()
        .span('2025-05-08T00:00:00Z', '2025-05-10T23:59:59Z', { allDay: true })
        .title('Three Day Event')
        .build(),
      EventBuilder.new()
        .span('2025-05-19T00:00:00Z', '2025-05-27T23:59:59Z', { allDay: true })
        .title('Multiple week event')
        .build(),
    ];

    it('should announce a multi-day timed event as a single date and time range', () => {
      const trip = EventBuilder.new()
        .title('Trip')
        .span('2025-05-05T07:30:00Z', '2025-05-07T17:00:00Z')
        .build();

      render(
        <EventCalendarProvider events={[trip]} resources={[]}>
          <EventDialogProvider>
            <MonthView />
          </EventDialogProvider>
        </EventCalendarProvider>,
      );

      expect(
        screen.getByRole('button', {
          name: 'Trip, From Monday, May 5th, 2025 7:30 AM to Wednesday, May 7th, 2025 5:00 PM',
        }),
      ).not.to.equal(null);
    });

    it('should announce an all-day event as a date range instead of a time range', () => {
      render(
        <EventCalendarProvider events={allDayEvents} resources={[]}>
          <EventDialogProvider>
            <MonthView />
          </EventDialogProvider>
        </EventCalendarProvider>,
      );

      expect(
        screen.getByRole('button', {
          name: 'Multi-day Conference, All day, From Monday, May 5th, 2025 to Wednesday, May 7th, 2025',
        }),
      ).not.to.equal(null);
    });

    it('should render all-day events correctly with main event in start date cell', () => {
      render(
        <EventCalendarProvider
          events={[EventBuilder.new().span('2025-05-04Z', '2025-05-07Z', { allDay: true }).build()]}
          resources={[]}
        >
          <EventDialogProvider>
            <MonthView />
          </EventDialogProvider>
        </EventCalendarProvider>,
      );

      const getEventsFromDate = (date: number) => {
        return screen
          .getAllByRole('gridcell')
          .find((cell) => within(cell).queryByText(new RegExp(`^${date.toString()}`)))!
          .querySelectorAll(`.${eventCalendarClasses.dayGridEvent}`);
      };

      // Main event should render in the start date cell
      expect(getEventsFromDate(5)).toHaveLength(1);

      // Invisible events should exist in the spanned cells
      // Also check that invisible events have aria-hidden attribute
      expect(getEventsFromDate(6)).toHaveLength(1);
      expect(getEventsFromDate(6)[0]).to.have.attribute('aria-hidden', 'true');
      expect(getEventsFromDate(7)).toHaveLength(1);
      expect(getEventsFromDate(7)[0]).to.have.attribute('aria-hidden', 'true');
    });

    it('should render all-day event in first cell of week when event starts before the week', () => {
      render(
        <EventCalendarProvider events={allDayEvents} resources={[]}>
          <EventDialogProvider>
            <MonthView />
          </EventDialogProvider>
        </EventCalendarProvider>,
      );

      const gridCells = screen.getAllByRole('gridcell');
      // Find the first cell of the first week in May 2025
      const firstCell = gridCells.find((cell) => within(cell).queryByText(/4/));

      // Event should render in the first cell of the week since it started before
      expect(within(firstCell!).getByText('Long Event')).not.to.equal(null);
    });

    it('should place invisible events on the same grid row as the main event', () => {
      render(
        <EventCalendarProvider events={allDayEvents} resources={[]}>
          <EventDialogProvider>
            <MonthView />
          </EventDialogProvider>
        </EventCalendarProvider>,
      );

      const allEventOccurrences = getAllEventsByTitle('Grid Row Test');
      const mainEvent = allEventOccurrences.find(
        (event) => event.getAttribute('aria-hidden') !== 'true',
      );
      const invisibleEventOccurrences = allEventOccurrences.filter(
        (event) => event.getAttribute('aria-hidden') === 'true',
      );

      // Extract grid row from style attribute
      const mainEventStyle = mainEvent?.getAttribute('style') || '';
      const mainGridRow = mainEventStyle.match(/--grid-row:\s*(\d+)/)?.[1];

      invisibleEventOccurrences.forEach((invisibleOccurrence) => {
        const invisibleStyle = invisibleOccurrence.getAttribute('style') || '';
        const invisibleGridRow = invisibleStyle.match(/--grid-row:\s*(\d+)/)?.[1];
        expect(invisibleGridRow).to.equal(mainGridRow);
      });
    });

    it('should handle multiple overlapping all-day events with different grid rows', () => {
      const overlappingEvents = [
        EventBuilder.new()
          .span('2025-05-12T00:00:00Z', '2025-05-14T23:59:59Z', { allDay: true })
          .title('Event 1')
          .build(),
        EventBuilder.new()
          .span('2025-05-13T00:00:00Z', '2025-05-15T23:59:59Z', { allDay: true })
          .title('Event 2')
          .build(),
        EventBuilder.new()
          .span('2025-05-16T00:00:00Z', '2025-05-17T23:59:59Z', { allDay: true })
          .title('Event 3')
          .build(),
      ];

      render(
        <EventCalendarProvider events={overlappingEvents} resources={[]}>
          <EventDialogProvider>
            <MonthView />
          </EventDialogProvider>
        </EventCalendarProvider>,
      );

      const event1Elements = getAllEventsByTitle('Event 1');
      const event2Elements = getAllEventsByTitle('Event 2');
      const event3Elements = getAllEventsByTitle('Event 3');

      const event1Main = event1Elements.find((el) => el.getAttribute('aria-hidden') !== 'true');
      const event2Main = event2Elements.find((el) => el.getAttribute('aria-hidden') !== 'true');
      const event3Main = event3Elements.find((el) => el.getAttribute('aria-hidden') !== 'true');

      // Extract grid rows
      const event1Style = event1Main?.getAttribute('style') || '';
      const event2Style = event2Main?.getAttribute('style') || '';
      const event3Style = event3Main?.getAttribute('style') || '';
      const event1GridRow = event1Style.match(/--grid-row:\s*(\d+)/)?.[1];
      const event2GridRow = event2Style.match(/--grid-row:\s*(\d+)/)?.[1];
      const event3GridRow = event3Style.match(/--grid-row:\s*(\d+)/)?.[1];

      expect(event1GridRow).to.equal('1');
      expect(event2GridRow).to.equal('2');
      expect(event3GridRow).to.equal('1');
    });

    it('should render all-day events with correct grid column span', () => {
      render(
        <EventCalendarProvider events={allDayEvents} resources={[]}>
          <EventDialogProvider>
            <MonthView />
          </EventDialogProvider>
        </EventCalendarProvider>,
      );

      const mainEvent = getAllEventsByTitle('Three Day Event').find(
        (el) => el.getAttribute('aria-hidden') !== 'true',
      );
      const eventStyle = mainEvent?.getAttribute('style') || '';
      const gridColumnSpan = eventStyle.match(/--grid-column-span:\s*(\d+)/)?.[1];

      // Should span 3 columns (3 days)
      expect(gridColumnSpan).to.equal('3');
    });

    it('should render one visible event per row if event spans across multiple weeks', () => {
      render(
        <EventCalendarProvider events={allDayEvents} resources={[]}>
          <EventDialogProvider>
            <MonthView />
          </EventDialogProvider>
        </EventCalendarProvider>,
      );

      const eventInstances = getAllEventsByTitle('Multiple week event');

      const visibleInstances = eventInstances.filter(
        (el) => el.getAttribute('aria-hidden') !== 'true',
      );

      expect(visibleInstances).toHaveLength(2);
      // Each segment announces the whole event, not the slice of it that its row shows.
      visibleInstances.forEach((instance) => {
        expect(instance).to.have.attribute(
          'aria-label',
          'Multiple week event, All day, From Monday, May 19th, 2025 to Tuesday, May 27th, 2025',
        );
      });
    });
  });

  describe('multi-resource events', () => {
    const resourceA = ResourceBuilder.new().title('Room A').build();
    const resourceB = ResourceBuilder.new().title('Room B').build();

    it('should render the event once when at least one of its assigned resources is visible', () => {
      const event = EventBuilder.new()
        .title('Team Sync')
        .singleDay('2025-05-01T09:00:00Z')
        .resources([resourceA, resourceB])
        .build();

      render(
        <EventCalendarProvider
          events={[event]}
          resources={[resourceA, resourceB]}
          defaultVisibleResources={{ [resourceB.id]: false }}
        >
          <EventDialogProvider>
            <MonthView />
          </EventDialogProvider>
        </EventCalendarProvider>,
      );

      expect(screen.getAllByText('Team Sync')).toHaveLength(1);
    });

    it('should not render the event when all of its assigned resources are hidden', () => {
      const event = EventBuilder.new()
        .title('Team Sync')
        .singleDay('2025-05-01T09:00:00Z')
        .resources([resourceA, resourceB])
        .build();

      render(
        <EventCalendarProvider
          events={[event]}
          resources={[resourceA, resourceB]}
          defaultVisibleResources={{ [resourceA.id]: false, [resourceB.id]: false }}
        >
          <EventDialogProvider>
            <MonthView />
          </EventDialogProvider>
        </EventCalendarProvider>,
      );

      expect(screen.queryByText('Team Sync')).to.equal(null);
    });
  });

  describe('time navigation', () => {
    it('should go to start of previous month when clicking on the Previous Month button', async () => {
      const onVisibleDateChange = vi.fn();

      const { user } = render(
        <EventCalendar
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          onVisibleDateChange={onVisibleDateChange}
          view="month"
        />,
      );

      const toolbar = withinEventCalendarToolbar();
      // eslint-disable-next-line testing-library/prefer-screen-queries -- scoped query within toolbar
      await user.click(toolbar.getByRole('button', { name: /previous month/i }));
      expect(onVisibleDateChange.mock.lastCall?.[0]).toEqualDateTime(
        adapter.addMonths(adapter.startOfMonth(DEFAULT_TESTING_VISIBLE_DATE), -1),
      );
    });

    it('should go to start of next month when clicking on the Next Month button', async () => {
      const onVisibleDateChange = vi.fn();

      const { user } = render(
        <EventCalendar
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          onVisibleDateChange={onVisibleDateChange}
          view="month"
        />,
      );

      const toolbar = withinEventCalendarToolbar();
      // eslint-disable-next-line testing-library/prefer-screen-queries -- scoped query within toolbar
      await user.click(toolbar.getByRole('button', { name: /next month/i }));
      expect(onVisibleDateChange.mock.lastCall?.[0]).toEqualDateTime(
        adapter.addMonths(adapter.startOfMonth(DEFAULT_TESTING_VISIBLE_DATE), 1),
      );
    });
  });

  describe('aria semantics', () => {
    it('should set aria-rowcount and aria-colcount on the grid root and aria indexes on cells', () => {
      render(
        <EventCalendarProvider {...standaloneDefaults}>
          <EventDialogProvider>
            <MonthView />
          </EventDialogProvider>
        </EventCalendarProvider>,
      );

      const grid = screen.getByRole('grid');
      expect(grid.getAttribute('aria-colcount')).to.equal('7');
      const rowCountAttr = Number(grid.getAttribute('aria-rowcount'));
      expect(rowCountAttr).to.be.greaterThan(1);

      const headerRow = within(grid)
        .getAllByRole('row')
        .find((row) => row.getAttribute('aria-rowindex') === '1');
      expect(headerRow).not.to.equal(undefined);

      const headerCells = within(headerRow!).getAllByRole('columnheader');
      expect(headerCells.length).to.equal(7);
      headerCells.forEach((cell, i) => {
        expect(cell.getAttribute('aria-colindex')).to.equal(String(i + 1));
      });

      const dataRows = within(grid)
        .getAllByRole('row')
        .filter((row) => row.getAttribute('aria-rowindex') !== '1');
      dataRows.forEach((row, weekIdx) => {
        expect(row.getAttribute('aria-rowindex')).to.equal(String(weekIdx + 2));
        const dayCells = within(row).getAllByRole('gridcell');
        dayCells.forEach((cell, dayIdx) => {
          expect(cell.getAttribute('aria-colindex')).to.equal(String(dayIdx + 1));
        });
      });
    });

    it('should keep aria-colcount=7 when showWeekNumber=true and reference the week number via aria-labelledby', () => {
      render(
        <EventCalendarProvider
          {...standaloneDefaults}
          defaultPreferences={{ showWeekNumber: true }}
        >
          <EventDialogProvider>
            <MonthView />
          </EventDialogProvider>
        </EventCalendarProvider>,
      );

      const grid = screen.getByRole('grid');
      expect(grid.getAttribute('aria-colcount')).to.equal('7');

      const headerRow = within(grid)
        .getAllByRole('row')
        .find((row) => row.getAttribute('aria-rowindex') === '1');
      const headerCells = within(headerRow!).getAllByRole('columnheader');
      expect(headerCells.length).to.equal(7);
      headerCells.forEach((cell, i) => {
        expect(cell.getAttribute('aria-colindex')).to.equal(String(i + 1));
      });

      const weekNumberLabels = document.querySelectorAll<HTMLElement>(
        `.${eventCalendarClasses.monthViewWeekNumberCell}`,
      );
      expect(weekNumberLabels.length).to.be.greaterThan(0);
      weekNumberLabels.forEach((label) => {
        expect(label.getAttribute('aria-hidden')).to.equal('true');
        expect(label.getAttribute('role')).to.equal(null);
        expect(label.id).to.have.length.greaterThan(0);
      });

      const dataRows = within(grid)
        .getAllByRole('row')
        .filter((row) => row.getAttribute('aria-rowindex') !== '1');
      dataRows.forEach((row, weekIdx) => {
        const dayCells = within(row).getAllByRole('gridcell');
        expect(dayCells.length).to.equal(7);
        dayCells.forEach((cell, dayIdx) => {
          expect(cell.getAttribute('aria-colindex')).to.equal(String(dayIdx + 1));
          const labelledBy = cell.getAttribute('aria-labelledby') ?? '';
          expect(labelledBy.split(' ')).to.include(weekNumberLabels[weekIdx].id);
        });
      });
    });
  });

  describe('weekStartsOn preference', () => {
    it('should start each week row on Monday when weekStartsOn=1', () => {
      // May 2025: With weekStartsOn=1 the first week row starts on Monday Apr 28.
      // All week rows must have exactly 7 cells and the first cell of each row must be a Monday.
      render(
        <EventCalendarProvider {...standaloneDefaults} defaultPreferences={{ weekStartsOn: 1 }}>
          <EventDialogProvider>
            <MonthView />
          </EventDialogProvider>
        </EventCalendarProvider>,
      );

      const grid = screen.getByRole('grid');
      const dataRows = within(grid)
        .getAllByRole('row')
        .filter((row) => row.getAttribute('aria-rowindex') !== '1');

      // Every row must have exactly 7 gridcells — not 6 (the old getWeekNumber bug).
      dataRows.forEach((row) => {
        const cells = within(row).getAllByRole('gridcell');
        expect(cells.length).to.equal(7);
      });
    });

    it('should start each week row on Sunday when weekStartsOn=0', () => {
      render(
        <EventCalendarProvider {...standaloneDefaults} defaultPreferences={{ weekStartsOn: 0 }}>
          <EventDialogProvider>
            <MonthView />
          </EventDialogProvider>
        </EventCalendarProvider>,
      );

      const grid = screen.getByRole('grid');
      const dataRows = within(grid)
        .getAllByRole('row')
        .filter((row) => row.getAttribute('aria-rowindex') !== '1');

      dataRows.forEach((row) => {
        const cells = within(row).getAllByRole('gridcell');
        expect(cells.length).to.equal(7);
      });
    });

    it('should display correct ISO week numbers when weekStartsOn=1 and showWeekNumber=true', () => {
      // May 2025 week 1 starts Mon Apr 28.
      // ISO week containing May 1 (Thu) = week 18.
      render(
        <EventCalendarProvider
          {...standaloneDefaults}
          defaultPreferences={{ weekStartsOn: 1, showWeekNumber: true }}
        >
          <EventDialogProvider>
            <MonthView />
          </EventDialogProvider>
        </EventCalendarProvider>,
      );

      // ISO week 18 of 2025: Mon Apr 28 – Sun May 4 (contains May 1).
      // The week number label for that row must be "18".
      const weekLabels = screen
        .getAllByRole('row')
        .filter((row) => row.getAttribute('aria-rowindex') !== '1')
        .map((row) => {
          const label = row.querySelector('[aria-hidden="true"]');
          return label ? label.textContent : null;
        })
        .filter(Boolean);

      expect(weekLabels[0]).to.equal('18');
    });
  });
});
