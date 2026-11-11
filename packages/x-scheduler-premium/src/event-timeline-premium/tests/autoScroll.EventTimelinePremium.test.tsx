import { moveDrag, startDrag } from 'test/utils/scheduler/dnd';
import { waitFor } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import {
  absorbObserverFrames,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
} from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';
import { eventTimelinePremiumClasses } from '../eventTimelinePremiumClasses';
import {
  createDependencyTimelineRenderer,
  getEventElement,
  resource1,
} from './dependencyTestUtils';

const event = EventBuilder.new()
  .id('event-a')
  .title('Event A')
  .singleDay('2025-07-03T09:00:00Z')
  .resource(resource1)
  .draggable(true)
  .resizable(true)
  .build();

// The auto-scroll comes from the drag engine's viewport, which the timeline wires to its grid.
describe.skipIf(isJSDOM)('<EventTimelinePremium /> drag auto-scroll', () => {
  const { renderSettled } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });
  const { renderTimeline } = createDependencyTimelineRenderer(renderSettled);

  function getGrid() {
    return document.querySelector<HTMLElement>(`.${eventTimelinePremiumClasses.grid}`)!;
  }

  async function expectToScrollWhenDraggedFrom(getSource: () => Element) {
    const grid = getGrid();
    const sourceRect = getSource().getBoundingClientRect();
    const centerY = sourceRect.top + sourceRect.height / 2;
    expect(grid.scrollLeft).to.equal(0);

    startDrag(getSource(), {
      clientX: sourceRect.left + sourceRect.width / 2,
      clientY: centerY,
      mockHitTest: false,
    });
    await absorbObserverFrames();
    // Next to the right edge of the events area.
    moveDrag(grid, {
      clientX: grid.getBoundingClientRect().right - 4,
      clientY: centerY,
      mockHitTest: false,
    });

    await waitFor(() => {
      expect(grid.scrollLeft).to.be.greaterThan(0);
    });
  }

  it('should scroll while an event is dragged to the edge', async () => {
    await renderTimeline({ events: [event] });

    await expectToScrollWhenDraggedFrom(() => getEventElement('Event A'));
  });

  it('should scroll while an event is resized to the edge', async () => {
    await renderTimeline({ events: [event] });

    await expectToScrollWhenDraggedFrom(() =>
      getEventElement('Event A').querySelector('[data-end]')!,
    );
  });

  it('should scroll while a dependency is dragged to the edge', async () => {
    await renderTimeline({ events: [event], dependencies: [] });

    await expectToScrollWhenDraggedFrom(() =>
      document.querySelector('[data-dependency-terminal]')!,
    );
  });
});
