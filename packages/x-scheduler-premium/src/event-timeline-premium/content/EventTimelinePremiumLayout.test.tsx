import * as React from 'react';
import { screen, waitFor } from '@mui/internal-test-utils';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  ResourceBuilder,
} from 'test/utils/scheduler';
import type { SchedulerResource } from '@mui/x-scheduler-internals/models';
import { isJSDOM } from 'test/utils/skipIf';

function getTitleColumnWidth(): number {
  const grid = screen.getByRole('grid');
  const container = grid.closest('section')!;
  return parseFloat(container.style.getPropertyValue('--title-column-width'));
}

// Title column width is driven by ResizeObserver measurements on the rendered
// title cells; jsdom doesn't implement layout, so these assertions only work in
// the browser project.
describe.skipIf(isJSDOM)('<EventTimelinePremium /> layout', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  function renderTimeline(resources: SchedulerResource[], hostWidth: number = 1200) {
    return render(
      <div style={{ width: hostWidth, height: 600 }}>
        <EventTimelinePremium
          resources={resources}
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          preset="dayAndHour"
          presets={['dayAndHour']}
        />
      </div>,
    );
  }

  describe('title column auto-sizing', () => {
    it('should grow the title column to fit a longer resource title', async () => {
      const short = ResourceBuilder.new().title('A').build();

      const { rerender } = renderTimeline([short]);

      let shortWidth = 0;
      await waitFor(() => {
        shortWidth = getTitleColumnWidth();
        // ResizeObserver has fired and reported a non-default width.
        expect(shortWidth).to.be.greaterThan(0);
      });

      rerender(
        <div style={{ width: 1200, height: 600 }}>
          <EventTimelinePremium
            resources={[
              ResourceBuilder.new()
                .title('A very long resource title that should expand the title column')
                .build(),
            ]}
            events={[]}
            visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
            preset="dayAndHour"
            presets={['dayAndHour']}
          />
        </div>,
      );

      await waitFor(() => {
        expect(getTitleColumnWidth()).to.be.greaterThan(shortWidth);
      });
    });

    it('should cap the title column at one quarter of the container width', async () => {
      // A deliberately huge title would otherwise push the column past containerWidth/4.
      const huge = ResourceBuilder.new().title('X'.repeat(500)).build();

      const hostWidth = 1200;
      renderTimeline([huge], hostWidth);

      await waitFor(() => {
        // Cap is containerWidth / 4. Allow a small tolerance: containerWidth is the
        // measured section width which can be slightly less than the host due to
        // borders, and the title column may also fall short of the cap when the
        // header title contributes a wider scrollWidth than the resource title.
        const width = getTitleColumnWidth();
        const expectedCap = hostWidth / 4;
        expect(width).to.be.greaterThan(0);
        expect(width).to.be.lessThanOrEqual(expectedCap + 1);
      });
    });

    it('should keep the title column at the minimum width for empty/short titles', async () => {
      const tiny = ResourceBuilder.new().title('A').build();

      renderTimeline([tiny]);

      await waitFor(() => {
        // The minWidth wired into useTitleColumnWidth is 50; the header label
        // ("Resource") may push slightly above that, but the column must never
        // collapse below the floor.
        expect(getTitleColumnWidth()).to.be.greaterThanOrEqual(50);
      });
    });
  });

  describe('scrollbar rendering', () => {
    // The three virtual scrollbars (vertical, horizontal events, horizontal title)
    // are the only elements inside the content section that combine
    // `aria-hidden="true"` with `tabindex="-1"`. Filler/indicator overlays use one
    // attribute or the other, not both, so this selector cleanly counts scrollbars.
    function getScrollbars(): HTMLElement[] {
      const grid = screen.getByRole('grid');
      const container = grid.closest('section')!;
      return Array.from(
        container.querySelectorAll<HTMLElement>('[aria-hidden="true"][tabindex="-1"]'),
      );
    }

    it('should not render any scrollbar when a single resource fits the viewport', async () => {
      // Single short-title resource + `year` preset (30 ticks × 200px = 6000px). The host
      // is wider than the content (and one row easily fits vertically), so neither axis
      // should overflow.
      const only = ResourceBuilder.new().title('A').build();

      render(
        <div style={{ width: 8000, height: 600 }}>
          <EventTimelinePremium
            resources={[only]}
            events={[]}
            visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
            preset="year"
            presets={['year']}
          />
        </div>,
      );

      // First wait for the grid to mount and dimensions to settle.
      await waitFor(() => {
        expect(getTitleColumnWidth()).to.be.greaterThan(0);
      });
      // Then assert there is no overflow on either axis.
      expect(getScrollbars()).to.have.length(0);
    });

    it('should render scrollbars when content overflows', async () => {
      // Many resources + a narrow host force both vertical and horizontal overflow,
      // so the vertical scrollbar and at least one horizontal scrollbar must mount.
      const many = Array.from({ length: 50 }, (_, i) =>
        ResourceBuilder.new().title(`Resource ${i}`).build(),
      );

      render(
        <div style={{ width: 600, height: 400 }}>
          <EventTimelinePremium
            resources={many}
            events={[]}
            visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
            preset="dayAndMonth"
            presets={['dayAndMonth']}
          />
        </div>,
      );

      await waitFor(() => {
        expect(getScrollbars().length).to.be.greaterThanOrEqual(2);
      });
    });
  });
});
