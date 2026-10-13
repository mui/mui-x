import * as React from 'react';
import { act, screen, waitFor } from '@mui/internal-test-utils';
import {
  EventTimelinePremium,
  eventTimelinePremiumClasses as classes,
} from '@mui/x-scheduler-premium/event-timeline-premium';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
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

  const getTitleCell = (resourceId: string) =>
    document.querySelector<HTMLElement>(`[id$="-EventTimelinePremiumTitleCell-${resourceId}"]`);

  // The visible rows are between the sticky header and the bottom scrollbar, which is drawn
  // over them. The scrollbars are the hidden siblings of the grid, the bottom one is the lowest.
  function getVisibleBounds() {
    const top = document.querySelector(`.${classes.headerRow}`)!.getBoundingClientRect().bottom;
    const scrollbars = Array.from(
      screen.getByRole('grid').parentElement!.querySelectorAll(':scope > [aria-hidden="true"]'),
    );
    const bottom = Math.max(...scrollbars.map((element) => element.getBoundingClientRect().top));
    return { top, bottom };
  }

  // Focused and fully visible once the virtualizer has positioned the rows for the new scroll.
  // When the grid scrolled, it scrolled just enough: the row is aligned to the edge it entered from.
  async function expectFocusedInView(resourceId: string, previousScrollTop: number) {
    await waitFor(() => {
      const cell = getTitleCell(resourceId);
      expect(document.activeElement).to.equal(cell);

      const scroller = screen.getByRole('grid');
      const scrollTop = scroller.scrollTop;
      // The content only leaves room for the native scrollbar below the last row, so the
      // bottom scrollbar can still cover part of it once the grid is scrolled to the end.
      if (scrollTop >= scroller.scrollHeight - scroller.clientHeight - 1) {
        return;
      }

      const cellRect = cell!.getBoundingClientRect();
      const visible = getVisibleBounds();
      expect(cellRect.top).to.be.at.least(visible.top - 1);
      expect(cellRect.bottom).to.be.at.most(visible.bottom + 1);
      if (scrollTop > previousScrollTop) {
        expect(cellRect.bottom).to.be.closeTo(visible.bottom, 1);
      } else if (scrollTop < previousScrollTop) {
        expect(cellRect.top).to.be.closeTo(visible.top, 1);
      }
    });
  }

  async function renderTimeline() {
    return renderSettled(
      <div style={{ width: 1200, height: 400 }}>
        <EventTimelinePremium
          resources={resources}
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        />
      </div>,
    );
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

  it('should not scroll when the next row is already in view', async () => {
    const { user } = await renderTimeline();
    const scroller = screen.getByRole('grid');

    act(() => {
      getTitleCell(resources[0].id)!.focus();
    });
    await user.keyboard('{ArrowDown}');
    await expectFocusedInView(resources[1].id, 0);

    expect(scroller.scrollTop).to.equal(0);
  });

  it('should scroll a row that is virtualized out into view and focus it with ArrowUp', async () => {
    const { user } = await renderTimeline();
    const lastResource = resources[resources.length - 1];
    const scroller = screen.getByRole('grid');

    act(() => {
      scroller.scrollTop = scroller.scrollHeight;
    });
    await waitFor(() => {
      expect(getTitleCell(lastResource.id)).not.to.equal(null);
    });
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
});
