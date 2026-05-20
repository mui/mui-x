import * as React from 'react';
import { screen, within, act, ErrorBoundary, reactMajor } from '@mui/internal-test-utils';
import { TimelineGrid } from '@mui/x-scheduler-internals-premium/timeline-grid';
import { EventTimelinePremiumProvider } from '@mui/x-scheduler-internals-premium/event-timeline-premium-provider';
import { SchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { processDate } from '@mui/x-scheduler-internals/process-date';
import type {
  TimelineGridColumnType,
  TimelineGridCellCoordinates,
} from '@mui/x-scheduler-internals-premium/models';
import {
  adapter,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  ResourceBuilder,
  SchedulerStoreRunner,
  AnyEventCalendarStore,
} from 'test/utils/scheduler';
import { useTimelineGridRootContext } from '../root/TimelineGridRootContext';

describe('TimelineGrid keyboard navigation', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  const resources = [
    ResourceBuilder.new().title('a-resource-1').build(),
    ResourceBuilder.new().title('b-resource-2').build(),
    ResourceBuilder.new().title('c-resource-3').build(),
  ];

  function Grid({
    onStoreMount,
    columnTypes,
    eventCreation,
    resources: resourcesProp = resources,
    children,
  }: {
    onStoreMount?: (store: AnyEventCalendarStore) => void;
    columnTypes?: readonly [TimelineGridColumnType, ...TimelineGridColumnType[]];
    eventCreation?: boolean;
    resources?: typeof resources;
    children?: React.ReactNode;
  } = {}) {
    return (
      <EventTimelinePremiumProvider
        events={[]}
        resources={resourcesProp}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        eventCreation={eventCreation}
      >
        <TimelineGrid.Root columnTypes={columnTypes}>
          <TimelineGrid.Row data-testid="header-row" aria-rowindex={1}>
            <TimelineGrid.Cell>title header</TimelineGrid.Cell>
            <TimelineGrid.Cell>events header</TimelineGrid.Cell>
          </TimelineGrid.Row>
          <TimelineGrid.SubGrid>
            {(resourceId) => (
              <TimelineGrid.TitleRow key={resourceId} data-testid={`title-${resourceId}`}>
                <TimelineGrid.Cell>{resourceId}</TimelineGrid.Cell>
              </TimelineGrid.TitleRow>
            )}
          </TimelineGrid.SubGrid>
          <TimelineGrid.SubGrid>
            {(resourceId) => (
              <TimelineGrid.EventRow
                key={resourceId}
                resourceId={resourceId}
                data-testid={`events-${resourceId}`}
              >
                {() => (
                  <TimelineGrid.Event
                    eventId={`event-${resourceId}`}
                    occurrenceKey={`occ-${resourceId}`}
                    start={processDate(DEFAULT_TESTING_VISIBLE_DATE, adapter)}
                    end={processDate(adapter.addHours(DEFAULT_TESTING_VISIBLE_DATE, 1), adapter)}
                    renderDragPreview={() => null}
                    data-testid={`event-${resourceId}`}
                  />
                )}
              </TimelineGrid.EventRow>
            )}
          </TimelineGrid.SubGrid>
          {children}
        </TimelineGrid.Root>
        {onStoreMount && (
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext as any}
            onMount={onStoreMount}
          />
        )}
      </EventTimelinePremiumProvider>
    );
  }

  function getTitleRows() {
    return within(screen.getAllByRole('rowgroup')[0]).getAllByRole('row');
  }

  function getEventsRows() {
    return within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row');
  }

  describe('vertical navigation (ArrowUp / ArrowDown)', () => {
    it('should move focus to the next row on ArrowDown', async () => {
      const { user } = render(<Grid />);

      const rows = getEventsRows();
      act(() => {
        rows[0].focus();
      });
      await user.keyboard('{ArrowDown}');

      expect(rows[1]).toHaveFocus();
    });

    it('should move focus to the previous row on ArrowUp', async () => {
      const { user } = render(<Grid />);

      const rows = getEventsRows();
      act(() => {
        rows[1].focus();
      });
      await user.keyboard('{ArrowUp}');

      expect(rows[0]).toHaveFocus();
    });

    it('should not move past the first row on ArrowUp', async () => {
      const { user } = render(<Grid />);

      const rows = getEventsRows();
      act(() => {
        rows[0].focus();
      });
      await user.keyboard('{ArrowUp}');

      expect(rows[0]).toHaveFocus();
    });

    it('should not move past the last row on ArrowDown', async () => {
      const { user } = render(<Grid />);

      const rows = getEventsRows();
      const lastRow = rows[rows.length - 1];
      act(() => {
        lastRow.focus();
      });
      await user.keyboard('{ArrowDown}');

      expect(lastRow).toHaveFocus();
    });
  });

  describe('horizontal navigation (ArrowLeft / ArrowRight)', () => {
    it('should move focus from title to events on ArrowRight', async () => {
      const { user } = render(<Grid />);

      act(() => {
        getTitleRows()[0].focus();
      });
      await user.keyboard('{ArrowRight}');

      expect(getEventsRows()[0]).toHaveFocus();
    });

    it('should move focus from events to title on ArrowLeft', async () => {
      const { user } = render(<Grid />);

      act(() => {
        getEventsRows()[0].focus();
      });
      await user.keyboard('{ArrowLeft}');

      expect(getTitleRows()[0]).toHaveFocus();
    });

    it('should preserve row index when switching columns', async () => {
      const { user } = render(<Grid />);

      act(() => {
        getTitleRows()[1].focus();
      });
      await user.keyboard('{ArrowRight}');
      expect(getEventsRows()[1]).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      expect(getTitleRows()[1]).toHaveFocus();
    });

    it('should not move past the leftmost column on ArrowLeft', async () => {
      const { user } = render(<Grid />);

      act(() => {
        getTitleRows()[0].focus();
      });
      await user.keyboard('{ArrowLeft}');

      expect(getTitleRows()[0]).toHaveFocus();
    });

    it('should not move past the rightmost column on ArrowRight', async () => {
      const { user } = render(<Grid />);

      act(() => {
        getEventsRows()[0].focus();
      });
      await user.keyboard('{ArrowRight}');

      expect(getEventsRows()[0]).toHaveFocus();
    });

    it('should follow the order defined by a custom `columnTypes` prop', async () => {
      const { user } = render(<Grid columnTypes={['events', 'title']} />);

      act(() => {
        getEventsRows()[0].focus();
      });
      await user.keyboard('{ArrowRight}');
      expect(getTitleRows()[0]).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      expect(getEventsRows()[0]).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      expect(getEventsRows()[0]).toHaveFocus();
    });
  });

  describe('event creation', () => {
    it('should create a timeline event placeholder on Enter keypress', async () => {
      let store: AnyEventCalendarStore | null = null;
      const { user } = render(
        <Grid
          onStoreMount={(s) => {
            store = s;
          }}
        />,
      );

      const rows = getEventsRows();
      act(() => {
        rows[0].focus();
      });
      await user.keyboard('{Enter}');

      expect(store!.state.occurrencePlaceholder).not.to.equal(null);
      expect(store!.state.occurrencePlaceholder?.type).to.equal('creation');
      expect(store!.state.occurrencePlaceholder?.surfaceType).to.equal('timeline');
    });

    it('should not create a placeholder on Enter from a title row', async () => {
      let store: AnyEventCalendarStore | null = null;
      const { user } = render(
        <Grid
          onStoreMount={(s) => {
            store = s;
          }}
        />,
      );

      act(() => {
        getTitleRows()[0].focus();
      });
      await user.keyboard('{Enter}');

      expect(store!.state.occurrencePlaceholder).to.equal(null);
    });

    it('should not create a placeholder on Enter from a child of the EventRow', async () => {
      let store: AnyEventCalendarStore | null = null;
      const { user } = render(
        <Grid
          onStoreMount={(s) => {
            store = s;
          }}
        />,
      );

      const event = getEventsRows()[0].querySelector(
        '[data-testid^="event-"]',
      ) as HTMLElement | null;
      expect(event).not.to.equal(null);
      act(() => {
        event!.focus();
      });
      await user.keyboard('{Enter}');

      expect(store!.state.occurrencePlaceholder).to.equal(null);
    });

    it('should not create a placeholder on Enter when event creation is disabled', async () => {
      let store: AnyEventCalendarStore | null = null;
      const { user } = render(
        <Grid
          eventCreation={false}
          onStoreMount={(s) => {
            store = s;
          }}
        />,
      );

      act(() => {
        getEventsRows()[0].focus();
      });
      await user.keyboard('{Enter}');

      expect(store!.state.occurrencePlaceholder).to.equal(null);
    });

    it('should expose `data-creation-disabled` on event rows when event creation is disabled', () => {
      render(<Grid eventCreation={false} />);

      getEventsRows().forEach((row) => {
        expect(row).to.have.attribute('data-creation-disabled');
      });
    });

    it('should not expose `data-creation-disabled` when event creation is enabled', () => {
      render(<Grid />);

      getEventsRows().forEach((row) => {
        expect(row).not.to.have.attribute('data-creation-disabled');
      });
    });
  });

  describe('focus state', () => {
    it('should reset the focused cell state when focus leaves the grid', async () => {
      render(
        <React.Fragment>
          <Grid />
          <button type="button" data-testid="outside">
            outside
          </button>
        </React.Fragment>,
      );

      const eventsRows = getEventsRows();
      const events = eventsRows.map(
        (row) => row.querySelector('[data-testid^="event-"]') as HTMLElement,
      );

      act(() => {
        eventsRows[0].focus();
      });
      expect(events[0]).to.have.attribute('tabindex', '0');

      act(() => {
        screen.getByTestId('outside').focus();
      });
      expect(events[0]).to.have.attribute('tabindex', '-1');
      expect(events[1]).to.have.attribute('tabindex', '-1');
    });

    it('should update `focusedCell` when focus lands on a descendant of the row', () => {
      const focusedCellRef: { current: TimelineGridCellCoordinates | null } = { current: null };
      function FocusedCellInspector() {
        const { focusedCell } = useTimelineGridRootContext();
        React.useEffect(() => {
          focusedCellRef.current = focusedCell;
        }, [focusedCell]);
        return null;
      }
      render(
        <Grid>
          <FocusedCellInspector />
        </Grid>,
      );

      const event = getEventsRows()[1].querySelector('[data-testid^="event-"]') as HTMLElement;
      act(() => {
        event.focus();
      });

      expect(focusedCellRef.current).to.deep.equal({ columnType: 'events', rowIndex: 1 });
    });

    it('should not reset `focusedCell` on a null-relatedTarget blur when focus stays inside the grid', async () => {
      const focusedCellRef: { current: TimelineGridCellCoordinates | null } = { current: null };
      function FocusedCellInspector() {
        const { focusedCell } = useTimelineGridRootContext();
        React.useEffect(() => {
          focusedCellRef.current = focusedCell;
        }, [focusedCell]);
        return null;
      }
      render(
        <Grid>
          <FocusedCellInspector />
          <button type="button" data-testid="inside-button">
            inside
          </button>
        </Grid>,
      );

      const eventsRows = getEventsRows();
      act(() => {
        eventsRows[0].focus();
      });
      expect(focusedCellRef.current).to.deep.equal({ columnType: 'events', rowIndex: 0 });

      // Programmatic blur yields `relatedTarget === null` (same shape as portal
      // transitions and window-blur). Focus moves to an element inside the grid
      // that does not update `focusedCell`, so only the deferred recheck can
      // prevent clearing.
      act(() => {
        eventsRows[0].blur();
        screen.getByTestId('inside-button').focus();
      });
      await Promise.resolve();

      expect(focusedCellRef.current).to.deep.equal({ columnType: 'events', rowIndex: 0 });
    });

    it('should not clobber a sibling row state when a previously focused row unmounts', async () => {
      const focusedCellRef: { current: TimelineGridCellCoordinates | null } = { current: null };
      function FocusedCellInspector() {
        const { focusedCell } = useTimelineGridRootContext();
        React.useEffect(() => {
          focusedCellRef.current = focusedCell;
        }, [focusedCell]);
        return null;
      }
      const { setProps, user } = render(
        <Grid resources={resources}>
          <FocusedCellInspector />
        </Grid>,
      );

      // Focus row 0, then arrow-down so focusedCell points to row 1.
      act(() => {
        getEventsRows()[0].focus();
      });
      await user.keyboard('{ArrowDown}');
      expect(focusedCellRef.current).to.deep.equal({ columnType: 'events', rowIndex: 1 });

      // Remove the first resource (the row we originally focused before navigating away).
      // The cleanup of that row must not clobber focusedCell, since it no longer matches.
      setProps({ resources: resources.slice(1) });

      expect(focusedCellRef.current).to.deep.equal({ columnType: 'events', rowIndex: 1 });
    });
  });

  describe('aria-rowindex', () => {
    it('should set `aria-rowindex` on the header and shift data rows to reserve row 1', async () => {
      render(<Grid />);

      expect(screen.getByTestId('header-row')).to.have.attribute('aria-rowindex', '1');
      getTitleRows().forEach((row, i) => {
        expect(row).to.have.attribute('aria-rowindex', String(i + 2));
      });
      getEventsRows().forEach((row, i) => {
        expect(row).to.have.attribute('aria-rowindex', String(i + 2));
      });
    });
  });

  describe('event tabIndex follows row focus', () => {
    it('should make events tabbable only when their parent row is focused', async () => {
      const { user } = render(<Grid />);

      const eventsRows = getEventsRows();
      const events = eventsRows.map((row) => row.querySelector('[data-testid^="event-"]')!);

      // Before any row is focused, all events are not tabbable
      expect(events[0]).to.have.attribute('tabindex', '-1');
      expect(events[1]).to.have.attribute('tabindex', '-1');

      // Focus row 0 → its event becomes tabbable
      act(() => {
        eventsRows[0].focus();
      });
      expect(events[0]).to.have.attribute('tabindex', '0');
      expect(events[1]).to.have.attribute('tabindex', '-1');

      // Navigate to row 1 → row 1's event becomes tabbable, row 0's not
      await user.keyboard('{ArrowDown}');
      expect(events[0]).to.have.attribute('tabindex', '-1');
      expect(events[1]).to.have.attribute('tabindex', '0');
    });
  });

  describe('dev-mode errors', () => {
    it('should throw when a row is rendered outside <TimelineGrid.SubGrid />', () => {
      const errorRef = React.createRef<any>();
      const errorMessage =
        'MUI X Scheduler: TimelineGridSubGridContext is missing. ' +
        '<TimelineGrid.TitleRow /> and <TimelineGrid.EventRow /> must be placed within <TimelineGrid.SubGrid />.';
      const expectedError = reactMajor < 19 ? ['The above error occurred in the'] : [errorMessage];

      expect(() =>
        render(
          <ErrorBoundary ref={errorRef}>
            <EventTimelinePremiumProvider
              events={[]}
              resources={resources}
              visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
            >
              <TimelineGrid.Root>
                <TimelineGrid.TitleRow />
              </TimelineGrid.Root>
            </EventTimelinePremiumProvider>
          </ErrorBoundary>,
        ),
      ).toErrorDev(expectedError);

      expect((errorRef.current as any).errors).to.have.length(1);
      expect((errorRef.current as any).errors[0].toString()).to.include(errorMessage);
    });

    it('should throw when `columnTypes` contains a duplicate entry', () => {
      const errorRef = React.createRef<any>();
      const errorMessage =
        'MUI X Scheduler: The `columnTypes` prop of <TimelineGrid.Root /> contains a duplicate entry "events".';
      const expectedError = reactMajor < 19 ? ['The above error occurred in the'] : [errorMessage];

      expect(() =>
        render(
          <ErrorBoundary ref={errorRef}>
            <Grid columnTypes={['events', 'events']} />
          </ErrorBoundary>,
        ),
      ).toErrorDev(expectedError);

      expect((errorRef.current as any).errors).to.have.length(1);
      expect((errorRef.current as any).errors[0].toString()).to.include(errorMessage);
    });

    it('should throw when a row uses a `columnType` not listed in `columnTypes`', () => {
      const errorRef = React.createRef<any>();
      const errorMessage =
        'MUI X Scheduler: The column type "title" is not listed in the `columnTypes` prop of <TimelineGrid.Root />.';
      const expectedError = reactMajor < 19 ? ['The above error occurred in the'] : [errorMessage];

      expect(() =>
        render(
          <ErrorBoundary ref={errorRef}>
            <EventTimelinePremiumProvider
              events={[]}
              resources={resources}
              visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
            >
              <TimelineGrid.Root columnTypes={['events']}>
                <TimelineGrid.SubGrid>
                  <TimelineGrid.TitleRow />
                </TimelineGrid.SubGrid>
              </TimelineGrid.Root>
            </EventTimelinePremiumProvider>
          </ErrorBoundary>,
        ),
      ).toErrorDev(expectedError);

      expect((errorRef.current as any).errors).to.have.length(1);
      expect((errorRef.current as any).errors[0].toString()).to.include(errorMessage);
    });

    it('should throw when a row is rendered outside <TimelineGrid.Root />', () => {
      const errorRef = React.createRef<any>();
      const errorMessage =
        'MUI X Scheduler: TimelineGridRootContext is missing. ' +
        'TimelineGrid parts must be placed within <TimelineGrid.Root />.';
      const expectedError = reactMajor < 19 ? ['The above error occurred in the'] : [errorMessage];

      expect(() =>
        render(
          <ErrorBoundary ref={errorRef}>
            <EventTimelinePremiumProvider
              events={[]}
              resources={resources}
              visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
            >
              <TimelineGrid.SubGrid>
                <TimelineGrid.TitleRow />
              </TimelineGrid.SubGrid>
            </EventTimelinePremiumProvider>
          </ErrorBoundary>,
        ),
      ).toErrorDev(expectedError);

      expect((errorRef.current as any).errors).to.have.length(1);
      expect((errorRef.current as any).errors[0].toString()).to.include(errorMessage);
    });
  });
});
