import * as React from 'react';
import { act, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import {
  EventTimelinePremium,
  eventTimelinePremiumClasses as classes,
} from '@mui/x-scheduler-premium/event-timeline-premium';
import type { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler-internals/models';
import {
  absorbObserverFrames,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';

// The virtualizer only mounts the rows in view when the scroller has real dimensions.
// jsdom doesn't lay out, so skip there.
describe.skipIf(isJSDOM)('<EventTimelinePremium /> arrow-key row navigation', () => {
  const { renderSettled } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  // Zero-padded so the title sort keeps the declaration order.
  const resources = Array.from({ length: 40 }, (_, index) =>
    ResourceBuilder.new()
      .title(`Resource ${String(index).padStart(2, '0')}`)
      .build(),
  );

  // Overlapping events stack into lanes, so this row is taller than the viewport.
  const tallRowIndex = 10;
  const tallRowEvents = Array.from({ length: 15 }, () =>
    EventBuilder.new()
      .resource(resources[tallRowIndex])
      .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
      .build(),
  );

  const getTitleCell = (resourceId: string) =>
    document.querySelector<HTMLElement>(`[id$="-EventTimelinePremiumTitleCell-${resourceId}"]`);

  const getEventsCell = (resourceId: string) =>
    document.querySelector<HTMLElement>(`.${classes.eventsCell}[data-resource-id="${resourceId}"]`);

  // The bottom scrollbars are drawn over the rows: they are the wide hidden siblings of the grid.
  function getBottomScrollbars() {
    return Array.from(
      screen.getByRole('grid').parentElement!.querySelectorAll(':scope > [aria-hidden="true"]'),
    )
      .map((element) => element.getBoundingClientRect())
      .filter((rect) => rect.width > rect.height);
  }

  // The visible rows are between the sticky header and the bottom of the scroller, or the
  // bottom scrollbars.
  function getVisibleBounds() {
    const top = document.querySelector(`.${classes.headerRow}`)!.getBoundingClientRect().bottom;
    const scroller = screen.getByRole('grid');
    const bottom = Math.min(
      scroller.getBoundingClientRect().top + scroller.clientHeight,
      ...getBottomScrollbars().map((rect) => rect.top),
    );
    return { top, bottom };
  }

  // The content only leaves room for the native scrollbar below the last row, so once the
  // grid is scrolled to the end, the taller bottom scrollbar can still cover part of it.
  function getCoveredHeightAtEnd() {
    const scroller = screen.getByRole('grid');
    const nativeScrollbarHeight = scroller.offsetHeight - scroller.clientHeight;
    const bottomScrollbarHeight = Math.max(0, ...getBottomScrollbars().map((rect) => rect.height));
    return Math.max(0, bottomScrollbarHeight - nativeScrollbarHeight);
  }

  function isScrolledToEnd() {
    const scroller = screen.getByRole('grid');
    return scroller.scrollTop >= scroller.scrollHeight - scroller.clientHeight - 1;
  }

  // The row is focused and fully visible. If the grid scrolled, the row is aligned to the edge it
  // entered from.
  async function expectFocusedInView(resourceId: string, previousScrollTop: number) {
    await waitFor(() => {
      const cell = getTitleCell(resourceId);
      expect(document.activeElement).to.equal(cell);

      const scrollTop = screen.getByRole('grid').scrollTop;
      const cellRect = cell!.getBoundingClientRect();
      const visible = getVisibleBounds();
      const bottomTolerance = (isScrolledToEnd() ? getCoveredHeightAtEnd() : 0) + 1;
      expect(cellRect.top).to.be.at.least(visible.top - 1);
      expect(cellRect.bottom).to.be.at.most(visible.bottom + bottomTolerance);
      if (scrollTop > previousScrollTop) {
        expect(cellRect.bottom).to.be.closeTo(visible.bottom, bottomTolerance);
      } else if (scrollTop < previousScrollTop) {
        expect(cellRect.top).to.be.closeTo(visible.top, 1);
      }
    });
  }

  async function expectFocusedAtTop(resourceId: string) {
    await waitFor(() => {
      const cell = getTitleCell(resourceId);
      expect(document.activeElement).to.equal(cell);
      expect(cell!.getBoundingClientRect().top).to.be.closeTo(getVisibleBounds().top, 1);
    });
  }

  function TestTimeline(props: {
    resources: SchedulerResource[];
    events: SchedulerEvent[];
    width: number;
  }) {
    return (
      <div style={{ width: props.width, height: 400 }}>
        <EventTimelinePremium
          resources={props.resources}
          events={props.events}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        />
      </div>
    );
  }

  async function renderTimeline(options: { events?: SchedulerEvent[]; width?: number } = {}) {
    const { events = [], width = 1200 } = options;
    return renderSettled(<TestTimeline resources={resources} events={events} width={width} />);
  }

  async function scrollToEnd() {
    const scroller = screen.getByRole('grid');
    act(() => {
      scroller.scrollTop = scroller.scrollHeight;
    });
    await absorbObserverFrames();
  }

  it('should scroll a row that is virtualized out into view and focus it with ArrowDown', async () => {
    const { user } = await renderTimeline();
    const lastResource = resources[resources.length - 1];
    expect(getTitleCell(lastResource.id)).to.equal(null);

    const scroller = screen.getByRole('grid');
    act(() => {
      getTitleCell(resources[0].id)!.focus();
    });
    for (let index = 1; index < resources.length; index += 1) {
      const previousScrollTop = scroller.scrollTop;
      // eslint-disable-next-line no-await-in-loop
      await user.keyboard('{ArrowDown}');
      // eslint-disable-next-line no-await-in-loop
      await expectFocusedInView(resources[index].id, previousScrollTop);
    }
  });

  it('should scroll a row that is virtualized out into view and focus it with ArrowUp', async () => {
    const { user } = await renderTimeline();
    const lastResource = resources[resources.length - 1];
    const scroller = screen.getByRole('grid');

    await scrollToEnd();
    expect(getTitleCell(lastResource.id)).not.to.equal(null);
    expect(getTitleCell(resources[0].id)).to.equal(null);

    act(() => {
      getTitleCell(lastResource.id)!.focus();
    });
    for (let index = resources.length - 2; index >= 0; index -= 1) {
      const previousScrollTop = scroller.scrollTop;
      // eslint-disable-next-line no-await-in-loop
      await user.keyboard('{ArrowUp}');
      // eslint-disable-next-line no-await-in-loop
      await expectFocusedInView(resources[index].id, previousScrollTop);
    }
  });

  it('should not scroll with ArrowDown when the next row is already in view', async () => {
    const { user } = await renderTimeline();
    const scroller = screen.getByRole('grid');

    act(() => {
      getTitleCell(resources[0].id)!.focus();
    });
    await user.keyboard('{ArrowDown}');
    await expectFocusedInView(resources[1].id, 0);

    expect(scroller.scrollTop).to.equal(0);
  });

  it('should not scroll with ArrowUp when the previous row is already in view', async () => {
    const { user } = await renderTimeline();
    const scroller = screen.getByRole('grid');

    await scrollToEnd();
    const scrollTop = scroller.scrollTop;
    const lastResource = resources[resources.length - 1];
    act(() => {
      getTitleCell(lastResource.id)!.focus();
    });
    await user.keyboard('{ArrowUp}');
    await expectFocusedInView(resources[resources.length - 2].id, scrollTop);

    expect(scroller.scrollTop).to.equal(scrollTop);
  });

  it('should scroll the rows into view when there is no bottom scrollbar', async () => {
    // Wide enough for the whole day, so the grid doesn't scroll horizontally.
    const { user } = await renderTimeline({ width: 7000 });
    const scroller = screen.getByRole('grid');
    expect(getBottomScrollbars()).to.have.length(0);

    act(() => {
      getTitleCell(resources[0].id)!.focus();
    });
    for (let index = 1; index < 15; index += 1) {
      const previousScrollTop = scroller.scrollTop;
      // eslint-disable-next-line no-await-in-loop
      await user.keyboard('{ArrowDown}');
      // eslint-disable-next-line no-await-in-loop
      await expectFocusedInView(resources[index].id, previousScrollTop);
    }
  });

  it('should align a row taller than the viewport to its top', async () => {
    const { user } = await renderTimeline({ events: tallRowEvents });
    const scroller = screen.getByRole('grid');
    const tallRow = resources[tallRowIndex];

    act(() => {
      getTitleCell(resources[0].id)!.focus();
    });
    for (let index = 1; index < tallRowIndex; index += 1) {
      const previousScrollTop = scroller.scrollTop;
      // eslint-disable-next-line no-await-in-loop
      await user.keyboard('{ArrowDown}');
      // eslint-disable-next-line no-await-in-loop
      await expectFocusedInView(resources[index].id, previousScrollTop);
    }
    const visible = getVisibleBounds();
    expect(getTitleCell(tallRow.id)!.getBoundingClientRect().height).to.be.greaterThan(
      visible.bottom - visible.top,
    );

    await user.keyboard('{ArrowDown}');
    await expectFocusedAtTop(tallRow.id);

    // Leaving it downwards shows the next row whole, then coming back aligns it to its top.
    const scrollTopOnTallRow = scroller.scrollTop;
    await user.keyboard('{ArrowDown}');
    await expectFocusedInView(resources[tallRowIndex + 1].id, scrollTopOnTallRow);
    await user.keyboard('{ArrowUp}');
    await expectFocusedAtTop(tallRow.id);
  });

  it('should keep moving when the key repeats before the target row is mounted', async () => {
    await renderTimeline();

    // The last mounted row: the rows below it are only mounted after the scroll.
    const lastMountedIndex = resources.findLastIndex((resource) => getTitleCell(resource.id));
    expect(lastMountedIndex).to.be.lessThan(resources.length - 3);
    const lastMountedCell = getTitleCell(resources[lastMountedIndex].id)!;
    act(() => {
      lastMountedCell.focus({ preventScroll: true });
    });
    const scrollTop = screen.getByRole('grid').scrollTop;
    // A held key repeats before the scroll mounts the target row, so the presses are still
    // dispatched on the row the focus is leaving.
    fireEvent.keyDown(lastMountedCell, { key: 'ArrowDown' });
    fireEvent.keyDown(lastMountedCell, { key: 'ArrowDown' });
    fireEvent.keyDown(lastMountedCell, { key: 'ArrowDown' });

    await expectFocusedInView(resources[lastMountedIndex + 3].id, scrollTop);
  });

  it('should move ArrowRight on the row the focus is moving to', async () => {
    await renderTimeline();

    const lastMountedIndex = resources.findLastIndex((resource) => getTitleCell(resource.id));
    const lastMountedCell = getTitleCell(resources[lastMountedIndex].id)!;
    act(() => {
      lastMountedCell.focus({ preventScroll: true });
    });
    fireEvent.keyDown(lastMountedCell, { key: 'ArrowDown' });
    fireEvent.keyDown(lastMountedCell, { key: 'ArrowRight' });

    await waitFor(() => {
      expect(document.activeElement).to.equal(getEventsCell(resources[lastMountedIndex + 1].id));
    });
  });

  it('should make the events of a row reached with the arrow keys tabbable', async () => {
    const events = resources.map((resource) =>
      EventBuilder.new().resource(resource).singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR).build(),
    );
    const { user } = await renderTimeline({ events });
    const targetIndex = 15;
    expect(getEventsCell(resources[targetIndex].id)).to.equal(null);

    act(() => {
      getEventsCell(resources[0].id)!.focus();
    });
    for (let index = 1; index <= targetIndex; index += 1) {
      // eslint-disable-next-line no-await-in-loop
      await user.keyboard('{ArrowDown}');
    }

    await waitFor(() => {
      const cell = getEventsCell(resources[targetIndex].id)!;
      expect(document.activeElement).to.equal(cell);
      expect(cell.querySelector('[data-occurrence-key]')!.getAttribute('tabindex')).to.equal('0');
    });
  });

  it('should not scroll back to a row the focus left when its resource is removed', async () => {
    const { setProps } = await renderTimeline();
    const scroller = screen.getByRole('grid');

    act(() => {
      getTitleCell(resources[0].id)!.focus();
    });
    // Scrolling away unmounts the focused row, so the focus is lost. Away from the end, so the
    // removal doesn't clamp the scroll.
    act(() => {
      scroller.scrollTop = (scroller.scrollHeight - scroller.clientHeight) / 2;
    });
    await absorbObserverFrames();
    expect(getTitleCell(resources[0].id)).to.equal(null);
    const scrollTop = scroller.scrollTop;

    setProps({ resources: resources.slice(1) });
    await absorbObserverFrames();

    expect(scroller.scrollTop).to.equal(scrollTop);
    expect(document.activeElement).to.equal(document.body);
  });
});
